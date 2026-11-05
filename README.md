# 전길원 포트폴리오

밝은 페이퍼·코발트 블루 색상의 LLM & Data Engineering 포트폴리오입니다. 프로필 사진을 배치한 첫 화면과 비대칭 프로젝트 배치를 사용합니다.

- GitHub Pages: https://kingrange.github.io/portfolio/
- 이전 비공개 프리뷰: https://kilwon-engineering-notes.kilwon-jeon00.chatgpt.site
- 소스: `sites/kilwon-portfolio/` — Next.js App Router, React, CSS
- 실행: 해당 폴더에서 `npm ci` 후 `npm run dev`
- 검사: `npm test` → `npm run build` → `npm run check:export`
- 프로젝트 본문·목차: `content/projects.mjs`
- 페이지: `/projects/`에 전체 12개 프로젝트, 메인에는 대표 4개
- 배포 산출물: `out/` (Next.js 정적 내보내기)

프로젝트 분야 필터와 반응형 레이아웃, 호버·포커스 인터랙션을 포함합니다. 프로젝트마다 독립 상세 페이지와 항목별 링크가 있으며, 데스크톱은 고정 목차, 모바일은 접이식 목차를 사용합니다. 소개와 프로젝트 설명은 초안이며, 팀 프로젝트의 개인 기여와 성과 수치는 추가 확인 후 보완합니다.

## 자동 배포

`.github/workflows/pages.yml`은 `main` push 시 검사 → 정적 빌드 → GitHub Pages 배포를 실행합니다. PR에서는 검사와 빌드만 실행합니다. 실패하면 새 버전을 배포하지 않습니다.

최초 한 번 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다. 이후에는 아래처럼 수정한 파일을 커밋하고 push하면 됩니다.

```sh
git add <수정한 파일>
git commit -m "Update portfolio"
git push origin main
```

Actions의 **Deploy portfolio to GitHub Pages** 실행 결과에서 배포 상태를 확인할 수 있습니다. 로컬 파일 저장이나 Notion 수정만으로는 배포되지 않습니다.

Pages는 `/portfolio` 경로로 빌드합니다. 같은 조건의 로컬 검사는 사이트 폴더에서 실행합니다.

```sh
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
NEXT_PUBLIC_BASE_PATH=/portfolio npm run check:export
```

저장소 이름이나 커스텀 도메인을 바꾸면 워크플로의 `NEXT_PUBLIC_BASE_PATH`도 함께 변경합니다. 로컬 개발에서는 이 환경변수 없이 루트 경로를 사용합니다.
