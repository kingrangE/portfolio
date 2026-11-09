import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "../components/project-gallery";
import { projects, projectEvidenceNotice } from "../content/projects.mjs";

export default function Home() {
  return (
    <>

    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="intro-name">{"꾸준한 학습과 모든 실패 가능성에 대한 반증을 통해 현재 상황에 맞는 최선의 정답을 찾고자 하는 개발자 전길원입니다."}</p>
        <h1 id="hero-title">데이터를 다루고<br />AI 서비스를 만듭니다.</h1>
        <p className="hero-description">흩어진 정보를 모아 서비스에 필요한 데이터로 가공합니다.<br />AI가 만든 답변을 평가하고,<br />사용자가 쓰는 과정에서 생기는 문제를 해결합니다.</p>
        <div className="hero-actions"><a className="button primary" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">이력서 확인</a></div>
        <div className="hero-socials"><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그</a></div>
      </div>
      <figure className="profile-portrait">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/kilwon-profile.jpg`} alt="전길원 프로필 사진"
          width={780} height={1040} unoptimized preload />
      </figure>
    </section>
    <section className="projects wrap section" id="projects" aria-labelledby="projects-title">
      <div className="section-top"><div><h2 id="projects-title">대표 프로젝트</h2><p className="section-description">{"Platform, Agent, Data Engineering, RAG 프로젝트입니다."}</p><p className="section-description">{projectEvidenceNotice}</p></div></div>
      <ProjectGallery featured />
      <div className="all-work">
        <Link className="button primary all-work-button" href="/projects/">전체 {projects.length}개 프로젝트 보기</Link>
        <p>인턴십과 대회에서 진행한 프로젝트를 직무와 기술별로 볼 수 있습니다.</p>
      </div>
    </section>
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="wrap about-layout section">
        <div className="about-intro">
          <h2 id="about-title">수집부터 재처리까지,<br />데이터 파이프라인을 만듭니다.</h2>
          <p>서로 다른 출처의 데이터를 모아 분석에 필요한 형태로 가공하고 적재했습니다. 작업이 중단됐을 때의 복구, 데이터의 누락과 중복, 반복 계산 비용을 다루며 파이프라인을 개선해 왔습니다.</p>
        </div>
        <div className="principles">
          <article><div>
            <h3>중복 없이 다시 처리하는 적재</h3>
            <p>원자재 가격 수집에서는 DB 저장을 마친 뒤 Redis Streams 메시지의 처리를 확정했습니다. 같은 메시지를 다시 받아도 품목과 날짜를 기준으로 기존 행을 갱신하고, 재시작하면 미처리 메시지부터 적재하도록 했습니다.</p>
          </div></article>
          <article><div>
            <h3>검증을 통과한 데이터만 다음 단계로</h3>
            <p>운행 데이터 파이프라인에 결측, 자료형, 값 범위 검사와 정제 전후 건수 대조를 넣었습니다. 집계 이후에는 금액 합계와 기사 누락, 추천 중복을 확인하고, 검증을 통과한 데이터에만 후속 작업이 접근하도록 했습니다.</p>
          </div></article>
          <article><div>
            <h3>데이터 이동과 재계산 비용을 줄이는 구조</h3>
            <p>Spark에서는 작은 참조 데이터를 Broadcast Join으로 연결하고 반복해서 쓰는 집계 결과를 골라 캐시했습니다. 평가 분석 마트는 전체 재계산에서 증분 처리로 전환해, 새로 적재된 답안에 영향을 받는 사용자와 조직의 집계만 갱신했습니다.</p>
          </div></article>
        </div>
      </div>
    </section>
    <section className="experience wrap section" id="experience" aria-labelledby="experience-title"><div className="section-top"><div><h2 id="experience-title">인턴 및 교육</h2></div><a className="text-link" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">전체 이력서 읽기</a></div><div className="timeline"><article><span className="timeline-period">2026.03 — 2026.06</span><div className="timeline-main"><h3>솔브레인 <span>FDE Intern / AI-TF</span></h3><p>현업 요구사항을 듣고 사내 AI 서비스와 업무 자동화 도구를 개발했습니다.</p><div className="timeline-tags"><span>회의 AI 비서</span><span>데이터 파이프라인</span><span>업무 자동화</span></div></div></article><article><span className="timeline-period">2023.12 — 2025.02</span><div className="timeline-main"><h3>WHATsLAB <span>AI Research Engineer Intern</span></h3><p>가설과 실험을 바탕으로 AI 모델과 LLM 백엔드를 개발했습니다.</p><div className="timeline-tags"><span>sLLM / PEFT</span><span>LLM 평가</span><span>3D Generation</span></div></div></article><article><span className="timeline-period">2026.07 — 2026.08</span><div className="timeline-main"><h3>소프티어 부트캠프 8기 <span>DE / DA</span></h3><p>데이터 파이프라인과 모델링을 학습하고, 차량 추천 데이터 프로덕트를 만들었습니다.</p><div className="timeline-tags"><span>Data Engineering</span><span>우수 소프티어</span></div></div></article><article><span className="timeline-period">2020.03~2026.08</span><div className="timeline-main"><h3>세종대학교 스마트기기공학전공</h3><p>교내 수상 5회<br />학부연구생 7개월<br />KCI 저널 1저자 1편 게재<br />학부생 논문 발표 대회 Agent 연구 논문 1편 발표</p><p>학점 : 3.86/4.5 / 전공 4.12/4.5</p></div></article></div></section>

    </>
  );
}
