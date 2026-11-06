'use client';

import Link from 'next/link';

export default function SiteHeader() {
  function refreshContent() {
    const url = new URL(window.location.href);
    url.searchParams.set('_refresh', Date.now().toString());
    window.location.replace(url.href);
  }

  return (
<header className="site-header wrap">
    <button className="button primary header-refresh" type="button" onClick={refreshContent}>최신 정보 불러오기</button>
    <nav aria-label="주 메뉴"><Link href="/projects/">프로젝트</Link><Link href="/#about">일하는 방식</Link><Link href="/#experience">경험</Link></nav>
    <a className="header-contact" href="mailto:kilwon.jeon00@gmail.com">이메일 보내기</a>
  </header>
  );
}
