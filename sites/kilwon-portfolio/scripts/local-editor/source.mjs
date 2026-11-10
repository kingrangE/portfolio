import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { projectGroups, roles, engineeringFields } from '../../content/projects.mjs';

const require = createRequire(import.meta.url);
// shortcut: Next.js 내부 Babel 경로에 의존, 업그레이드로 경로가 바뀌면 파서 연결을 갱신합니다.
const { parse } = require('next/dist/compiled/babel/parser.js');
export const sourceFiles = [
  'app/page.jsx', 'app/projects/page.jsx', 'app/projects/[slug]/page.jsx',
  'components/site-header.jsx', 'components/site-footer.jsx',
  'components/project-visual.jsx', 'components/dcba-visual.jsx', 'components/project-cases.jsx',
  'components/project-gallery.jsx', 'components/project-toc.jsx',
  'content/projects.mjs',
];
export const normalize = value => value.replace(/\s+/g, ' ').trim();
export const revision = source => createHash('sha256').update(source).digest('hex');
const proseFields = new Set(['name', 'subtitle', 'summary', 'decision', 'organization', 'period', 'role', 'status', 'category', 'title', 'lead', 'situation', 'task', 'result', 'note', 'version', 'actionTitle', 'implementation', 'action', 'flow']);

function projectArray(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const array = ast.program.body.find(node => node.type === 'ExportNamedDeclaration'
    && node.declaration?.declarations?.[0]?.id.name === 'projects')?.declaration.declarations[0].init;
  if (array?.type !== 'ArrayExpression') throw new Error('프로젝트 목록 형식을 읽을 수 없습니다.');
  return array;
}
const property = (node, key) => node.properties.find(item => (item.key.value ?? item.key.name) === key)?.value;

export function readProjectCatalog(source) {
  return projectArray(source).elements.map(project => ({
    slug: property(project, 'slug').value,
    name: property(project, 'name').value,
  }));
}

export function addContent(source, input) {
  const projects = projectArray(source);
  function text(value, label, optional = false) {
    if (optional && (value === undefined || value === '')) return '';
    if (typeof value !== 'string' || !value.trim() || value.length > 20000) throw new Error(`${label}: 1~20,000자로 입력해주세요.`);
    return value.trim();
  }
  function list(value, label) {
    if (!Array.isArray(value) || !value.length || value.length > 50) throw new Error(`${label}: 1~50개 항목을 입력해주세요.`);
    return [...new Set(value.map(item => text(item, label)))];
  }
  const sectionInput = input.section;
  if (!sectionInput || typeof sectionInput !== 'object') throw new Error('사례 내용을 입력해주세요.');
  const id = text(sectionInput.id, '사례 주소');
  if (!/^[a-z][a-z0-9-]{0,79}$/.test(id)) throw new Error('사례 주소는 영문 소문자로 시작하고 소문자, 숫자, 하이픈만 사용할 수 있습니다.');
  const section = { id };
  for (const [key, label] of Object.entries({ title: '사례 제목', lead: '한 줄 요약', situation: '문제 상황', task: '해결할 과제', result: '결과' })) section[key] = text(sectionInput[key], label);
  section.tags = list(sectionInput.tags, '사례 기술, 키워드');
  const fields = sectionInput.fields ?? [];
  if (!Array.isArray(fields) || fields.some(field => !engineeringFields.some(item => item.id === field))) throw new Error('지원하지 않는 사례 분야입니다.');
  section.fields = [...new Set(fields)];
  section.action = list(sectionInput.action, '작업 내용');
  for (const key of ['note', 'actionTitle', 'implementation']) {
    const value = text(sectionInput[key], key, true);
    if (value) section[key] = value;
  }
  let target;
  let value;
  let indent;
  let slug;
  if (input.kind === 'section') {
    const project = projects.elements.find(node => property(node, 'slug').value === input.slug);
    if (!project) throw new Error('사례를 추가할 프로젝트를 선택해주세요.');
    slug = input.slug;
    target = property(project, 'sections');
    const occupied = new Set(['case-explorer', 'cases-title', 'main']);
    for (const item of target.elements) {
      const existing = property(item, 'id').value;
      occupied.add(existing); occupied.add(`${existing}-title`);
      for (const alias of property(item, 'aliases')?.elements || []) occupied.add(alias.value);
    }
    if (occupied.has(id) || occupied.has(`${id}-title`)) throw new Error('기존 사례 또는 링크와 겹치는 주소입니다. 다른 사례 주소를 입력해주세요.');
    value = section; indent = 6;
  } else if (input.kind === 'project') {
    const info = input.project;
    if (!info || typeof info !== 'object') throw new Error('프로젝트 정보를 입력해주세요.');
    slug = text(info.slug, '프로젝트 주소');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) throw new Error('프로젝트 주소는 영문 소문자, 숫자, 하이픈으로 입력해주세요.');
    if (projects.elements.some(node => property(node, 'slug').value === slug)) throw new Error('이미 사용 중인 프로젝트 주소입니다.');
    if (!projectGroups.includes(info.group)) throw new Error('프로젝트 분류를 선택해주세요.');
    const categories = list(info.categories, '직무');
    if (!categories.every(category => roles.some(role => role.id === category))) throw new Error('지원하지 않는 직무입니다.');
    value = { slug, group: info.group };
    for (const [key, label] of Object.entries({ name: '프로젝트 이름', subtitle: '부제', summary: '프로젝트 설명', organization: '소속, 수상 이력', period: '기간', role: '담당 업무', status: '팀 구성', category: '분야' })) value[key] = text(info[key], label);
    value.categories = categories;
    value.tags = list(info.tags, '프로젝트 기술, 키워드');
    value.decision = section.lead;
    value.flow = info.flow?.length ? list(info.flow, '처리 흐름') : [];
    const url = text(info.url, '코드 주소', true);
    if (url) {
      let parsed;
      try { parsed = new URL(url); } catch { throw new Error('코드 주소에 올바른 https:// 주소를 입력해주세요.'); }
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('코드 주소에는 인증 정보가 없는 https:// 주소만 사용할 수 있습니다.');
    }
    value.url = url || null;
    value.sections = [section];
    target = projects; indent = 2;
  } else throw new Error('지원하지 않는 추가 요청입니다.');
  if (['main', 'case-explorer', 'cases-title'].some(reserved => reserved === id || reserved === `${id}-title`)) throw new Error('페이지에서 이미 사용 중인 사례 주소입니다.');
  const last = target.elements.at(-1);
  const offset = last?.end ?? target.start + 1;
  const serialized = JSON.stringify(value, null, 2).split('\n').map(line => ' '.repeat(indent) + line).join('\n');
  const updated = source.slice(0, offset) + (last ? ',' : '') + '\n' + serialized + (last ? '' : '\n' + ' '.repeat(indent - 2)) + source.slice(offset);
  parse(updated, { sourceType: 'module', plugins: ['jsx'] });
  return { source: updated, path: `/projects/${slug}/#${id}` };
}

