const frame = document.querySelector('#preview');
const page = document.querySelector('#page');
const input = document.querySelector('#text');
const status = document.querySelector('#status');
const save = document.querySelector('#save');
const apply = document.querySelector('#apply');
const reset = document.querySelector('#reset');
const field = document.querySelector('#field');
const createDialog = document.querySelector('#create-dialog');
const createForm = document.querySelector('#create-form');
const createStatus = document.querySelector('#create-status');
const addProject = document.querySelector('#add-project');
const addSection = document.querySelector('#add-section');
const targetProject = document.querySelector('#target-project');
let files = [];
let projects = [];
let selected = null;
let dirty = false;
let saving = false;
let fields = [];
let createKind = 'project';
let creationDirty = false;
let creationRevision;

function send(message) { frame.contentWindow.postMessage(message, location.origin); }
function controls() {
  input.disabled = !selected || saving;
  save.disabled = !selected || !dirty || saving;
  apply.disabled = !selected || saving;
  reset.disabled = !selected || saving;
  page.disabled = saving;
  field.disabled = saving;
  addProject.disabled = saving || !files.length;
  addSection.disabled = saving || !projects.length;
  document.querySelector('#reload').disabled = saving;
}
function discard() {
  if (saving) return false;
  return !dirty || confirm('저장하지 않은 수정 내용이 있습니다. 취소하고 이동할까요?');
}
function clear() {
  selected = null;
  dirty = false;
  input.value = '';
  field.value = '';
  document.querySelector('#selection').textContent = '화면에서 수정할 문구를 클릭하세요.';
  controls();
}
async function loadContent() {
  const response = await fetch('/__editor/api/content', { cache: 'no-store' });
  if (!response.ok) throw new Error('소스 파일을 불러오지 못했습니다. 터미널을 확인해주세요.');
  const data = await response.json();
  ({ files, projects } = data);
  targetProject.replaceChildren(...projects.map(project => new Option(project.name, project.slug)));
  document.querySelector('#project-group').replaceChildren(...data.projectGroups.map(group => new Option(group, group)));
  const roleFields = document.querySelector('#project-roles');
  roleFields.querySelectorAll('label').forEach(label => label.remove());
  for (const role of data.roles) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.name = 'project.categories'; checkbox.value = role.id;
    label.append(checkbox, document.createTextNode(role.label)); roleFields.append(label);
  }
  const topics = document.querySelector('#section-topics');
  topics.querySelectorAll('label').forEach(label => label.remove());
  for (const field of data.engineeringFields) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.name = 'section.fields'; checkbox.value = field.id;
    label.append(checkbox, document.createTextNode(field.label)); topics.append(label);
  }
  for (const token of files.find(file => file.file === 'content/projects.mjs').tokens) {
    if (!token.scope) continue;
    const value = `/projects/${token.scope}/`;
    let option = [...page.options].find(item => item.value === value);
    if (!option) { option = new Option('', value); page.add(option); }
    option.textContent = token.projectName;
  }
  send({ type: 'editor:catalog', files });
  controls();
}
function openCreate(kind) {
  if (!discard()) return;
  clear();
  send({ type: 'editor:cancel' });
  createForm.reset();
  createKind = kind;
  creationDirty = false;
  creationRevision = files.find(file => file.file === 'content/projects.mjs').revision;
  const isProject = kind === 'project';
  document.querySelector('#project-fields').hidden = !isProject;
  document.querySelector('#project-fields').disabled = !isProject;
  document.querySelector('#target-fields').hidden = isProject;
  document.querySelector('#target-fields').disabled = isProject;
  document.querySelector('#create-title').textContent = isProject ? '프로젝트 추가' : '사례 추가';
  document.querySelector('#create-description').textContent = isProject ? '기본 정보와 첫 사례를 입력하세요. 추가하면 프로젝트 목록과 상세 페이지에 표시됩니다.' : '프로젝트를 선택하고 새 사례를 입력하세요. 기존 사례 뒤에 추가됩니다.';
  document.querySelector('#section-legend').textContent = isProject ? '첫 사례' : '추가할 사례';
  createForm.elements.namedItem('section.tags').required = !isProject;
  document.querySelector('#section-tags-help').textContent = isProject ? '쉼표로 구분합니다. 비워두면 프로젝트 기술, 키워드를 사용합니다.' : '쉼표로 구분합니다. 하나 이상 입력하세요.';
  createForm.elements.namedItem('section.id').value = isProject ? 'overview' : '';
  const currentSlug = page.value.match(/^\/projects\/([^/]+)\/$/)?.[1];
  if (currentSlug) targetProject.value = currentSlug;
  createStatus.textContent = '';
  createDialog.showModal();
}
function closeCreate() {
  if (saving || (creationDirty && !confirm('입력한 추가 내용을 취소할까요?'))) return;
  creationDirty = false; createDialog.close();
}
addProject.addEventListener('click', () => openCreate('project'));
addSection.addEventListener('click', () => openCreate('section'));
document.querySelector('#cancel-create').addEventListener('click', closeCreate);
createDialog.addEventListener('cancel', event => { event.preventDefault(); closeCreate(); });
createForm.addEventListener('input', () => { creationDirty = true; });
createForm.addEventListener('change', () => { creationDirty = true; });
createForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (saving) return;
  const data = new FormData(createForm);
  const get = key => String(data.get(key) || '').trim();
  const split = (key, separator) => get(key).split(separator).map(value => value.trim()).filter(Boolean);
  const section = {};
  for (const key of ['id', 'title', 'lead', 'situation', 'task', 'result', 'note', 'actionTitle', 'implementation']) section[key] = get(`section.${key}`);
  section.action = split('section.action', /\r?\n/);
  section.tags = split('section.tags', /[,\n]/);
  section.fields = data.getAll('section.fields');
  const payload = { kind: createKind, revision: creationRevision, section };
  if (createKind === 'project') {
    const project = {};
    for (const key of ['slug', 'name', 'group', 'organization', 'period', 'role', 'status', 'subtitle', 'summary', 'category', 'url']) project[key] = get(`project.${key}`);
    project.categories = data.getAll('project.categories');
    project.tags = split('project.tags', /[,\n]/);
    project.flow = split('project.flow', /\r?\n/);
    if (!project.categories.length) { createStatus.textContent = '관련 직무를 하나 이상 선택해주세요.'; return; }
    if (!section.tags.length) section.tags = project.tags;
    payload.project = project;
  } else payload.slug = get('target');
  saving = true; controls();
  createForm.querySelectorAll('input,textarea,select,button').forEach(element => { element.disabled = true; });
  createStatus.textContent = '추가하고 있습니다.';
  let added = false;
  try {
    const response = await fetch('/__editor/api/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    added = true; creationDirty = false;
    createDialog.close();
    status.textContent = '로컬 소스에 추가했습니다.';
    await loadContent();
    clear();
    page.value = result.path.split('#')[0];
    frame.src = result.path;
  } catch (error) {
    if (added) status.textContent = `추가는 저장됐습니다. 화면 갱신에 실패했습니다: ${error.message}`;
    else createStatus.textContent = `${error.message} 입력 내용은 유지됩니다.`;
  } finally {
    createForm.querySelectorAll('input,textarea,select,button').forEach(element => { element.disabled = false; });
    saving = false; controls();
  }
});
function select(message) {
  if (!discard()) return false;
  const file = files.find(item => item.file === message.file);
  const token = file?.tokens.find(item => item.id === message.ids?.[0]);
  if (!token) return false;
  selected = { file: file.file, revision: file.revision, ids: message.ids, value: token.value };
  input.value = token.value;
  dirty = false;
  document.querySelector('#selection').textContent = `${file.file}${message.ids.length > 1 ? ` / 동일 문구 ${message.ids.length}곳 함께 저장` : ''}`;
  status.textContent = '내용을 수정한 뒤 저장하세요.';
  controls();
  input.focus();
  return true;
}
field.addEventListener('change', () => {
  const choice = fields.find(item => item.ids[0] === field.value);
  if (choice && select(choice)) send({ type: 'editor:choose', ...choice });
});
input.addEventListener('input', () => {
  dirty = input.value !== selected.value;
  status.textContent = dirty ? '아직 저장하지 않았습니다.' : '';
  controls();
});
apply.addEventListener('click', () => {
  send({ type: 'editor:preview', value: input.value });
  status.textContent = '미리보기에만 적용했습니다. 파일에 반영하려면 저장하세요.';
});
reset.addEventListener('click', () => {
  input.value = selected.value;
  dirty = false;
  send({ type: 'editor:preview', value: selected.value });
  status.textContent = '선택한 문구의 수정을 취소했습니다.';
  controls();
});
page.addEventListener('change', () => {
  if (!discard()) { page.value = new URL(frame.contentWindow.location.href).pathname; return; }
  clear();
  frame.src = page.value;
});
document.querySelector('#reload').addEventListener('click', async () => {
  if (!discard()) return;
  try { await loadContent(); clear(); frame.contentWindow.location.reload(); }
  catch (error) { status.textContent = error.message; }
});
window.addEventListener('beforeunload', event => {
  if (dirty || creationDirty || saving) { event.preventDefault(); event.returnValue = ''; }
});
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  const message = event.data;
  if (message?.type === 'editor:ready') {
    send({ type: 'editor:catalog', files });
    page.value = message.path;
    status.textContent = '수정할 문구를 클릭하세요.';
  }
  if (message?.type === 'editor:fields') {
    fields = message.fields;
    field.replaceChildren(new Option('화면에서 클릭하거나 목록에서 선택', ''));
    for (const item of fields) field.add(new Option(item.value.trim().slice(0, 100), item.ids[0]));
  }
  if (message?.type === 'editor:navigate') {
    if (!discard()) return;
    clear(); frame.src = message.path;
  }
  if (message?.type === 'editor:select') {
    if (select(message)) { field.value = message.ids[0]; send({ type: 'editor:accepted' }); }
  }
});
save.addEventListener('click', async () => {
  if (!selected || saving) return;
  saving = true; controls();
  status.textContent = '저장하고 있습니다.';
  try {
    const response = await fetch('/__editor/api/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selected, value: input.value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    dirty = false;
    await loadContent();
    clear();
    frame.contentWindow.location.reload();
    status.textContent = '로컬 소스에 저장했습니다. 미리보기를 갱신하고 있습니다.';
  } catch (error) { status.textContent = error.message; }
  finally { saving = false; controls(); }
});
loadContent().catch(error => { status.textContent = error.message; });
