'use client';

import { useEffect, useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { readProgress } from '@/lib/study-progress';

export const PROGRESS_EVENT = 'algo-atlas-progress';

export function notifyProgress(): void {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function ProgressTracker({ total, compact = false }: { total: number; compact?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readProgress().understood.length);
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const percentage = total ? Math.round((count / total) * 100) : 0;

  return (
    <div className={`progress-tracker${compact ? ' progress-tracker-compact' : ''}`} role="group" aria-label={`${count} of ${total} topics understood`}>
      <div className="progress-tracker-head">
        <span>{compact ? 'Progress' : 'Your study path'}</span>
        <strong>{percentage}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div>
      {!compact && <div className="progress-tracker-copy">{count} / {total} topics understood</div>}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{count} of {total} topics understood. {percentage}% complete.</p>
    </div>
  );
}

export function isTopic(value: string): value is TopicId {
  return value.length > 0;
}
