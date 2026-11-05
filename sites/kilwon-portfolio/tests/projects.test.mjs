import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, roles, matchesProject } from '../content/projects.mjs';

test('project URLs and section links are unique and valid', () => {
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9-]+$/);
    assert.ok(project.categories.length > 0);
    assert.ok(project.categories.every(category => roles.some(role => role.id === category)));
    for (const field of ['organization', 'period', 'role', 'decision']) assert.ok(project[field]?.trim(), `${project.slug}: missing ${field}`);
    assert.equal(new Set(project.tags).size, project.tags.length);
    assert.ok(project.sections.length >= 2);
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

test('home features exactly the original four projects without losing deep links', () => {
  assert.deepEqual(projects.filter(project => project.featured).map(project => project.slug), ['gaudi', 'talky', 'softeer', 'semo']);
  assert.equal(projects.length, 12);
});

test('role and keyword filters intersect, and resetting restores the catalog', () => {
  const filter = (role, keyword) => projects.filter(project => matchesProject(project, role, keyword));
  assert.equal(filter('all', 'all').length, projects.length);
  assert.deepEqual(filter('data', 'Airflow').map(project => project.slug), ['softeer', 'semo']);
  assert.deepEqual(filter('llm', 'LoRA').map(project => project.slug), ['stage-anxiety']);
  assert.equal(filter('data', 'LoRA').length, 0);
  assert.ok(filter('all', 'Neo4j').some(project => project.slug === 'meeting-assistant'));
  assert.ok(filter('ml', 'all').every(project => !project.categories.includes('llm') || project.slug === 'stage-anxiety'));
});
