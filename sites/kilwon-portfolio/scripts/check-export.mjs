import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projects } from '../content/projects.mjs';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const home = readFileSync('out/index.html', 'utf8');
const catalog = readFileSync('out/projects/index.html', 'utf8');
assert.ok(home.includes(`href="${basePath}/projects/"`));
assert.ok(home.includes(`src="${basePath}/images/kilwon-profile.jpg"`));
assert.equal((home.match(/class="project-card"/g) || []).length, 4);
assert.equal((catalog.match(/class="catalog-card"/g) || []).length, projects.length);
assert.ok(home.includes('꾸준한 학습과 모든 실패 가능성에 대한 반증'));
assert.ok(!home.includes('project-dialog'));
for (const project of projects) {
  const route = `/projects/${project.slug}/`;
  assert.ok(catalog.includes(`href="${basePath}${route}"`), `Catalog must link to ${route}`);
  if (project.featured) assert.ok(home.includes(`href="${basePath}${route}"`), `Home must feature ${route}`);
  const html = readFileSync(`out${route}index.html`, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${route}`);
  assert.ok(html.includes('aria-label="설계·문제 해결 사례 태그"'), `Missing case filters in ${route}`);
  assert.equal((html.match(/class="case-narrative"/g) || []).length, project.sections.length, `Missing case narratives in ${route}`);
  for (const section of project.sections) {
    assert.ok(html.includes(`href="#${section.id}"`), `Missing TOC link ${route}#${section.id}`);
    assert.ok(ids.includes(section.id), `Missing section target ${route}#${section.id}`);
    assert.ok(ids.includes(`${section.id}-title`), `Missing section heading in ${route}`);
    for (const alias of section.aliases || []) assert.ok(ids.includes(alias), `Lost deep link ${route}#${alias}`);
  }

}
assert.ok(existsSync('out/404.html'));
for (const html of [home, catalog, readFileSync('out/404.html', 'utf8'), ...projects.map(project => readFileSync(`out/projects/${project.slug}/index.html`, 'utf8'))]) {
  for (const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const pathname = decodeURIComponent(match[1]);
    assert.ok(pathname.startsWith(`${basePath}/`), `Link escapes deployment base: ${pathname}`);
    const local = pathname.slice(basePath.length);
    assert.ok(existsSync(`out${local.endsWith('/') ? `${local}index.html` : local}`), `Missing local target ${pathname}`);
  }
}
console.log('PASS: four featured projects, full catalog links, all project pages, TOC targets, unique IDs, base path, images, local links, assets, 404, preserved introduction');
