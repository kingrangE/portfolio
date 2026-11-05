'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects, roles, matchesProject } from '../content/projects.mjs';
import ProjectVisual from './project-visual';

export default function ProjectGallery({ featured = false }) {
  const [role, setRole] = useState('all');
  const [keyword, setKeyword] = useState('all');
  const keywords = [...new Set(projects.flatMap(project => project.tags))]
    .sort((a, b) => projects.filter(p => p.tags.includes(b)).length - projects.filter(p => p.tags.includes(a)).length);
  const visible = projects.filter(project => featured ? project.featured : matchesProject(project, role, keyword));
  function reset() { setRole('all'); setKeyword('all'); }
  return (
    <>
      {!featured && <div className="catalog-filters">
        <fieldset><legend>직무로 찾기</legend><div className="filters">
          {[{ id: 'all', label: '전체' }, ...roles].map(filter => (
            <button key={filter.id} className={`filter${role === filter.id ? ' active' : ''}`}
              aria-pressed={role === filter.id} onClick={() => setRole(filter.id)}>{filter.label}</button>
          ))}
        </div></fieldset>
        <fieldset><legend>기술과 설계로 찾기</legend><div className="filters keyword-filters">
          {['all', ...keywords.slice(0, 11)].map(tag => <button key={tag} className={`filter${keyword === tag ? ' active' : ''}`}
            aria-pressed={keyword === tag} onClick={() => setKeyword(tag === keyword ? 'all' : tag)}>{tag === 'all' ? '전체' : tag}</button>)}
        </div><details className="more-keywords"><summary>다른 키워드 {keywords.length - 11}개{keywords.slice(11).includes(keyword) && ` · ${keyword} 선택됨`}</summary>
          <div className="filters keyword-filters">{keywords.slice(11).map(tag => <button key={tag} className={`filter${keyword === tag ? ' active' : ''}`}
            aria-pressed={keyword === tag} onClick={() => setKeyword(tag === keyword ? 'all' : tag)}>{tag}</button>)}</div>
        </details></fieldset>
        <div className="catalog-results"><p role="status">{visible.length}개 프로젝트{role !== 'all' && ` · ${roles.find(item => item.id === role).label}`}{keyword !== 'all' && ` · ${keyword}`}</p>
          {(role !== 'all' || keyword !== 'all') && <button className="text-link" onClick={reset}>필터 초기화</button>}
        </div>
      </div>}
      <div className={featured ? 'project-grid' : 'catalog-grid'}>
        {visible.map(project => (
          <article key={project.slug} id={project.slug} className={featured ? 'project-card' : 'catalog-card'}>
            <Link className="project-open" href={`/projects/${project.slug}/`} aria-label={`${project.name} 프로젝트 읽기`}>
              {featured && <ProjectVisual slug={project.slug} />}
              <div className="project-body">
                <div className="project-meta"><span>{project.organization}</span><span>{project.status}</span></div>
                <h3>{project.name}<span>{project.subtitle}</span></h3>
                <p>{project.summary}</p>
                {!featured && <p className="design-note">{project.decision}</p>}
              </div>
            </Link>
            <div className="tag-row">{project.tags.map(tag => featured ? <span key={tag}>{tag}</span> :
              <button key={tag} className="keyword-link" aria-pressed={keyword === tag} aria-label={`${tag} 프로젝트 모아보기`}
                onClick={() => { setRole('all'); setKeyword(tag); }}>{tag}</button>)}</div>
          </article>
        ))}
      </div>
      {!featured && visible.length === 0 && <div className="catalog-empty"><p>이 직무와 키워드를 함께 가진 프로젝트가 없습니다.</p><button className="button primary" onClick={reset}>전체 프로젝트 보기</button></div>}
    </>
  );
}
