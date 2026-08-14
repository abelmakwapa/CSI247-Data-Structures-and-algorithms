'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

export function OperationLab({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const [active, setActive] = useState(0);
  const operation = topic.operations[active];
  const panelId = `${topicId}-operation-panel`;

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % topic.operations.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + topic.operations.length) % topic.operations.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = topic.operations.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActive(nextIndex);
    window.requestAnimationFrame(() => document.getElementById(`${topicId}-operation-tab-${nextIndex}`)?.focus());
  }

  return (
    <section className="academic-panel panel-definition operation-lab" aria-labelledby={`${topicId}-lab-title`}>
      <div className="panel-kicker">Operation lab</div>
      <h2 id={`${topicId}-lab-title`}>Run the idea, then name the cost</h2>
      <p className="panel-intro">Choose a small operation to see what changes and which part of the structure does the work.</p>
      <div className="operation-layout">
        <div className="operation-buttons" role="tablist" aria-label={`${topic.title} operations`}>
          {topic.operations.map((item, index) => <button key={item.label} id={`${topicId}-operation-tab-${index}`} type="button" role="tab" aria-controls={panelId} aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? 'active' : ''} onClick={() => setActive(index)} onKeyDown={(event) => handleTabKeyDown(event, index)}>{item.label}</button>)}
        </div>
        <div id={panelId} className="operation-readout" role="tabpanel" aria-labelledby={`${topicId}-operation-tab-${active}`} aria-live="polite" tabIndex={0}>
          <span className="readout-label">estimated work</span>
          <strong>{operation.complexity}</strong>
          <p>{operation.explanation}</p>
          <div className="operation-progress" aria-hidden="true"><span style={{ width: `${Math.min(100, 18 + active * 31)}%` }} /></div>
        </div>
      </div>
    </section>
  );
}
