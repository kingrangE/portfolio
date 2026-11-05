import Link from 'next/link';

export default function SiteHeader() {
  return (
<header className="site-header wrap">
    <Link className="wordmark" href="/" aria-label="전길원 홈"><span className="brand-icon" aria-hidden="true"><i></i><i></i><i></i></span>전길원<span className="wordmark-sub">Kilwon Jeon</span></Link>
    <nav aria-label="주 메뉴"><Link href="/projects/">프로젝트</Link><Link href="/#about">일하는 방식</Link><Link href="/#experience">경험</Link></nav>
    <a className="header-contact" href="mailto:kilwon.jeon00@gmail.com">이메일 보내기</a>
  </header>
  );
}
