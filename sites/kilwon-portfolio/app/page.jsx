import Image from "next/image";
import Link from "next/link";
import ProjectGallery from "../components/project-gallery";
import { projects } from "../content/projects.mjs";

export default function Home() {
  return (
    <>

    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="intro-name">꾸준한 학습과 모든 실패 가능성에 대한 반증을 통해 현재 상황에 맞는 최선의 정답을 찾고자 하는 개발자 전길원입니다.</p>
        <h1 id="hero-title">답변에는 근거를.<br />데이터에는 신뢰를.</h1>
        <p className="hero-description">흩어진 정보를 연결하고, AI의 결과를 검증합니다.<br />좋아 보이는 데서 멈추지 않고,<br />실제로 쓸 수 있는 서비스를 만듭니다.</p>
        <div className="hero-actions"><a className="button primary" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">이력서 확인</a></div>
        <div className="hero-socials"><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">개발 블로그</a></div>
      </div>
      <figure className="profile-portrait">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/kilwon-profile.jpg`} alt="전길원 프로필 사진"
          width={780} height={1040} unoptimized preload />
      </figure>
    </section>
    <section className="projects wrap section" id="projects" aria-labelledby="projects-title">
      <div className="section-top"><div><h2 id="projects-title">대표 프로젝트</h2><p className="section-description">평가 설계부터 대화의 기억, 데이터 품질과 검색까지.</p></div></div>
      <ProjectGallery featured />
      <div className="all-work">
        <Link className="button primary all-work-button" href="/projects/">전체 {projects.length}개 프로젝트 보기</Link>
        <p>인턴십과 수상작에 담긴 문제 해결을 직무·기술별로 살펴보세요.</p>
      </div>
    </section>
    <section className="about-section" id="about" aria-labelledby="about-title"><div className="wrap about-layout section"><div className="about-intro"><h2 id="about-title">왜 이렇게 만들었는지<br />설명할 수 있도록.</h2><p>좋은 프로덕트는 탄탄한 데이터에서 시작하고,<br />꾸준한 검증을 통해 나아진다고 생각합니다.</p></div><div className="principles"><article><div><h3>문제부터 이해합니다.</h3><p>현업의 업무 흐름과 제약을 듣고, 해결해야 할 문제를 구체화합니다. 기술을 고르기 전에 왜 필요한지부터 질문합니다.</p></div></article><article><div><h3>데이터와 AI를 연결합니다.</h3><p>데이터 수집과 품질 관리부터 RAG와 Agent까지. 각 부분이 하나의 서비스로 이어지는 흐름을 고민합니다.</p></div></article><article><div><h3>가설을 세우고, 확인합니다.</h3><p>좋아 보이는 결과에 머무르지 않습니다. 평가 기준과 비교 실험을 통해 개선의 근거와 남은 한계를 함께 기록합니다.</p></div></article></div></div></section>
    <section className="experience wrap section" id="experience" aria-labelledby="experience-title"><div className="section-top"><div><h2 id="experience-title">현장에서 배운 것들</h2></div><a className="text-link" href="https://kingrange.github.io/Resume/" target="_blank" rel="noopener noreferrer">전체 이력서 읽기</a></div><div className="timeline"><article><span className="timeline-period">2026.03 — 2026.06</span><div className="timeline-main"><h3>솔브레인 <span>FDE Intern · AI-TF</span></h3><p>현업 요구사항을 사내 AI 솔루션과 업무 자동화로 연결했습니다.</p><div className="timeline-tags"><span>회의 AI 비서</span><span>데이터 파이프라인</span><span>업무 자동화</span></div></div></article><article><span className="timeline-period">2023.12 — 2025.02</span><div className="timeline-main"><h3>WHATsLAB <span>AI Research Engineer Intern</span></h3><p>가설과 실험을 바탕으로 AI 모델과 LLM 백엔드를 개발했습니다.</p><div className="timeline-tags"><span>sLLM · PEFT</span><span>LLM 평가</span><span>3D Generation</span></div></div></article><article><span className="timeline-period">2026.07 — 2026.08</span><div className="timeline-main"><h3>소프티어 부트캠프 8기 <span>DE / DA</span></h3><p>데이터 파이프라인과 모델링을 학습하고, 차량 추천 데이터 프로덕트를 만들었습니다.</p><div className="timeline-tags"><span>Data Engineering</span><span>우수 소프티어</span></div></div></article></div><div className="background-note"><span>학업과 연구</span><p>세종대학교 스마트기기공학전공 <b>·</b> SWAI 해커톤 대상·은상 <b>·</b> LLM 관련 연구 및 논문 발표</p></div></section>
    <section className="contact-section" id="contact"><div className="wrap contact-layout"><div><p>LLM 서비스와 데이터, 그리고 더 나은 방법에 관한 이야기라면 환영합니다.</p><a className="contact-email" href="mailto:kilwon.jeon00@gmail.com">kilwon.jeon00@gmail.com</a></div></div></section>

    </>
  );
}
