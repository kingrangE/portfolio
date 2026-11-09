'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectToc from './project-toc';

export default function ProjectCases({ name, sections, nextProject }) {
  const [selected, setSelected] = useState('all');
  const tags = [...new Set(sections.flatMap(section => section.tags))];
  const visible = sections.filter(section => selected === 'all' || section.tags.includes(selected));

  useEffect(() => {
    function revealLinkedCase() {
      const id = window.location.hash.slice(1);
      const target = sections.find(section => section.id === id || section.aliases?.includes(id));
      if (target && selected !== 'all' && !target.tags.includes(selected)) setSelected('all');
    }
    window.addEventListener('hashchange', revealLinkedCase);
    return () => window.removeEventListener('hashchange', revealLinkedCase);
  }, [sections, selected]);

  return <>
    <section className="case-explorer" id="case-explorer" aria-labelledby="cases-title">
      <h2 id="cases-title">핵심 설계와 문제 해결</h2>
      <div className="filters case-filters" role="group" aria-label="설계, 문제 해결 사례 태그">
        {['all', ...tags].map(tag => <button key={tag} className={`filter${selected === tag ? ' active' : ''}`}
          aria-pressed={selected === tag} onClick={() => setSelected(selected === tag ? 'all' : tag)}>
          {tag === 'all' ? '전체 사례' : tag}
        </button>)}
      </div>
      <p className="case-count" role="status">{selected === 'all' ? `전체 ${sections.length}개 사례` : `${selected} 관련 ${visible.length}개 사례`}</p>
    </section>
    <div className="reading-layout case-reading-layout">
      <ProjectToc sections={visible} />
      <article className="project-article" aria-label={`${name} 설계, 문제 해결 사례`}>
        {sections.map(section => <section key={section.id} id={section.id} className="case-section engineering-case"
          hidden={selected !== 'all' && !section.tags.includes(selected)} aria-labelledby={`${section.id}-title`}>
          {section.aliases?.map(id => <span className="case-alias" id={id} key={id} aria-hidden="true" />)}
          {section.version && <p className="case-version">{section.version}</p>}
          <h2 id={`${section.id}-title`}>{section.title}<a className="heading-anchor" href={`#${section.id}`} aria-label={`${section.title} 바로가기`}>#</a></h2>
          <p className="case-lead">{section.lead}</p>
          <div className="case-tags" aria-label="이 사례의 태그">{section.tags.map(tag => <button key={tag} className="keyword-link"
            aria-pressed={selected === tag} onClick={() => setSelected(selected === tag ? 'all' : tag)}>{tag}</button>)}</div>
          <div className="case-narrative">
            <p>{section.situation} {section.task}</p>
            <h3>{section.actionTitle || '설계와 구현'}</h3>
            <ul>{section.action.map(action => <li key={action}>{action}</li>)}</ul>
            {section.implementation && <pre aria-label="구현 흐름"><code>{section.implementation}</code></pre>}
            <div className="case-outcome"><h3>적용 결과</h3><p>{section.result}</p>
              {section.note && <p className="case-note">{section.note}</p>}
            </div>
          </div>
        </section>)}
        <footer className="case-footer"><p>다음 프로젝트</p><Link href={`/projects/${nextProject.slug}/`}>{nextProject.name}<span>{nextProject.subtitle}</span></Link></footer>
      </article>
    </div>
  </>;
}
