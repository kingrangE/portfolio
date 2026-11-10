import { createServer, request as proxyRequest } from 'node:http';
import { readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { sourceFiles, readTokens, replaceTokens, revision, readProjectCatalog, addContent } from './source.mjs';
import { projectGroups, roles, engineeringFields, problemTypes } from '../../content/projects.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const port = 4310;
const previewPort = 4311;
const origin = `http://127.0.0.1:${port}`;
const next = spawn(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', String(previewPort)], {
  cwd: root, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '' },
});
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  next.kill('SIGTERM');
  server.close();
}
next.on('exit', () => { stop(); });
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
const server = createServer(async (req, res) => {
  if (req.headers.host !== `127.0.0.1:${port}` || (req.headers.origin && req.headers.origin !== origin)) {
    json(res, 403, { error: '로컬 편집 화면에서만 접근할 수 있습니다.' }); return;
  }
  const path = new URL(req.url, origin).pathname;
  if (req.method === 'GET' && path === '/__editor/api/content') {
    try {
      const files = sourceFiles.map(file => {
        const source = readFileSync(resolve(root, file), 'utf8');
        return { file, revision: revision(source), tokens: readTokens(file, source) };
      });
      const source = readFileSync(resolve(root, 'content/projects.mjs'), 'utf8');
      json(res, 200, { files, projects: readProjectCatalog(source), projectGroups, roles, engineeringFields, problemTypes });
    } catch { json(res, 500, { error: '소스를 읽지 못했습니다. 파일의 문법과 터미널을 확인해주세요.' }); }
    return;
  }
  if (req.method === 'POST' && ['/__editor/api/save', '/__editor/api/add'].includes(path)) {
    if (req.headers.origin !== origin || req.headers['content-type'] !== 'application/json') {
      json(res, 403, { error: '편집 화면에서 다시 저장해주세요.' }); return;
    }
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 150000) { json(res, 413, { error: '저장할 내용이 너무 큽니다.' }); return; }
      }
      const input = JSON.parse(body);
      const adding = path === '/__editor/api/add';
      const file = adding ? 'content/projects.mjs' : input.file;
      if (!sourceFiles.includes(file)) throw new Error('수정할 수 없는 파일입니다.');
      const filename = resolve(root, file);
      const source = readFileSync(filename, 'utf8');
      if (revision(source) !== input.revision) {
        json(res, 409, { error: '파일이 다른 곳에서 수정됐습니다. 입력 내용을 복사한 뒤 페이지를 새로고침하고 다시 선택해주세요.' }); return;
      }
      const addition = adding ? addContent(source, input) : null;
      const updated = addition ? addition.source : replaceTokens(source, readTokens(file, source), input.ids, input.value);
      const temporary = `${filename}.editor-tmp`;
      try {
        writeFileSync(temporary, updated, { flag: 'wx' });
        if (revision(readFileSync(filename, 'utf8')) !== input.revision) throw new Error('저장 도중 파일이 수정됐습니다. 입력 내용을 복사한 뒤 새로고침해주세요.');
        renameSync(temporary, filename);
      } catch (error) {
        if (error.code !== 'EEXIST') { try { unlinkSync(temporary); } catch {} }
        throw error;
      }
      json(res, 200, { saved: true, path: addition?.path });
    } catch (error) { json(res, 400, { error: error.message }); }
    return;
  }
  const assets = { '/__editor/': ['index.html', 'text/html'], '/__editor/editor.js': ['editor.js', 'text/javascript'], '/__editor/bridge.js': ['bridge.js', 'text/javascript'], '/__editor/style.css': ['style.css', 'text/css'] };
  if (req.method === 'GET' && assets[path]) {
    const [file, type] = assets[path];
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(readFileSync(resolve(here, file))); return;
  }
  if (path.startsWith('/__editor')) { json(res, 404, { error: '페이지를 찾을 수 없습니다.' }); return; }
  if (!['GET', 'HEAD'].includes(req.method)) { json(res, 405, { error: '미리보기에서는 조회만 할 수 있습니다.' }); return; }
  const upstream = proxyRequest({ hostname: '127.0.0.1', port: previewPort, path: req.url, method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${previewPort}`, 'accept-encoding': 'identity' } }, response => {
    const headers = { ...response.headers };
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    res.writeHead(response.statusCode, headers);
    if (headers['content-type']?.includes('text/html')) {
      let html = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { html += chunk; });
      response.on('end', () => res.end(html.replace('</body>', '<script src="/__editor/bridge.js"></script></body>')));
    } else response.pipe(res);
  });
  upstream.on('error', () => {
    if (res.headersSent) { res.end(); return; }
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8', 'Refresh': '2' });
    res.end('<p>미리보기를 준비하고 있습니다. 잠시 후 자동으로 다시 엽니다.</p>');
  });
  upstream.end();
});
server.on('error', error => { console.error(error.message); stop(); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`\n로컬 편집 화면: ${origin}/__editor/\n종료: Ctrl+C\n`));
