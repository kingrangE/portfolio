'use client';

import Link from 'next/link';

export default function SiteFooter() {
  function refreshContent() {
    const url = new URL(window.location.href);
    url.searchParams.set('_refresh', Date.now().toString());
    window.location.replace(url.href);
  }

  return (
<footer className="wrap site-footer"><Link className="wordmark" href="/#main">전길원</Link><p>LLM 서비스와 데이터 파이프라인을 개발합니다.</p><div><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">블로그</a><button className="refresh-content" type="button" onClick={refreshContent}>최신 내용 불러오기</button><Link href="/#main">맨 위로</Link></div></footer>
  );
}
