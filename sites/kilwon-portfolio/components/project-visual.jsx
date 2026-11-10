const visuals = {
  dcba: (
<div className="project-visual visual-dcba">
  <span className="visual-label">문제 조회와 모델 생성의 실행 흐름 분리</span>
  <div className="dcba-word">DCBA</div>
  <ol className="dcba-flow" aria-label="문제 생성 요청을 큐로 전달하고 DB 저장 후 완료 처리하는 순서">
    <li><strong>Spring Boot</strong><span>생성 요청 접수</span></li>
    <li><strong>Redis Streams</strong><span>미완료 작업 보관</span></li>
    <li><strong>FastAPI</strong><span>Kanana 생성</span></li>
    <li><strong>MariaDB</strong><span>문제, 작업 ID 저장</span></li>
  </ol>
  <span className="dcba-flow-note">DB 저장 후 메시지 처리 완료</span>
  <span className="visual-arrow" aria-hidden="true">+</span>
</div>
  ),
  gaudi: (
<div className="project-visual visual-gaudi"><span className="visual-label">개발자의 AI 활용 역량 평가</span><div className="gaudi-word">GAUDI</div><div className="score-sheet"><div className="sheet-title">AI 활용 역량별 평가</div><div className="score-row"><span>설계</span><i style={{'--progress': '78%'}}></i><b>확인</b></div><div className="score-row"><span>검증</span><i style={{'--progress': '91%'}}></i><b>확인</b></div><div className="score-row"><span>판단</span><i style={{'--progress': '65%'}}></i><b>확인</b></div><span className="sheet-foot">평가 화면 콘셉트 / 실제 측정값 아님</span></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  talky: (
<div className="project-visual visual-talky"><span className="visual-label">이전 대화를 기억하는 영어 회화</span><div className="talky-word">Talky</div><div className="speech speech-one">지난번에 이야기했던 여행, 기억해?</div><div className="speech speech-two">Let’s pick up where we left off.</div><div className="waveform" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  orecast: (
<div className="project-visual visual-orecast">
  <span className="visual-label">가격 출처에서 구매팀 대시보드까지</span>
  <div className="orecast-title">Orecast<span>수집한 가격이 분석 화면에 도착하기까지</span></div>
  <svg className="orecast-flow" viewBox="0 0 400 165" role="img" aria-label="네이버 금융, DRAMeXchange, Witsview, SunSirs의 가격을 수집해 클라우드 Redis Streams로 전달하고, 로컬 PostgreSQL에 저장한 뒤 대시보드에서 분석하는 흐름">
    <path className="orecast-track" d="M42 72 C85 72 100 32 147 32 S205 103 251 103 S310 48 358 48" />
    <path className="orecast-packet" pathLength="1" d="M42 72 C85 72 100 32 147 32 S205 103 251 103 S310 48 358 48" />
    <g className="orecast-node">
      <rect x="20" y="51" width="44" height="39" rx="6" />
      <path d="M20 62 H64 M28 57 H30 M35 57 H37 M28 71 H55 M28 79 H47" />
      <path className="orecast-solid" d="M123 35 C116 25 124 17 134 19 C139 3 160 6 163 20 C180 18 184 40 170 43 H132 Z" />
      <path className="orecast-solid" d="M229 91 V115 C229 126 273 126 273 115 V91 Z" />
      <ellipse cx="251" cy="91" rx="22" ry="8" />
      <path d="M229 103 C229 114 273 114 273 103" />
      <rect x="334" y="28" width="48" height="37" rx="5" />
      <path d="M350 72 H366 M358 65 V72 M340 54 V39 M347 54 V45 M354 54 V35 M361 54 V42 M368 54 V38 M375 54 V33" />
    </g>
    <g className="orecast-step">
      <text x="42" y="111">가격 출처</text>
      <text x="147" y="64">클라우드 수집</text>
      <text x="251" y="146">로컬 저장</text>
      <text x="358" y="94">대시보드</text>
    </g>
    <g className="orecast-caption">
      <text x="42" y="128">공개 사이트 4곳</text>
      <text x="147" y="81">Redis Streams</text>
      <text x="251" y="161">PostgreSQL</text>
      <text x="358" y="111">분석과 예측</text>
    </g>
  </svg>
  <span className="visual-arrow" aria-hidden="true">+</span>
</div>
  ),
  softeer: (
<div className="project-visual visual-taxi"><span className="visual-label">운행 기록에서 차량 추천까지</span><div className="taxi-map" aria-hidden="true"><svg className="route-map" viewBox="0 0 320 400" width="320" height="400" aria-hidden="true" focusable="false"><path className="route-track" d="M190 150 H80 V290 H190"/><path className="route-line" d="M190 150 H80 V290 H190" pathLength="1"/><circle className="route-station" cx="190" cy="150" r="6"/><circle className="route-station" cx="190" cy="290" r="6"/></svg><span className="route-traveler"></span></div><div className="taxi-title"><span>New York</span><br /><strong>운행 데이터로 차량 추천</strong></div><div className="pipeline-chip"><span>Bronze</span><b>→</b><span>Silver</span><b>→</b><span>Gold</span><i>✓</i></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  semo: (
<div className="project-visual visual-semo"><span className="visual-label">정보를 찾는 시간을 줄이는 RAG</span><div className="semo-title">Semo<span>세종대학교의 모든 것</span></div><div className="semo-paper paper-back"><span>학사 일정</span><i></i><i></i><i></i></div><div className="semo-paper paper-front"><span className="paper-icon" aria-hidden="true">▤</span><h4>궁금한 학교 소식,<br />한곳에서 물어보세요.</h4><p>학교 공지를 검색해 답변합니다.</p><div className="paper-sources"><span>학사</span><span>비교과</span><span>취업</span></div></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  )
};

export default function ProjectVisual({ slug }) {
  return visuals[slug] || null;
}
