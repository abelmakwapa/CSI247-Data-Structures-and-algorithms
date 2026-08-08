'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readProgress } from '@/lib/study-progress';
import { topics, topicUrl, type TopicMetadata } from '@/lib/topics';

export function ReviewDashboard() {
  const [items, setItems] = useState<TopicMetadata[]>([]);

  useEffect(() => {
    const sync = () => {
      const progress = readProgress();
      const ids = new Set([...progress.review, ...progress.bookmarks, ...topics.filter((topic) => !progress.understood.includes(topic.id)).map((topic) => topic.id)]);
      setItems(topics.filter((topic) => ids.has(topic.id)));
    };
    sync();
    window.addEventListener('algo-atlas-progress', sync);
    return () => window.removeEventListener('algo-atlas-progress', sync);
  }, []);

  return <div className="review-dashboard"><p className="eyebrow">Local review queue</p><h1>Review mode</h1><p>Use this list to revisit topics you have not marked understood, bookmarked, or explicitly flagged for review.</p>{items.length ? <div className="topic-grid">{items.map((topic) => <Link key={topic.id} href={topicUrl(topic.id)} className="topic-card"><span className="topic-card-number">{topic.category === 'Algorithms' ? 'ALG' : 'DS'}</span><span><strong>{topic.title}</strong><small>{topic.description}</small></span><span className="topic-arrow">→</span></Link>)}</div> : <div className="academic-panel panel-pro"><div className="panel-kicker">All clear</div><h2>You have no open review items.</h2><p>Mark a topic for review from its page when you want it back in the queue.</p></div>}</div>;
}
