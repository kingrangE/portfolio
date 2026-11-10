'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects, engineeringFields, problemTypes, fieldsForProject, matchesSection, matchesProject, projectGroups } from '../content/projects.mjs';
import ProjectVisual from './project-visual';

export default function ProjectGallery({ featured = false }) {
  const [field, setField] = useState('all');
  const [problem, setProblem] = useState('all');
  const visible = projects.filter(project => featured ? project.featured : matchesProject(project, field, problem));
  function reset() { setField('all'); setProblem('all'); }
  return (
    <>
      {!featured && <div className="catalog-filters">
        <fieldset><legend>분야로 찾기</legend><div className="filters">
          {[{ id: 'all', label: '전체' }, ...engineeringFields].map(filter => (
            <button key={filter.id} className={`filter${field === filter.id ? ' active' : ''}`}
              aria-pressed={field === filter.id} onClick={() => setField(filter.id === field ? 'all' : filter.id)}>{filter.label}</button>
          ))}
        </div></fieldset>
        <fieldset><legend>문제 해결 유형</legend><div className="filters">
          {[{ id: 'all', label: '전체' }, ...problemTypes].map(filter => (
            <button key={filter.id} className={`filter${problem === filter.id ? ' active' : ''}`}
              aria-pressed={problem === filter.id} onClick={() => setProblem(filter.id === problem ? 'all' : filter.id)}>{filter.label}</button>
          ))}
        </div></fieldset>
        <div className="catalog-results"><p role="status">{visible.length}개 프로젝트{field !== 'all' && ` / ${engineeringFields.find(item => item.id === field).label}`}{problem !== 'all' && ` / ${problemTypes.find(item => item.id === problem).label}`}</p>
          {(field !== 'all' || problem !== 'all') && <button className="text-link" onClick={reset}>전체 보기</button>}
        </div>
      </div>}
      {(featured ? ['대표 프로젝트'] : projectGroups).map(group => {
        const grouped = featured ? visible : visible.filter(project => project.group === group);
        if (grouped.length === 0) return null;
        return <section key={group} className={featured ? undefined : 'catalog-group'} aria-label={group}>
          {!featured && <h2>{group} <span>{grouped.length}개</span></h2>}
          <div className={featured ? 'project-grid' : 'catalog-grid'}>
        {grouped.map(project => {
          const relatedCase = field !== 'all' || problem !== 'all' ? project.sections.find(section => matchesSection(section, field, problem)) : undefined;
          const href = `/projects/${project.slug}/${relatedCase ? `#${relatedCase.id}` : ''}`;
          return (
          <article key={project.slug} id={project.slug} className={featured ? 'project-card' : 'catalog-card'}>
            <Link className="project-open" href={href} aria-label={`${project.name}${relatedCase ? `: ${relatedCase.title}` : " 프로젝트"} 읽기`}>
              {featured && <ProjectVisual slug={project.slug} />}
              <div className="project-body">
                <div className="project-meta"><span>{project.organization}</span><span>{project.status}</span></div>
                <h3>{project.name}<span>{project.subtitle}</span></h3>
                <p>{project.summary}</p>
                {!featured && <p className="design-note">{relatedCase ? relatedCase.lead : project.decision}</p>}
              </div>
            </Link>
            <div className="tag-row" aria-label="관련 분야">{fieldsForProject(project).map(item => featured ? <span key={item.id}>{item.label}</span> :
              <button key={item.id} className="field-link" aria-pressed={field === item.id} aria-label={`${item.label} 프로젝트 모아보기`}
                onClick={() => setField(field === item.id ? 'all' : item.id)}>{item.label}</button>)}</div>
            {project.url && <div className="project-repository"><a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.name} ${project.repositoryLabel || 'GitHub 저장소'} 열기`}>{project.repositoryLabel || 'GitHub'}</a></div>}
          </article>
          );
        })}
          </div>
        </section>;
      })}
      {!featured && visible.length === 0 && <div className="catalog-empty"><p>선택한 분야와 문제 해결 유형에 해당하는 사례가 없습니다.</p><button className="button primary" onClick={reset}>전체 프로젝트 보기</button></div>}
    </>
  );
}
