import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "../components/project-gallery";
import { projects, projectEvidenceNotice } from "../content/projects.mjs";
import { techStack, stackExperience } from "../content/tech-stack.mjs";

export default function Home() {
  return (
    <>

    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="intro-name">{"데이터 파이프라인과 LLM 서비스를 개발하는 전길원입니다."}</p>
        <h1 id="hero-title">수집부터 재처리까지,<br />데이터 흐름을 설계합니다.</h1>
        <p className="hero-description">Airflow와 Spark로 데이터 수집, 품질 검증, 재처리를 구현했습니다. 원자재 가격 적재에서는 중단 후의 중복 처리를 다뤘고, RAG와 대화 Agent에서는 색인 갱신, 기억 검색과 LLM 평가를 맡았습니다.</p>
        <div className="hero-actions"><a className="button primary" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">이력서 확인</a></div>
        <div className="hero-socials"><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그</a></div>
      </div>
      <figure className="profile-portrait">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/kilwon-profile.jpg`} alt="전길원 프로필 사진"
          width={780} height={1040} unoptimized preload />
      </figure>
    </section>
    <section className="projects wrap section" id="projects" aria-labelledby="projects-title">
      <div className="section-top"><div><h2 id="projects-title">대표 프로젝트</h2><p className="section-description">{"수집과 적재, 품질 검증과 재처리를 다룬 프로젝트와 RAG, 대화 Agent의 구현 경험입니다."}</p><p className="section-description">{projectEvidenceNotice}</p></div></div>
      <ProjectGallery featured />
      <div className="all-work">
        <Link className="button primary all-work-button" href="/projects/">전체 {projects.length}개 프로젝트 보기</Link>
        <p>인턴십과 대회에서 진행한 프로젝트를 직무와 기술별로 볼 수 있습니다.</p>
      </div>
    </section>
    <section className="tech-stack wrap section" id="tech-stack" aria-labelledby="tech-stack-title">
      <div className="section-top">
        <div><h2 id="tech-stack-title">기술 스택</h2></div>
        <a className="text-link" href="https://github.com/kingrangE/kingrangE#tech-stack" target="_blank" rel="noopener noreferrer">GitHub 기술 스택</a>
      </div>
      <ul className="tech-stack-legend" aria-label="사용 경험 범례">
        {Object.entries(stackExperience).map(([experience, info]) => <li key={experience} data-experience={experience}>
          <span className="stack-indicator" aria-hidden="true" /><span>{info.label}<span className="stack-legend-detail">{info.description}</span></span>
        </li>)}
      </ul>
      <div className="tech-stack-groups">
        {techStack.map(group => <div className="tech-stack-row" key={group.title}>
          <div className="tech-stack-label"><h3>{group.title}</h3></div>
          <ul className="tech-stack-items" aria-label={group.title}>{group.items.map(item => <li key={item.name} data-experience={item.experience}
            aria-label={`${item.name}, ${stackExperience[item.experience].label}, ${stackExperience[item.experience].description}`}
            title={`${stackExperience[item.experience].label}: ${stackExperience[item.experience].description}`}>
            <span className="stack-indicator" aria-hidden="true" />{item.name}
          </li>)}</ul>
        </div>)}
      </div>
    </section>
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="wrap about-layout section">
        <div className="about-intro">
          <h2 id="about-title">실패한 뒤의 데이터 상태까지<br />설계에 포함합니다.</h2>
          <p>저는 작업이 어느 지점에서 멈출 수 있는지, 그때 무엇이 저장돼 있는지를 따져보는 편입니다. 같은 데이터를 다시 받아도 되는지, 실패한 결과가 다음 계산에 섞이지 않는지 살피며 재시도와 재처리의 기준을 정해 왔습니다.</p>
        </div>
        <div className="principles">
          <article><div>
            <h3>저장은 끝났는데, 완료 처리는 못 했다면</h3>
            <p>Orecast에서는 DB 저장 직후 프로그램이 종료되면 같은 가격을 다시 받게 됩니다. 이 중단 지점을 고려해 품목과 날짜로 기존 행을 갱신하고, 저장이 끝난 뒤에만 메시지 처리를 확정했습니다.</p>
          </div></article>
          <article><div>
            <h3>같은 입력으로 다시 실행해도 해결되지 않는 오류</h3>
            <p>Softeer에서는 일시적인 실행 오류와 입력, 품질 오류를 나눴습니다. 재시도는 Airflow가 맡고, 검증에 실패한 데이터는 원인을 남겨 후속 계산에서 제외했습니다. Lambda의 호출 성공 응답 안에 담긴 함수 실패도 별도로 확인했습니다.</p>
          </div></article>
          <article><div>
            <h3>색인 교체 중에 실패하면 남겨야 할 것</h3>
            <p>Semo에서는 새 청크의 임베딩과 저장을 마친 뒤에만 이전 청크를 지웠습니다. 중간에 실패하면 기존 자료와 일부 새 자료가 함께 남을 수 있습니다. 다음 실행에서 식별자를 대조해 갱신을 이어가도록 했습니다.</p>
          </div></article>
          <article><div>
            <h3>자막 지연을 줄여도 회의 기록은 남도록</h3>
            <p>MeetNote에서는 밀린 자막을 모두 처리하면 회의 진행을 따라갈 수 없었습니다. 자막 대기열이 차면 오래된 음성을 버리고, 회의록은 별도로 저장한 전체 녹음본에서 작성하도록 경로를 나눴습니다.</p>
          </div></article>
        </div>
      </div>
    </section>
    <section className="experience wrap section" id="experience" aria-labelledby="experience-title"><div className="section-top"><div><h2 id="experience-title">인턴 및 교육</h2></div><a className="text-link" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">전체 이력서 읽기</a></div><div className="timeline"><article><span className="timeline-period">2026.03 — 2026.06</span><div className="timeline-main"><h3>솔브레인 <span>FDE Intern / AI-TF</span></h3><p>현업 요구사항을 듣고 사내 AI 서비스와 업무 자동화 도구를 개발했습니다.</p><div className="timeline-tags"><span>회의 AI 비서</span><span>데이터 파이프라인</span><span>업무 자동화</span></div></div></article><article><span className="timeline-period">2023.12 — 2025.02</span><div className="timeline-main"><h3>WHATsLAB <span>AI Research Engineer Intern</span></h3><p>가설과 실험을 바탕으로 AI 모델과 LLM 백엔드를 개발했습니다.</p><div className="timeline-tags"><span>sLLM / PEFT</span><span>LLM 평가</span><span>3D Generation</span></div></div></article><article><span className="timeline-period">2026.07 — 2026.08</span><div className="timeline-main"><h3>소프티어 부트캠프 8기 <span>DE / DA</span></h3><p>데이터 파이프라인과 모델링을 학습하고, 차량 추천 데이터 프로덕트를 만들었습니다.</p><div className="timeline-tags"><span>Data Engineering</span><span>우수 소프티어</span></div></div></article><article><span className="timeline-period">2020.03~2026.08</span><div className="timeline-main"><h3>세종대학교 스마트기기공학전공</h3><p>교내 수상 5회<br />학부연구생 7개월<br />KCI 저널 1저자 1편 게재<br />학부생 논문 발표 대회 Agent 연구 논문 1편 발표</p><p>학점 : 3.86/4.5 / 전공 4.12/4.5</p></div></article></div></section>

    </>
  );
}
