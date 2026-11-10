import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import './globals.css';

export const metadata = {
  title: { default: '전길원 | Data & LLM Engineer', template: '%s | 전길원' },
  description: '데이터 수집과 적재, 품질 검증, 재처리를 구현한 전길원의 포트폴리오. Airflow와 Spark 기반 처리 경험에 RAG 색인 갱신, 대화 Agent와 LLM 평가 경험을 함께 소개합니다.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg` },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#F6F8FC" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet" />
      </head>
      <body>
        <a className="skip-link" href="#main">본문으로 이동</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
