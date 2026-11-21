import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import InlineEmphasis from '../components/inline-emphasis.mjs';

const render = text => renderToStaticMarkup(createElement(InlineEmphasis, null, text));

test('emphasizes complete marked phrases and preserves surrounding text', () => {
  const html = render('검색 **111.98ms → 11.30ms** 개선');
  assert.ok(html.includes('<strong>111.98ms → 11.30ms</strong>'));
  assert.ok(html.endsWith(' 개선</span>'));
  assert.ok(html.includes('data-inline-text="검색 **111.98ms → 11.30ms** 개선"'));
});

test('leaves empty or unmatched markers as text', () => {
  assert.equal(render('빈 **** 표시'), '빈 **** 표시');
  assert.equal(render('미완성 **표시'), '미완성 **표시');
});

test('escapes authored HTML in both emphasized text and editor metadata', () => {
  const html = render('**<script>alert("x")</script>**');
  assert.ok(html.includes('<strong>&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&quot;x&quot;'));
});
