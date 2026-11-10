import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import Script from 'next/script';
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
        {process.env.NODE_ENV === 'production' && <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-1J7FMFK6M0" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">{`
            const analyticsUrl = new URL(window.location.href);
            const analyticsPreference = analyticsUrl.searchParams.get('analytics');
            let analyticsExcluded = analyticsPreference === 'off';
            try {
              if (analyticsPreference === 'off') localStorage.setItem('portfolio-analytics-excluded', 'true');
              if (analyticsPreference === 'on') localStorage.removeItem('portfolio-analytics-excluded');
              analyticsExcluded = analyticsExcluded || localStorage.getItem('portfolio-analytics-excluded') === 'true';
            } catch (error) {
              console.warn('방문 통계 제외 설정을 저장할 수 없습니다. 브라우저의 사이트 저장소 설정을 확인해주세요.', error);
            }
            if (analyticsPreference === 'off' || analyticsPreference === 'on') {
              analyticsUrl.searchParams.delete('analytics');
              window.history.replaceState(window.history.state, '', analyticsUrl.href);
            }
            window['ga-disable-G-1J7FMFK6M0'] = analyticsExcluded;
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1J7FMFK6M0');
          `}</Script>
        </>}
      </body>
    </html>
  );
}
