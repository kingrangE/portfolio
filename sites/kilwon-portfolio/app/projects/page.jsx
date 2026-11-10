import Link from 'next/link';

import ProjectGallery from '../../components/project-gallery';
import { projects, projectEvidenceNotice } from '../../content/projects.mjs';

export const metadata = { title: '전체 프로젝트', description: '직무와 기술 키워드로 살펴보는 전길원의 프로젝트와 설계 기록.' };

export default function ProjectsPage() {
  return <section className="project-catalog wrap section" aria-labelledby="catalog-title">
    <header className="catalog-header"><Link className="detail-back" href="/#projects">대표 프로젝트로 돌아가기</Link>
      <h1 id="catalog-title">전체 프로젝트</h1>
      <p>데이터 파이프라인과 RAG, 대화 Agent, 백엔드와 모델 개선을 다룬 {projects.length}개 프로젝트입니다. 각 프로젝트에서 마주친 문제와 선택한 방법, 결과를 정리했습니다.</p>
      <p className="catalog-hint">{projectEvidenceNotice}</p>
      <p className="catalog-hint">직무와 키워드를 선택하면 조건에 맞는 프로젝트를 볼 수 있습니다. 카드의 키워드를 누르면 해당 기술을 사용한 전체 프로젝트가 표시됩니다.</p>
    </header>
    <ProjectGallery />
  </section>;
}
