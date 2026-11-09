import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, roles, matchesProject, projectGroups } from '../content/projects.mjs';

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
    for (const section of project.sections) {
      assert.match(section.id, /^[a-z][a-z0-9-]*$/);
      assert.ok(section.title.trim());
      for (const field of ['lead', 'situation', 'task', 'result']) assert.ok(section[field]?.trim(), `${project.slug}/${section.id}: missing ${field}`);
      assert.ok(section.action.length > 0);
      assert.ok(section.action.every(action => action.trim().length > 0));
      assert.ok(section.tags.length > 0);
      assert.equal(new Set(section.tags).size, section.tags.length);
    }
    if (project.url) assert.equal(new URL(project.url).protocol, 'https:');
  }
});

test('home features the selected four projects in the requested order', () => {
  assert.deepEqual(projects.filter(project => project.featured).map(project => project.slug), ['softeer', 'orecast', 'talky', 'semo']);
  assert.ok(projects.length >= 12);
});

test('role and keyword filters intersect, and resetting restores the catalog', () => {
  const samples = projects.filter(project => ['softeer', 'semo', 'stage-anxiety', 'meeting-assistant', 'cognitive-screening'].includes(project.slug));
  const filter = (role, keyword) => samples.filter(project => matchesProject(project, role, keyword));
  assert.equal(filter('all', 'all').length, samples.length);
  assert.deepEqual(filter('data', 'Airflow').map(project => project.slug), ['softeer', 'semo']);
  assert.deepEqual(filter('llm', 'LoRA').map(project => project.slug), ['stage-anxiety']);
  assert.equal(filter('data', 'LoRA').length, 0);
  assert.ok(filter('all', 'Neo4j').some(project => project.slug === 'meeting-assistant'));
  assert.ok(filter('ml', 'all').every(project => !project.categories.includes('llm') || project.slug === 'stage-anxiety'));
});

test('catalog groups include every project once and retain filtered matches', () => {
  assert.deepEqual(projectGroups, ['수상', '솔브레인 인턴', '왓츠랩 인턴']);
  assert.ok(projects.every(project => projectGroups.includes(project.group)));
  assert.ok(projectGroups.every(group => projects.some(project => project.group === group)));
  const filtered = projects.filter(project => matchesProject(project, 'data', 'Airflow'));
  const grouped = projectGroups.flatMap(group => filtered.filter(project => project.group === group));
  assert.deepEqual(grouped.map(project => project.slug).sort(), filtered.map(project => project.slug).sort());
});
