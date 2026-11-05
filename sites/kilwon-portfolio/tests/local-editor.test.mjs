import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readTokens, replaceTokens, revision, readProjectCatalog, addContent } from '../scripts/local-editor/source.mjs';

test('JSX edits stay strings even when text contains code, markup, quotes and newlines', () => {
  const file = 'app/page.jsx';
  const source = 'export default function Home() { return <p>원래 문구</p>; }';
  const tokens = readTokens(file, source);
  const value = '새 문구 "인용"\n{process.exit()} <script> & 한글';
  const updated = replaceTokens(source, tokens, [tokens[0].id], value);
  assert.equal(readTokens(file, updated)[0].value, value);
  assert.ok(updated.includes(`{${JSON.stringify(value)}}`));
});

test('project edits preserve IDs, URLs, metadata and other projects', () => {
  const file = 'content/projects.mjs';
  const source = 'export const projects = [{"slug":"talky","name":"Talky","source":"https://example.com","sourceReviewed":"2026-11-05","tags":["Neo4j"],"summary":"동일 문구","sections":[{"id":"memory","lead":"동일 문구","aliases":["voice"]}]},{"slug":"other","name":"Other","summary":"동일 문구","sections":[]}];';
  const tokens = readTokens(file, source);
  assert.ok(!tokens.some(token => ['memory', 'voice', 'Neo4j', '2026-11-05', 'https://example.com'].includes(token.value)));
  const ids = tokens.filter(token => token.scope === 'talky' && token.value === '동일 문구').map(token => token.id);
  const updated = replaceTokens(source, tokens, ids, '3홉으로 탐색합니다.');
  const after = readTokens(file, updated);
  assert.equal(after.filter(token => token.value === '3홉으로 탐색합니다.').length, 2);
  assert.equal(after.find(token => token.scope === 'other' && token.value === '동일 문구').value, '동일 문구');
  assert.ok(updated.includes('"tags":["Neo4j"]'));
  assert.notEqual(revision(updated), revision(source));
});

test('empty, oversized, unknown and unrelated selections cannot overwrite source', () => {
  const source = 'export default function Home() { return <><p>첫 문구</p><p>다른 문구</p></>; }';
  const tokens = readTokens('app/page.jsx', source);
  for (const value of ['', '  ', 'x'.repeat(20001), null]) {
    assert.throws(() => replaceTokens(source, tokens, [tokens[0].id], value));
  }
  assert.throws(() => replaceTokens(source, tokens, ['unknown'], '수정'));
  assert.throws(() => replaceTokens(source, tokens, tokens.map(token => token.id), '수정'));
  assert.throws(() => replaceTokens(source, tokens, [tokens[0].id, tokens[0].id], '수정'));
});

const section = {
  id: 'memory', title: '기억 검색', lead: '관련 대화를 찾습니다.',
  situation: '이전 대화를 찾기 어려웠습니다.', task: '주제에 맞는 대화를 찾아야 했습니다.',
  action: ['주제 관계를 저장했습니다.', '3홉까지 탐색했습니다.'],
  result: '관련 대화를 조회하도록 구현했습니다.', tags: ['Neo4j'],
};
const project = {
  slug: 'new-project', name: '새 프로젝트', group: '수상', organization: '대회 수상',
  period: '2026.11', role: 'AI 담당', status: '2인 팀', subtitle: '대화 검색',
  summary: '사용자가 입력한 프로젝트 설명', category: '대화 Agent',
  categories: ['llm'], tags: ['Neo4j'], flow: [], url: '',
};
const catalogSource = 'export const projects = [{"slug":"talky","name":"Talky","sections":[{"id":"overview","aliases":["voice"],"title":"기존 사례"}]}];\nexport const untouched = "유지";';

test('adding a project includes its first case without rewriting existing projects or exports', () => {
  const result = addContent(catalogSource, { kind: 'project', project, section });
  assert.equal(result.path, '/projects/new-project/#memory');
  assert.deepEqual(readProjectCatalog(result.source), [{ slug: 'talky', name: 'Talky' }, { slug: 'new-project', name: '새 프로젝트' }]);
  assert.ok(result.source.includes('{"slug":"talky","name":"Talky","sections":[{"id":"overview","aliases":["voice"],"title":"기존 사례"}]}'));
  assert.ok(result.source.endsWith('export const untouched = "유지";'));
  const tokens = readTokens('content/projects.mjs', result.source);
  assert.ok(tokens.some(token => token.scope === 'new-project' && token.value === section.result));
  assert.ok(!result.source.includes('"featured": true'));
});

test('adding a case preserves existing links and rejects collisions with IDs, aliases and heading IDs', () => {
  const result = addContent(catalogSource, { kind: 'section', slug: 'talky', section });
  assert.equal(result.path, '/projects/talky/#memory');
  assert.ok(result.source.includes('"aliases":["voice"]'));
  assert.equal(readTokens('content/projects.mjs', result.source).filter(token => token.value === section.title).length, 1);
  for (const id of ['overview', 'voice', 'overview-title', 'cases', 'main', 'case-explorer']) {
    assert.throws(() => addContent(catalogSource, { kind: 'section', slug: 'talky', section: { ...section, id } }));
  }
  assert.throws(() => addContent(result.source, { kind: 'section', slug: 'talky', section }));
});

test('new content validates required fields, classifications, routes and external URLs', () => {
  for (const patch of [
    { slug: 'talky' }, { slug: '../escape' }, { name: '' }, { group: 'unknown' },
    { categories: ['unknown'] }, { categories: [] }, { tags: [] },
    { url: 'javascript:alert(1)' }, { url: 'https://user:secret@example.com' },
  ]) assert.throws(() => addContent(catalogSource, { kind: 'project', project: { ...project, ...patch }, section }));
  for (const patch of [{ id: 'cases' }, { id: '한글' }, { action: [] }, { tags: [] }, { result: '' }]) {
    assert.throws(() => addContent(catalogSource, { kind: 'project', project, section: { ...section, ...patch } }));
  }
  assert.throws(() => addContent(catalogSource, { kind: 'section', slug: 'missing', section }));
});

test('quoted and code-like input stays editable text and empty arrays accept additions', () => {
  const value = '"따옴표"\n</script> {process.exit()}';
  const result = addContent('export const projects = [];', { kind: 'project', project: { ...project, summary: value }, section });
  assert.ok(readTokens('content/projects.mjs', result.source).some(token => token.value === value));
  const emptySections = 'export const projects = [{"slug":"talky","name":"Talky","sections":[]}];';
  assert.equal(addContent(emptySections, { kind: 'section', slug: 'talky', section }).path, '/projects/talky/#memory');
});
