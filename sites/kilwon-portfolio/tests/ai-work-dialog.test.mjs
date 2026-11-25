import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AiWorkDialog from '../components/ai-work-dialog.mjs';

test('AI work starts closed and keeps labeled content inside a native modal', () => {
  const html = renderToStaticMarkup(createElement(AiWorkDialog, null,
    createElement('ul', null, createElement('li', null, '협업 방식')),
  ));
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /<dialog[^>]*aria-labelledby="ai-work-title"/);
  assert.doesNotMatch(html, /<dialog[^>]*\sopen(?:[\s=>])/);
  assert.match(html, /<h2 id="ai-work-title">/);
  assert.match(html, /<form method="dialog">/);
  assert.match(html, /<ul><li>협업 방식<\/li><\/ul><\/div><\/dialog>/);
});
