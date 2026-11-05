import Link from 'next/link';

export default function SiteFooter() {
  return (
<footer className="wrap site-footer"><Link className="wordmark" href="/#main">전길원</Link><p>계속 배우고, 만들고, 다듬는 중입니다.</p><div><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">블로그</a><Link href="/#main">맨 위로</Link></div></footer>
  );
}
