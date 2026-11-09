import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, projectEvidenceNotice } from '../../../content/projects.mjs';
import ProjectVisual from '../../../components/project-visual';
import ProjectCases from '../../../components/project-cases';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <div className="project-detail wrap">
      <Link className="detail-back" href="/projects/">전체 프로젝트 목록으로</Link>
      <header className="detail-hero">
        <div>
          <p className="detail-category">{project.category}</p>
          <h1>{project.name}</h1>
          <p className="detail-subtitle">{project.subtitle}</p>
          <p className="detail-summary">{project.summary}</p>
          <p className="detail-context">{projectEvidenceNotice}</p>
          <p className="detail-context">{project.organization} / {project.period}<br />{project.role}</p>
          <div className="tag-row">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          <div className="detail-links">
            {project.url ? <a className="button primary" href={project.url} target="_blank" rel="noopener noreferrer">GitHub에서 코드 보기</a>
              : <span className="private-repo">코드 비공개</span>}
            <span>{project.status}</span>
          </div>
        </div>
        {project.featured ? <div className="detail-visual project-open"><ProjectVisual slug={project.slug} /></div> :
          <aside className="decision-panel"><p>핵심 설계</p><strong>{project.decision}</strong><ol>{project.flow.map(step => <li key={step}>{step}</li>)}</ol></aside>}
      </header>
      <ProjectCases name={project.name} sections={project.sections}
        nextProject={{ slug: nextProject.slug, name: nextProject.name, subtitle: nextProject.subtitle }} />
    </div>
  );
}
