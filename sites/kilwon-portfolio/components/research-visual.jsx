'use client';

import { useEffect, useRef, useState } from 'react';
import { researchAnimation } from '../content/projects.mjs';

export default function ResearchVisual({ interactive = false }) {
  const container = useRef(null);
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

  return <div className="research-demo" ref={container}>
    <div key={run} className="project-visual visual-research" data-playing={run > 0}
      role="img" aria-label={`${researchAnimation.description} ${researchAnimation.footnote}`}>
      <span className="visual-label">{researchAnimation.label}</span>
      <div className="research-word">Research Agent</div>
      <div className="research-comparison" aria-hidden="true">
        <div className="research-source">
          <span>{researchAnimation.source.label}</span>
          <strong>{researchAnimation.date}</strong>
          <p>{researchAnimation.source.value}</p>
          <small>{researchAnimation.source.note}</small>
        </div>
        <div className="research-reference">
          <span>{researchAnimation.reference.label}</span>
          <strong>{researchAnimation.date}</strong>
          <p>{researchAnimation.reference.value}</p>
          <small>{researchAnimation.reference.note}</small>
        </div>
      </div>
      <div className="research-resolution" aria-hidden="true">
        <svg viewBox="0 0 36 24" fill="none"><path d="M4 2v7c0 4 5 5 14 5s14-1 14-5V2M18 14v8m-4-4 4 4 4-4" /></svg>
        <span>{researchAnimation.result}</span>
      </div>
      <span className="research-footnote">{researchAnimation.footnote}</span>
      {!interactive && <span className="visual-arrow" aria-hidden="true">+</span>}
    </div>
    {interactive && <div className="research-controls">
      <button className="button" type="button" onClick={() => setRun(value => value + 1)}>보정 과정 다시 보기</button>
      <p>{researchAnimation.description}</p>
    </div>}
  </div>;
}
