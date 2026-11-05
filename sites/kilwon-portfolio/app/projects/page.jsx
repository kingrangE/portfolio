import Link from 'next/link';

import ProjectGallery from '../../components/project-gallery';
import { projects } from '../../content/projects.mjs';

export const metadata = { title: '전체 프로젝트', description: '직무와 기술 키워드로 살펴보는 전길원의 프로젝트와 설계 기록.' };

export default function ProjectsPage() {
  return <section className="project-catalog wrap section" aria-labelledby="catalog-title">
    <header className="catalog-header"><Link className="detail-back" href="/#projects">대표 프로젝트로 돌아가기</Link>
      <h1 id="catalog-title">어떤 문제를 함께 풀까요?</h1>
      <p>AI의 평가와 기억부터 데이터의 품질과 흐름까지.<br />{projects.length}개 프로젝트에서 직접 고민하고 설계한 내용을 모았습니다.</p>
      <p className="catalog-hint">직무와 키워드를 하나씩 선택해 함께 좁혀보세요. 카드의 키워드는 해당 기술의 전체 프로젝트를 보여줍니다.</p>
    </header>
    <ProjectGallery />
  </section>;
}
