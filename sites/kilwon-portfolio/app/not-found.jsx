import Link from 'next/link';

export default function NotFound() {
  return <section className="wrap not-found"><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 확인하거나 프로젝트 목록에서 다시 찾아주세요.</p><Link className="button primary" href="/#projects">프로젝트 목록 보기</Link></section>;
}
