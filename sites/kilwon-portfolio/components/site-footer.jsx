import Link from 'next/link';

export default function SiteFooter() {
  return (
<footer className="wrap site-footer"><Link className="wordmark" href="/#main">전길원</Link><p>LLM 서비스를 만들며 배웠고, 지금은 데이터로 관심을 넓혀가고 있습니다.</p><div><a href="https://github.com/kingrangE" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://kingrang-e.tistory.com/" target="_blank" rel="noopener noreferrer">블로그</a><Link href="/#main">맨 위로</Link></div></footer>
  );
}
