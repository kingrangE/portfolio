'use client';

import { useState } from 'react';
import { stackForExperience, stackExperience } from '../content/tech-stack.mjs';

export default function TechStack() {
  const [experience, setExperience] = useState('all');
  const visible = stackForExperience(experience);

  return <>
    <ul className="tech-stack-legend" aria-label="사용 경험으로 필터">
      <li><button className="stack-filter" type="button" aria-pressed={experience === 'all'} aria-controls="tech-stack-groups" onClick={() => setExperience('all')}>전체</button></li>
      {Object.entries(stackExperience).map(([value, info]) => <li key={value} data-experience={value}>
        <button className="stack-filter" type="button" aria-pressed={experience === value} aria-controls="tech-stack-groups"
          onClick={() => setExperience(experience === value ? 'all' : value)}>
          <span className="stack-indicator" aria-hidden="true" /><span>{info.label}<span className="stack-legend-detail">{info.description}</span></span>
        </button>
      </li>)}
    </ul>
    <p className="stack-results" role="status">{visible.flatMap(group => group.items).length}개 기술{experience !== 'all' && ` / ${stackExperience[experience].label}`}</p>
    <div className="tech-stack-groups" id="tech-stack-groups">
      {visible.map(group => <div className="tech-stack-row" key={group.title}>
        <div className="tech-stack-label"><h3>{group.title}</h3></div>
        <ul className="tech-stack-items" aria-label={group.title}>{group.items.map(item => <li key={item.name} data-experience={item.experience}
          aria-label={`${item.name}, ${stackExperience[item.experience].label}, ${stackExperience[item.experience].description}`}
          title={`${stackExperience[item.experience].label}: ${stackExperience[item.experience].description}`}>
          <span className="stack-indicator" aria-hidden="true" />{item.name}
        </li>)}</ul>
      </div>)}
    </div>
  </>;
}
