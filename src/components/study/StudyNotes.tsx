'use client';

import { useEffect, useState } from 'react';
import type { TopicId } from '@/lib/topics';
import { notifyProgress } from './ProgressTracker';
import { readProgress, writeProgress } from '@/lib/study-progress';

export function StudyNotes({ topicId }: { topicId: TopicId }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setValue(readProgress().notes[topicId] ?? '');
    sync();
  }, [topicId]);

  function save(nextValue: string) {
    const progress = readProgress();
    writeProgress({ ...progress, notes: { ...progress.notes, [topicId]: nextValue } });
    setSaved(true);
    notifyProgress();
  }

  return <section className="academic-panel panel-theorem notes-panel" aria-labelledby={`${topicId}-notes-title`}><div className="panel-kicker">Personal notes</div><h2 id={`${topicId}-notes-title`}>Write the explanation you would give in an interview</h2><label className="sr-only" htmlFor={`${topicId}-notes`}>Personal notes for {getTopicLabel(topicId)}</label><textarea id={`${topicId}-notes`} value={value} onChange={(event) => { setValue(event.target.value); setSaved(false); }} onBlur={() => save(value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(value); } }} placeholder="Capture a definition, a common trap, or a worked example…" /><p className="notes-status" aria-live="polite">{saved ? 'Saved locally on this device.' : 'Notes save when you leave the field or press Ctrl/Cmd + S.'}</p></section>;
}

function getTopicLabel(topicId: TopicId): string {
  return topicId.replaceAll('-', ' ');
}
