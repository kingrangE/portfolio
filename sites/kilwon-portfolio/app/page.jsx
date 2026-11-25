import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "../components/project-gallery";
import TechStack from "../components/tech-stack";
import AiWorkDialog from "../components/ai-work-dialog.mjs";
import { projects } from "../content/projects.mjs";

export default function Home() {
  return (
    <>

    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        {/* 상단 소개와 하단 본문은 사용자 고정 원문입니다. 명시적인 변경 요청 없이 수정하지 않습니다. */}
        <p className="intro-name">모든 실패 가능성에 대한 반증을 통해 현재 상황에 맞는 최선의 정답을 찾고자 하는 개발자 전길원입니다.</p>
        <h1 id="hero-title">데이터 파이프라인과 LLM 서비스를 개발합니다.</h1>
        <p className="hero-description">학부 시절 AI/LLM/Agent 서비스를 개발하며, 좋은 프로덕트는 탄탄한 데이터 기반에서 시작함을 느꼈습니다. 이 경험에서 현재는 LLM, Agent 뿐만 아니라 데이터 처리/적재/품질 관리를 위한 데이터 엔지니어링과 모델링, AI를 개발에 효과적으로 활용하기 위한 하네스 엔지니어링과 Practice AI를 꾸준히 학습하고 있습니다.</p>
        <div className="hero-actions">
          <a className="button primary" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">이력서 확인</a>
          <AiWorkDialog>
            <ul aria-label="AI와 협업하는 방식">
                <li>목표, 요구사항, 기획, 기술 스택과 구현 방향을 상세히 명세합니다. <strong>Superpowers, Grill-me 등의 스킬</strong>로 기획을 검토하고 대안을 모색하며 개발 방향을 구체화합니다.</li>
                <li><strong>Orca</strong>를 기반으로 작업을 독립적인 단위로 나누고, 여러 Agent를 병렬로 실행해 개발 생산성을 높입니다.</li>
                <li><strong>AI Agent 기반의 테스트 자동화 시스템</strong>을 구축해 프로그램의 안정성을 지속적으로 확인합니다.</li>
                <li>테스트 시나리오를 먼저 작성해 전달하고, <strong>AI와 함께 누락된 조건과 예외 상황을 찾아 보완</strong>합니다.</li>
                <li>작업 규칙은 <strong>AGENTS.md</strong>에, 반복 절차는 <strong>Skill</strong>로 정리해 같은 기준으로 작업하게 합니다.</li>
                <li><strong>GitHub와 Notion 기반의 Second Brain Ontology</strong>를 구축하여 운영하고 있습니다. 모델이 바뀌어도 같은 지식과 작업 기준을 재사용할 수 있도록 설계합니다.</li>
                <li><strong>GPT dots</strong>를 활용해 매일 오전 9시에 최신 Skill과 도구를 확인하고, 개발에 필요한 것을 선별해 반영합니다.</li>
              </ul>
          </AiWorkDialog>
        </div>
        <div className="hero-socials"><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그</a></div>
      </div>
      <figure className="profile-portrait">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/kilwon-profile.jpg`} alt="전길원 프로필 사진"
          width={780} height={1040} unoptimized preload />
      </figure>
    </section>
    <section className="projects wrap section" id="projects" aria-labelledby="projects-title">
      <div className="section-top"><h2 id="projects-title">대표 프로젝트</h2></div>
      <ProjectGallery featured />
      <div className="all-work">
        <Link className="button primary all-work-button" href="/projects/">전체 {projects.length}개 프로젝트 보기</Link>
        <p>개인 프로젝트와 인턴십, 대회에서 수행한 작업을 분야와 문제 해결 유형별로 살펴볼 수 있습니다.</p>
      </div>
    </section>
    <section className="tech-stack wrap section" id="tech-stack" aria-labelledby="tech-stack-title">
      <div className="section-top">
        <div><h2 id="tech-stack-title">기술 스택</h2></div>
        <a className="text-link" href="https://github.com/kingrangE/kingrangE#tech-stack" target="_blank" rel="noopener noreferrer">GitHub 기술 스택</a>
      </div>
      <TechStack />
    </section>
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="wrap about-layout section">
        <div className="about-intro">
          <h2 id="about-title">실패한 뒤의 데이터 상태까지<br />설계에 포함합니다.</h2>
          <p>작업이 중간에 멈추면 어디까지 저장되는지 먼저 따져봅니다. 다시 실행할 때 같은 데이터가 중복 저장되지는 않는지, 검증에 실패한 결과를 다음 작업이 읽지는 않는지 살핍니다. 이를 기준으로 저장 순서와 재처리 방식을 정했습니다.</p>
        </div>
        <div className="principles">
          <details name="working-principles" open>
            <summary><h3>저장은 끝났는데, 완료 처리는 못 했다면</h3><span aria-hidden="true">+</span></summary>
            <p>Orecast에서는 DB에 가격을 저장한 뒤 메시지 완료 확인을 보내기 전에 프로그램이 멈출 수 있습니다. 같은 가격을 다시 받아도 품목과 날짜가 같은 행을 갱신하고, DB 저장이 끝난 뒤에만 메시지 처리를 확정하도록 했습니다.</p>
            <Link className="text-link" href="/projects/orecast/#delivery">Orecast 설계 보기</Link>
          </details>
          <details name="working-principles">
            <summary><h3>같은 입력으로 다시 실행해도 해결되지 않는 오류</h3><span aria-hidden="true">+</span></summary>
            <p>Softeer에서는 일시적인 실행 오류와 입력, 품질 오류를 나눴습니다. 재시도는 Airflow가 맡고, 검증에 실패한 데이터는 원인을 남겨 후속 계산에서 제외했습니다. Lambda의 호출 성공 응답 안에 담긴 함수 실패도 별도로 확인했습니다.</p>
            <Link className="text-link" href="/projects/softeer/#recovery">Softeer 설계 보기</Link>
          </details>
          <details name="working-principles">
            <summary><h3>새 색인을 못 만들었을 때 남아 있어야 할 자료</h3><span aria-hidden="true">+</span></summary>
            <p>Semo에서는 새 청크의 임베딩과 저장을 모두 마친 뒤 이전 청크를 지웠습니다. 중간에 실패하면 이전 자료와 일부 새 자료가 함께 남습니다. 다음 실행은 청크 ID를 다시 대조해 갱신을 이어갑니다.</p>
            <Link className="text-link" href="/projects/semo/#indexing">Semo 설계 보기</Link>
          </details>
          <details name="working-principles">
            <summary><h3>자막 지연을 줄여도 회의 기록은 남도록</h3><span aria-hidden="true">+</span></summary>
            <p>MeetNote에서는 밀린 자막을 모두 처리하면 회의 진행을 따라갈 수 없었습니다. 자막 대기열이 차면 오래된 음성을 버리고, 회의록은 별도로 저장한 전체 녹음본에서 작성하도록 경로를 나눴습니다.</p>
            <Link className="text-link" href="/projects/meeting-assistant/#latency">MeetNote 설계 보기</Link>
          </details>
        </div>
      </div>
    </section>
    <section className="experience wrap section" id="experience" aria-labelledby="experience-title"><div className="section-top"><div><h2 id="experience-title">인턴 및 교육</h2></div><a className="text-link" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">전체 이력서 읽기</a></div><div className="timeline"><article><span className="timeline-period">2026.03 — 2026.06</span><div className="timeline-main"><h3>솔브레인 <span>FDE Intern / AI-TF</span></h3><p>현업 요구사항을 듣고 사내 AI 서비스와 업무 자동화 도구를 개발했습니다.</p><div className="timeline-tags"><Link href="/projects/meeting-assistant/">회의 AI 비서</Link><Link href="/projects/orecast/">데이터 파이프라인</Link><Link href="/projects/sap2bom/">업무 자동화</Link></div></div></article><article><span className="timeline-period">2023.12 — 2025.02</span><div className="timeline-main"><h3>WHATsLAB <span>AI Research Engineer Intern</span></h3><p>가설과 실험을 바탕으로 AI 모델과 LLM 백엔드를 개발했습니다.</p><div className="timeline-tags"><Link href="/projects/stage-anxiety/">sLLM / PEFT</Link><Link href="/projects/stage-anxiety/#lora">LLM 평가</Link><Link href="/projects/image-to-3d/">3D Generation</Link></div></div></article><article><span className="timeline-period">2026.07 — 2026.08</span><div className="timeline-main"><h3>소프티어 부트캠프 8기 <span>DE / DA</span></h3><p>데이터 파이프라인과 모델링을 학습하고, 차량 추천 데이터 프로덕트를 만들었습니다.</p><div className="timeline-tags"><Link href="/projects/softeer/">Data Engineering</Link><span>우수 소프티어</span></div></div></article><article><span className="timeline-period">2020.03~2026.08</span><div className="timeline-main"><h3>세종대학교 스마트기기공학전공</h3><p>교내 수상 5회<br />학부연구생 7개월<br />KCI 저널 1저자 1편 게재<br />학부생 논문 발표 대회 Agent 연구 논문 1편 발표</p><p>학점 : 3.86/4.5 / 전공 4.12/4.5</p></div></article></div></section>

    </>
  );
}
