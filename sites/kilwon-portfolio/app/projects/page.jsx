import Link from 'next/link';

import ProjectGallery from '../../components/project-gallery';

export const metadata = { title: '전체 프로젝트', description: 'Data Engineering, DBA, LLM, RAG, Agent, Backend 등 분야별로 살펴보는 전길원의 프로젝트와 설계 기록.' };

export default function ProjectsPage() {
  return <section className="project-catalog wrap section" aria-labelledby="catalog-title">
    <header className="catalog-header"><Link className="detail-back" href="/#projects">대표 프로젝트로 돌아가기</Link>
      <h1 id="catalog-title">전체 프로젝트</h1>
      <p className="catalog-hint">분야와 문제 해결 유형을 함께 선택할 수 있습니다. 프로젝트를 열면 두 조건에 맞는 사례로 이동합니다.</p>
    </header>
    <ProjectGallery />
  </section>;
}
