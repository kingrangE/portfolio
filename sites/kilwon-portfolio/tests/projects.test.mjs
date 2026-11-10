import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, roles, engineeringFields, problemTypes, fieldsForProject, matchesSection, matchesProject, projectGroups } from '../content/projects.mjs';

test('project URLs and section links are unique and valid', () => {
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9-]+$/);
    assert.ok(project.categories.length > 0);
    assert.ok(project.categories.every(category => roles.some(role => role.id === category)));
    for (const field of ['organization', 'period', 'role', 'decision']) assert.ok(project[field]?.trim(), `${project.slug}: missing ${field}`);
    assert.equal(new Set(project.tags).size, project.tags.length);
    assert.ok(project.sections.length >= 1);
    assert.equal(new Set(project.sections.map(section => section.id)).size, project.sections.length);
    const anchors = ['case-explorer', 'cases-title', ...project.sections.flatMap(section => [section.id, `${section.id}-title`, ...(section.aliases || [])])];
    assert.equal(new Set(anchors).size, anchors.length, `${project.slug}: section IDs, heading IDs and aliases must not collide`);
    for (const section of project.sections) {
      assert.match(section.id, /^[a-z][a-z0-9-]*$/);
      assert.ok(section.title.trim());
      for (const field of ['lead', 'situation', 'task', 'result']) assert.ok(section[field]?.trim(), `${project.slug}/${section.id}: missing ${field}`);
      assert.ok(section.action.length > 0);
      assert.ok(section.action.every(action => action.trim().length > 0));
      assert.ok(section.tags.length > 0);
      assert.equal(new Set(section.tags).size, section.tags.length);
      assert.ok(Array.isArray(section.fields));
      assert.equal(new Set(section.fields).size, section.fields.length);
      assert.ok(section.fields.every(id => engineeringFields.some(field => field.id === id)));
      assert.ok(Array.isArray(section.problemTypes));
      assert.equal(new Set(section.problemTypes).size, section.problemTypes.length);
      assert.ok(section.problemTypes.every(id => problemTypes.some(type => type.id === id)));
    }
    if (project.url) assert.equal(new URL(project.url).protocol, 'https:');
  }
});

test('home retains the selected four projects and adds DCBA as the fifth', () => {
  assert.deepEqual(projects.filter(project => project.featured).map(project => project.slug), ['softeer', 'orecast', 'talky', 'semo', 'dcba']);
  const dcba = projects.find(project => project.slug === 'dcba');
  assert.equal(dcba.group, '개인 프로젝트');
  assert.ok(dcba.categories.includes('backend'));
  assert.equal(dcba.url, 'https://github.com/kingrangE/DCBA');
  assert.ok(projects.length >= 13);
});

test('fields group related cases without treating tool names as fields', () => {
  const filter = field => projects.filter(project => matchesProject(project, field)).map(project => project.slug);
  assert.deepEqual(engineeringFields.map(field => field.id), ['data', 'llm', 'rag', 'agent', 'backend', 'cicd', 'ml']);
  assert.equal(filter('all').length, projects.length);
  assert.deepEqual(filter('cicd'), ['dcba']);
  assert.ok(filter('rag').includes('semo'));
  assert.ok(filter('rag').includes('talky'));
  assert.ok(!filter('rag').includes('dcba'), 'deduplication with ChromaDB does not itself make a RAG case');
  assert.ok(filter('agent').includes('separk'));
  assert.ok(!filter('agent').includes('semo'));
  assert.equal(filter('Airflow').length, 0);
  assert.deepEqual(fieldsForProject(projects.find(project => project.slug === 'dcba')).map(field => field.id), ['llm', 'backend', 'cicd']);
  for (const project of projects) assert.ok(fieldsForProject(project).length > 0);
});

test('catalog groups include every project once and retain filtered matches', () => {
  assert.deepEqual(projectGroups, ['수상', '개인 프로젝트', '솔브레인 인턴', '왓츠랩 인턴']);
  assert.ok(projects.every(project => projectGroups.includes(project.group)));
  assert.ok(projectGroups.every(group => projects.some(project => project.group === group)));
  const filtered = projects.filter(project => matchesProject(project, 'data'));
  const grouped = projectGroups.flatMap(group => filtered.filter(project => project.group === group));
  assert.deepEqual(grouped.map(project => project.slug).sort(), filtered.map(project => project.slug).sort());
});

test('field and problem filters must match the same case', () => {
  assert.deepEqual(problemTypes.map(type => type.id), ['performance', 'recovery', 'quality', 'design', 'evaluation', 'operations']);
  const separateCases = { sections: [
    { fields: ['backend'], problemTypes: ['quality'] },
    { fields: ['data'], problemTypes: ['performance'] },
  ] };
  assert.equal(matchesProject(separateCases, 'backend'), true);
  assert.equal(matchesProject(separateCases, 'all', 'performance'), true);
  assert.equal(matchesProject(separateCases, 'backend', 'performance'), false);
  assert.equal(matchesProject(separateCases, 'data', 'performance'), true);
  const dcba = projects.find(project => project.slug === 'dcba');
  assert.deepEqual(dcba.sections.filter(section => matchesSection(section, 'backend', 'performance')).map(section => section.id), ['cursor-reads']);
  assert.equal(matchesProject(dcba, 'cicd', 'performance'), false);
  assert.deepEqual(dcba.sections.filter(section => matchesSection(section, 'cicd', 'operations')).map(section => section.id), ['schema-order', 'delivery-artifact']);
  const semo = projects.find(project => project.slug === 'semo');
  assert.deepEqual(semo.sections.filter(section => matchesSection(section, 'data', 'recovery')).map(section => section.id), ['indexing']);
  assert.equal(projects.filter(project => matchesProject(project, 'all', 'all')).length, projects.length);
});
