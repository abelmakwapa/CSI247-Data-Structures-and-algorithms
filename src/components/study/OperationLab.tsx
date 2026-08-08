'use client';

import { useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

export function OperationLab({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const [active, setActive] = useState(0);
  const operation = topic.operations[active];

  return (
    <section className="academic-panel panel-definition operation-lab" aria-labelledby={`${topicId}-lab-title`}>
      <div className="panel-kicker">Operation lab</div>
      <h2 id={`${topicId}-lab-title`}>Run the idea, then name the cost</h2>
      <p className="panel-intro">Choose a small operation to see what changes and which part of the structure does the work.</p>
      <div className="operation-layout">
        <div className="operation-buttons" role="tablist" aria-label={`${topic.title} operations`}>
          {topic.operations.map((item, index) => <button key={item.label} type="button" role="tab" aria-selected={active === index} className={active === index ? 'active' : ''} onClick={() => setActive(index)}>{item.label}</button>)}
        </div>
        <div className="operation-readout" role="tabpanel">
          <span className="readout-label">estimated work</span>
          <strong>{operation.complexity}</strong>
          <p>{operation.explanation}</p>
          <div className="operation-progress" aria-hidden="true"><span style={{ width: `${Math.min(100, 18 + active * 31)}%` }} /></div>
        </div>
      </div>
    </section>
  );
}
