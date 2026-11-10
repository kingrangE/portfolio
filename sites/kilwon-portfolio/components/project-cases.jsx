'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectToc from './project-toc';
import { engineeringFields, problemTypes, matchesSection } from '../content/projects.mjs';

export default function ProjectCases({ name, sections, nextProject }) {
  const [selected, setSelected] = useState('all');
  const [problem, setProblem] = useState('all');
  const fields = engineeringFields.filter(field => sections.some(section => section.fields?.includes(field.id)));
  const types = problemTypes.filter(type => sections.some(section => section.problemTypes?.includes(type.id)));
  const visible = sections.filter(section => matchesSection(section, selected, problem));
  const selection = [fields.find(field => field.id === selected)?.label, types.find(type => type.id === problem)?.label].filter(Boolean).join(' / ');
  function reset() { setSelected('all'); setProblem('all'); }

  useEffect(() => {
    function revealLinkedCase() {
      const id = window.location.hash.slice(1);
      const target = sections.find(section => section.id === id || section.aliases?.includes(id));
      if (target && !matchesSection(target, selected, problem)) {
        setSelected('all');
        setProblem('all');
      }
    }
    window.addEventListener('hashchange', revealLinkedCase);
    return () => window.removeEventListener('hashchange', revealLinkedCase);
  }, [sections, selected, problem]);

  return <>
    <section className="case-explorer" id="case-explorer" aria-labelledby="cases-title">
      <h2 id="cases-title">핵심 설계와 문제 해결</h2>
      <p className="case-filter-label">분야</p>
      <div className="filters case-filters" role="group" aria-label="사례 분야">
        {[{ id: 'all', label: '전체 사례' }, ...fields].map(field => <button key={field.id} className={`filter${selected === field.id ? ' active' : ''}`}
          aria-pressed={selected === field.id} onClick={() => setSelected(selected === field.id ? 'all' : field.id)}>
          {field.label}
        </button>)}
      </div>
      <p className="case-filter-label">문제 해결 유형</p>
      <div className="filters case-filters" role="group" aria-label="사례 문제 해결 유형">
        {[{ id: 'all', label: '전체 유형' }, ...types].map(type => <button key={type.id} className={`filter${problem === type.id ? ' active' : ''}`}
          aria-pressed={problem === type.id} onClick={() => setProblem(problem === type.id ? 'all' : type.id)}>{type.label}</button>)}
      </div>
      <div className="case-filter-summary">
        <p className="case-count" role="status">{selection ? `${selection} / ${visible.length}개 사례` : `전체 ${sections.length}개 사례`}</p>
        {selection && <button className="text-link" onClick={reset}>전체 사례 보기</button>}
      </div>
    </section>
    <div className={`reading-layout case-reading-layout${visible.length === 0 ? ' case-reading-empty' : ''}`}>
      {visible.length > 0 && <ProjectToc sections={visible} />}
      <article className="project-article" aria-label={`${name} 설계, 문제 해결 사례`}>
        {visible.length === 0 && <div className="catalog-empty"><p>두 조건을 함께 만족하는 사례가 없습니다.</p><button className="button primary" onClick={reset}>전체 사례 보기</button></div>}
        {sections.map(section => <section key={section.id} id={section.id} className="case-section engineering-case"
          hidden={!matchesSection(section, selected, problem)} aria-labelledby={`${section.id}-title`}>
          {section.aliases?.map(id => <span className="case-alias" id={id} key={id} aria-hidden="true" />)}
          {section.version && <p className="case-version">{section.version}</p>}
          <h2 id={`${section.id}-title`}>{section.title}<a className="heading-anchor" href={`#${section.id}`} aria-label={`${section.title} 바로가기`}>#</a></h2>
          <p className="case-lead">{section.lead}</p>
          <div className="case-tags" aria-label="이 사례의 분야">{fields.filter(field => section.fields?.includes(field.id)).map(field => <button key={field.id} className="field-link"
            aria-pressed={selected === field.id} onClick={() => setSelected(selected === field.id ? 'all' : field.id)}>{field.label}</button>)}</div>
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
