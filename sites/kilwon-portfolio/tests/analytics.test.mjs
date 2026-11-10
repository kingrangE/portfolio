import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const layout = readFileSync(new URL('../app/layout.jsx', import.meta.url), 'utf8');
const script = layout.match(/<Script id="google-analytics"[^>]*>\{`([\s\S]*?)`\}/)[1];

function visit(url, storage = new Map()) {
  const window = {
    location: { href: url },
    history: { state: { next: true }, replaceState(state, unused, href) { this.state = state; window.location.href = href; } },
  };
  const localStorage = {
    setItem: (key, value) => storage.set(key, value),
    getItem: key => storage.get(key) ?? null,
    removeItem: key => storage.delete(key),
  };
  runInNewContext(script, { window, localStorage, URL, console });
  return window;
}

test('exclusion persists only in the browser storage that enabled it and can be removed', () => {
  const owner = new Map();
  const activated = visit('https://kingrange.github.io/portfolio/?analytics=off&keep=1#about', owner);
  assert.equal(activated['ga-disable-G-1J7FMFK6M0'], true);
  assert.equal(activated.location.href, 'https://kingrange.github.io/portfolio/?keep=1#about');
  assert.deepEqual(activated.history.state, { next: true });
  assert.equal(visit('https://kingrange.github.io/portfolio/projects/talky/', owner)['ga-disable-G-1J7FMFK6M0'], true);
  assert.equal(visit('https://kingrange.github.io/portfolio/')['ga-disable-G-1J7FMFK6M0'], false);
  assert.equal(visit('https://kingrange.github.io/portfolio/?analytics=on', owner)['ga-disable-G-1J7FMFK6M0'], false);
  assert.equal(owner.size, 0);
});
