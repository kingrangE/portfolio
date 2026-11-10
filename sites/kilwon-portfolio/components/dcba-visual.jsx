'use client';

import { useEffect, useRef, useState } from 'react';
import { dcbaAnimation } from '../content/projects.mjs';

export default function DcbaVisual({ interactive = false }) {
  const container = useRef(null);
  const [scene, setScene] = useState('generate');
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setRun(value => value + 1);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  function replay(nextScene) {
    setScene(nextScene);
    setRun(value => value + 1);
  }

  const recovering = scene === 'recover';
  const { description, early, middle, final } = dcbaAnimation[scene];

  return <div className="dcba-demo" ref={container}>
    <div key={`${scene}-${run}`} className="project-visual visual-dcba" data-scene={scene} data-playing={run > 0}
      role="img" aria-label={`DCBA 동작 예시. ${description}`}>
      <span className="visual-label">생성 요청에서 문제 저장까지</span>
      <div className="dcba-word">DCBA</div>
      <span className="dcba-subject">{dcbaAnimation.subject}</span>
      <div className="dcba-sequence" aria-hidden="true">
        <div className="dcba-rail" />
        <div className="dcba-stages">
          <div className="dcba-stage">
            <svg viewBox="0 0 32 32"><path d="M11 7 3 16l8 9m10-18 8 9-8 9M19 4l-6 24" /></svg>
            <strong>Spring Boot</strong><span>요청 접수</span>
          </div>
          <div className="dcba-stage">
            <svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" rx="3" /><path d="M9 11v10m7-10v10m7-10v10" /></svg>
            <strong>Redis Streams</strong><span>작업 보관</span>
          </div>
          <div className="dcba-stage">
            <svg viewBox="0 0 32 32"><path d="m18 3-12 16h9l-1 10 12-17h-9Z" /></svg>
            <strong>FastAPI</strong><span>Kanana 생성</span>
          </div>
          <div className="dcba-stage">
            <svg viewBox="0 0 32 32"><ellipse cx="16" cy="7" rx="12" ry="4" /><path d="M4 7v18c0 5 24 5 24 0V7M4 16c0 5 24 5 24 0" /></svg>
            <strong>MariaDB</strong><span>문제, 작업 ID</span>
          </div>
        </div>
        <span className="dcba-packet">작업 #07</span>
        <span className="dcba-pending">완료 대기</span>
      </div>
      <div className="dcba-result" aria-hidden="true">
        <div className="dcba-result-copy"><span>문제 #07 <i>동작 예시</i></span><strong>{dcbaAnimation.question}</strong></div>
        <span className="dcba-saved">✓<small>저장</small></span>
      </div>
      <div className="dcba-event" aria-hidden="true">
        <span className="dcba-event-early">{early}</span>
        <span className="dcba-event-middle">{middle}</span>
        <span className="dcba-event-final">{final}</span>
      </div>
      {!interactive && <span className="visual-arrow" aria-hidden="true">+</span>}
    </div>
    {interactive && <div className="dcba-controls">
      <div role="group" aria-label="DCBA 동작 예시 재생">
        <button type="button" aria-pressed={!recovering} onClick={() => replay('generate')}>생성 과정 재생</button>
        <button type="button" aria-pressed={recovering} onClick={() => replay('recover')}>중단 후 재처리</button>
      </div>
      <p role="status">{description}</p>
      <span>동작 설명용 예시이며 실제 처리 시간과는 무관합니다.</span>
    </div>}
  </div>;
}
