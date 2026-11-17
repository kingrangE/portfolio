'use client';

import { useEffect, useRef, useState } from 'react';
import { researchAnimation } from '../content/projects.mjs';

export default function ResearchVisual({ interactive = false }) {
  const container = useRef(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const target = container.current.closest('a.project-open') || container.current;
    const restart = () => setRun(value => value + 1);
    target.addEventListener('mouseenter', restart);
    target.addEventListener('focusin', restart);
    const observer = window.IntersectionObserver && new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setRun(value => value + 1);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer?.observe(container.current);
    return () => {
      observer?.disconnect();
      target.removeEventListener('mouseenter', restart);
      target.removeEventListener('focusin', restart);
    };
  }, []);

  return <div className="research-demo" ref={container}>
    <div key={run} className="project-visual visual-research" data-playing={run > 0}
      role="img" aria-label={`${researchAnimation.description} ${researchAnimation.footnote}`}>
      <span className="visual-label">{researchAnimation.label}</span>
      <div className="research-word">{researchAnimation.name}</div>
      <div className="research-market" aria-hidden="true">
        <div className="research-chart-heading">
          <span>{researchAnimation.window}</span>
          <div className="research-legend">
            {researchAnimation.series.map((label, index) => <span key={label} data-series={index}><i />{label}</span>)}
          </div>
        </div>
        <svg className="research-chart" viewBox="0 0 360 76" fill="none" focusable="false">
          <path className="research-guide" d="M0 60H360M0 30H360" />
          <path className="research-benchmark" d="M4 58 40 51 76 55 112 43 148 47 184 39 220 44 256 36 292 40 328 34 356 37" />
          <path className="research-theme" d="M4 58 40 51 76 54 112 40 148 44 184 26 220 32 256 16 292 23 328 9 356 14" />
        </svg>
        <div className="research-chart-times"><span>{researchAnimation.start}</span><span>{researchAnimation.end}</span></div>
      </div>
      <div className="research-focus" aria-hidden="true"><strong>{researchAnimation.focus}</strong><span>{researchAnimation.context}</span></div>
      <span className="research-footnote">{researchAnimation.footnote}</span>
      {!interactive && <span className="visual-arrow" aria-hidden="true">+</span>}
    </div>
    {interactive && <div className="research-controls">
      <button className="button" type="button" onClick={() => setRun(value => value + 1)}>{researchAnimation.replay}</button>
      <p>{researchAnimation.description}</p>
    </div>}
  </div>;
}
