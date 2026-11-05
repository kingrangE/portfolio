import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '../../../content/projects.mjs';
import ProjectVisual from '../../../components/project-visual';
import ProjectToc from '../../../components/project-toc';

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
          <dl className="project-facts"><div><dt>활동</dt><dd>{project.organization}</dd></div><div><dt>기간</dt><dd>{project.period}</dd></div><div><dt>나의 역할</dt><dd>{project.role}</dd></div></dl>
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
      <div className="reading-layout">
        <ProjectToc sections={project.sections.map(({ id, title }) => ({ id, title }))} />
        <article className="project-article" aria-label={`${project.name} 상세 설명`}>
          <div className="project-flow" aria-label="프로젝트 처리 흐름">
            {project.flow.map((step, index) => <span key={step}>{index > 0 && <b aria-hidden="true">→</b>}<span>{step}</span></span>)}
          </div>
          {project.sections.map(section => (
            <section key={section.id} id={section.id} className="case-section" aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}<a className="heading-anchor" href={`#${section.id}`} aria-label={`${section.title} 바로가기`}>#</a></h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map(point => <li key={point}>{point}</li>)}</ul>}
              {section.code && <pre><code>{section.code}</code></pre>}
              {section.callout && <aside className="case-callout">{section.callout}</aside>}
            </section>
          ))}
          <footer className="case-footer"><p>다음 프로젝트</p><Link href={`/projects/${nextProject.slug}/`}>{nextProject.name}<span>{nextProject.subtitle}</span></Link></footer>
        </article>
      </div>
    </div>
  );
}
