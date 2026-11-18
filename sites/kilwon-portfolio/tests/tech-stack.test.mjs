import { test } from 'node:test';
import assert from 'node:assert/strict';
import { techStack, stackForExperience } from '../content/tech-stack.mjs';

test('experience filters keep practice and collaboration separate from project experience', () => {
  const names = experience => stackForExperience(experience).flatMap(group => group.items.map(item => item.name));
  assert.deepEqual(names('practiced'), ['Iceberg', 'MongoDB']);
  assert.deepEqual(names('tool'), ['Notion', 'Confluence', 'Jira', 'Slack']);
  assert.ok(!names('frequent').includes('Notion'));
  assert.ok(!names('applied').includes('Iceberg'));
});

test('switching filters leaves the full stack and its group order intact', () => {
  const original = structuredClone(techStack);
  stackForExperience('applied');
  stackForExperience('practiced');
  assert.deepEqual(stackForExperience(), original);
  assert.deepEqual(techStack, original);
  assert.deepEqual(stackForExperience('practiced').map(group => group.title), ['Database & Storage']);
});
