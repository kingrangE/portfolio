'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function ProjectToc({ sections }) {
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find(section => section.id === active) || sections[0];

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (sections.some(section => section.id === hash)) setActive(hash);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => {
      const target = document.getElementById(section.id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, [sections]);

  const links = sections.map(section => (
    <li key={section.id}>
      <a href={`#${section.id}`} aria-current={current.id === section.id ? 'location' : undefined}
        onClick={event => {
          setActive(section.id);
          const disclosure = event.currentTarget.closest('details');
          if (disclosure) disclosure.open = false;
        }}>{section.title}</a>
    </li>
  ));

  return (
    <>
      <aside className="desktop-toc">
        <p>설계, 문제 해결 사례</p>
        <nav aria-label="프로젝트 목차"><ol>{links}</ol></nav>
        <Link className="toc-back" href="/projects/">모든 프로젝트 보기</Link>
      </aside>
      <details className="mobile-toc">
        <summary>목차 <span>{current.title}</span><b aria-hidden="true">+</b></summary>
        <nav aria-label="모바일 프로젝트 목차"><ol>{links}</ol></nav>
      </details>
    </>
  );
}
