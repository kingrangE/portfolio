const visuals = {
  gaudi: (
<div className="project-visual visual-gaudi"><span className="visual-label">개발자의 AI 활용 역량 평가</span><div className="gaudi-word">GAUDI</div><div className="score-sheet"><div className="sheet-title">AI 활용 역량별 평가</div><div className="score-row"><span>설계</span><i style={{'--progress': '78%'}}></i><b>확인</b></div><div className="score-row"><span>검증</span><i style={{'--progress': '91%'}}></i><b>확인</b></div><div className="score-row"><span>판단</span><i style={{'--progress': '65%'}}></i><b>확인</b></div><span className="sheet-foot">평가 화면 콘셉트 · 실제 측정값 아님</span></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  talky: (
<div className="project-visual visual-talky"><span className="visual-label">이전 대화를 기억하는 영어 회화</span><div className="talky-word">Talky</div><div className="speech speech-one">지난번에 이야기했던 여행, 기억해?</div><div className="speech speech-two">Let’s pick up where we left off.</div><div className="waveform" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  softeer: (
<div className="project-visual visual-taxi"><span className="visual-label">운행 기록에서 차량 추천까지</span><div className="taxi-map" aria-hidden="true"><svg className="route-map" viewBox="0 0 320 400" width="320" height="400" aria-hidden="true" focusable="false"><path className="route-track" d="M190 150 H80 V290 H190"/><path className="route-line" d="M190 150 H80 V290 H190" pathLength="1"/><circle className="route-station" cx="190" cy="150" r="6"/><circle className="route-station" cx="190" cy="290" r="6"/></svg><span className="route-traveler"></span></div><div className="taxi-title"><span>New York</span><br /><strong>운행 데이터로 차량 추천</strong></div><div className="pipeline-chip"><span>Bronze</span><b>→</b><span>Silver</span><b>→</b><span>Gold</span><i>✓</i></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  ),
  semo: (
<div className="project-visual visual-semo"><span className="visual-label">정보를 찾는 시간을 줄이는 RAG</span><div className="semo-title">semo<span>세종대학교의 모든 것</span></div><div className="semo-paper paper-back"><span>학사 일정</span><i></i><i></i><i></i></div><div className="semo-paper paper-front"><span className="paper-icon" aria-hidden="true">▤</span><h4>궁금한 학교 소식,<br />한곳에서 물어보세요.</h4><p>학교 공지를 검색해 답변합니다.</p><div className="paper-sources"><span>학사</span><span>비교과</span><span>취업</span></div></div><span className="visual-arrow" aria-hidden="true">+</span></div>
  )
};

export default function ProjectVisual({ slug }) {
  return visuals[slug] || null;
}
