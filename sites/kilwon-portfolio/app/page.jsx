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
        {/* 사용자가 고정한 자기소개입니다. 명시적인 변경 요청이 있을 때만 수정합니다. */}
        <h1 id="hero-title" className="fixed-intro">꾸준한 학습과 모든 실패 가능성에 대한 반증을 통해 현재 상황에 맞는 최선의 정답을 찾고자 하는 개발자 전길원입니다.</h1>
        <p className="hero-description">학부 시절 AI/LLM/Agent 서비스를 개발하며, 좋은 프로덕트는 탄탄한 데이터 기반에서 시작함을 느꼈습니다. 이 경험에서 현재는 LLM, Agent 뿐만 아니라 데이터 처리/적재/품질 관리를 위한 데이터 엔지니어링과 모델링, AI를 개발에 효과적으로 활용하기 위한 하네스 엔지니어링과 Practice AI를 꾸준히 학습하고 있습니다.</p>
        <div className="hero-actions"><a className="button primary" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">이력서 확인</a></div>
        <div className="hero-socials"><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그</a></div>
      </div>
      <figure className="profile-portrait">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/kilwon-profile.jpg`} alt="전길원 프로필 사진"
          width={780} height={1040} unoptimized preload />
      </figure>
    </section>
    <section className="projects wrap section" id="projects" aria-labelledby="projects-title">
      <div className="section-top"><div><h2 id="projects-title">대표 프로젝트</h2><p className="section-description">{"데이터를 모으고 검증하는 파이프라인부터, 그 데이터를 검색하고 활용하는 RAG와 대화 Agent, 학습 서비스의 백엔드까지 개발했습니다."}</p><p className="section-description">{projectEvidenceNotice}</p></div></div>
      <ProjectGallery featured />
      <div className="all-work">
        <Link className="button primary all-work-button" href="/projects/">전체 {projects.length}개 프로젝트 보기</Link>
        <p>개인 프로젝트와 인턴십, 대회에서 한 작업을 분야와 문제 해결 유형별로 볼 수 있습니다.</p>
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
          <p>작업이 중간에 멈추면 어디까지 저장돼 있을지 먼저 따져보는 편입니다. 다시 실행할 때 같은 행이 늘어나지는 않는지, 검증에 실패한 결과를 다음 작업이 읽지는 않는지 살핍니다. 프로젝트마다 이 질문을 기준으로 저장 순서와 재처리 방식을 정했습니다.</p>
        </div>
        <div className="principles">
          <article><div>
            <h3>저장은 끝났는데, 완료 처리는 못 했다면</h3>
            <p>Orecast에서는 DB에 가격을 저장한 뒤 메시지 완료 확인을 보내기 전에 프로그램이 멈출 수 있습니다. 같은 가격을 다시 받아도 품목과 날짜가 같은 행을 갱신하고, DB 저장이 끝난 뒤에만 메시지 처리를 확정하도록 했습니다.</p>
          </div></article>
          <article><div>
            <h3>같은 입력으로 다시 실행해도 해결되지 않는 오류</h3>
            <p>Softeer에서는 일시적인 실행 오류와 입력, 품질 오류를 나눴습니다. 재시도는 Airflow가 맡고, 검증에 실패한 데이터는 원인을 남겨 후속 계산에서 제외했습니다. Lambda의 호출 성공 응답 안에 담긴 함수 실패도 별도로 확인했습니다.</p>
          </div></article>
          <article><div>
            <h3>새 색인을 못 만들었을 때 남아 있어야 할 자료</h3>
            <p>Semo에서는 새 청크의 임베딩과 저장을 모두 마친 뒤 이전 청크를 지웠습니다. 중간에 실패하면 이전 자료와 일부 새 자료가 함께 남습니다. 다음 실행은 청크 ID를 다시 대조해 갱신을 이어갑니다.</p>
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