export function readTokens(file, source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const tokens = [];
  let projectName;
  function add(node, scope, kind = 'literal') {
    if (normalize(node.value)) tokens.push({
      id: `${file}:${node.start}`, file, scope, kind,
      start: node.start, end: node.end, value: node.value, projectName,
    });
  }
  function walk(node, visit, parent) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(child => walk(child, visit, parent)); return; }
    visit(node, parent);
    for (const [key, value] of Object.entries(node)) {
      if (!['loc', 'extra', 'comments', 'tokens'].includes(key)) walk(value, visit, node);
    }
  }
  if (file === 'content/projects.mjs') {
    const declaration = ast.program.body.find(node => node.type === 'ExportNamedDeclaration'
      && node.declaration?.declarations?.[0]?.id.name === 'projects');
    for (const project of declaration.declaration.declarations[0].init.elements) {
      const slug = project.properties.find(property => property.key.value === 'slug').value.value;
      projectName = project.properties.find(property => property.key.value === 'name').value.value;
      function fields(object) {
        for (const property of object.properties) {
          const key = property.key.value;
          if (key === 'sections') property.value.elements.forEach(fields);
          else if (proseFields.has(key)) {
            if (property.value.type === 'StringLiteral') add(property.value, slug);
            else if (property.value.type === 'ArrayExpression') {
              property.value.elements.forEach(node => { if (node.type === 'StringLiteral') add(node, slug); });
            }
          }
        }
      }
      fields(project);
    }
  } else {
    walk(ast.program, (node, parent) => {
      if (node.type === 'JSXText') add(node, null, 'jsx');
      if (node.type === 'StringLiteral' && parent?.type === 'JSXExpressionContainer') add(node, null);
    });
  }
  return tokens;
}

export function replaceTokens(source, tokens, ids, value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 20000) throw new Error('1~20,000자의 문구를 입력해주세요.');
  if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length) throw new Error('편집할 문구를 다시 선택해주세요.');
  const selected = ids.map(id => tokens.find(token => token.id === id));
  if (selected.some(token => !token)) throw new Error('편집할 문구가 변경됐습니다. 페이지를 새로고침해주세요.');
  const first = selected[0];
  if (selected.some(token => token.scope !== first.scope || normalize(token.value) !== normalize(first.value))) throw new Error('같은 문구만 함께 저장할 수 있습니다.');
  for (const token of selected.sort((a, b) => b.start - a.start)) {
    const literal = JSON.stringify(value);
    source = source.slice(0, token.start) + (token.kind === 'jsx' ? `{${literal}}` : literal) + source.slice(token.end);
  }
  parse(source, { sourceType: 'module', plugins: ['jsx'] });
  return source;
}
