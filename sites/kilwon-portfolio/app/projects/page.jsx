import Link from 'next/link';

import ProjectGallery from '../../components/project-gallery';
import { projects, projectEvidenceNotice } from '../../content/projects.mjs';

export const metadata = { title: '전체 프로젝트', description: 'Data Engineering, LLM, RAG, Agent, Backend 등 분야별로 살펴보는 전길원의 프로젝트와 설계 기록.' };

export default function ProjectsPage() {
  return <section className="project-catalog wrap section" aria-labelledby="catalog-title">
    <header className="catalog-header"><Link className="detail-back" href="/#projects">대표 프로젝트로 돌아가기</Link>
      <h1 id="catalog-title">전체 프로젝트</h1>
      <p>데이터 파이프라인과 RAG, 대화 Agent, 백엔드와 모델 개선을 다룬 {projects.length}개 프로젝트입니다. 각 프로젝트에서 마주친 문제와 선택한 방법, 결과를 정리했습니다.</p>
      <p className="catalog-hint">{projectEvidenceNotice}</p>
      <p className="catalog-hint">분야와 문제 해결 유형을 함께 선택할 수 있습니다. 프로젝트를 열면 두 조건에 맞는 사례로 이동합니다.</p>
    </header>
    <ProjectGallery />
  </section>;
}
