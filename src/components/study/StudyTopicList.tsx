import Link from 'next/link';
import type { TopicMetadata } from '@/lib/topics';
import { topicUrl } from '@/lib/topics';

export type StudyTopicListTone = 'understood' | 'review' | 'bookmark' | 'recent' | 'notes';

interface StudyTopicListProps {
  id: string;
  label: string;
  title: string;
  description: string;
  items: TopicMetadata[];
  tone: StudyTopicListTone;
  emptyTitle: string;
  emptyDescription: string;
}

const toneLabels: Record<StudyTopicListTone, string> = {
  understood: 'Understood',
  review: 'Review',
  bookmark: 'Bookmarked',
  recent: 'Recently studied',
  notes: 'Notes',
};

export function StudyTopicList({ id, label, title, description, items, tone, emptyTitle, emptyDescription }: StudyTopicListProps) {
  return (
    <section className={`study-topic-section study-topic-section-${tone}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="study-section-heading">
        <div>
          <p className="panel-kicker">{label}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <span className="study-section-count">{items.length} {items.length === 1 ? 'topic' : 'topics'}</span>
      </div>
      <p className="study-section-description">{description}</p>
      {items.length ? (
        <div className="study-topic-list">
          {items.map((topic) => <StudyTopicCard key={topic.id} topic={topic} tone={tone} />)}
        </div>
      ) : (
        <div className="study-empty-state" role="status">
          <span className="study-empty-mark" aria-hidden="true">—</span>
          <div>
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function StudyTopicCard({ topic, tone }: { topic: TopicMetadata; tone: StudyTopicListTone }) {
  return (
    <Link href={topicUrl(topic.id)} className="study-topic-card">
      <span className="study-topic-card-index" aria-hidden="true">{topic.category === 'Algorithms' ? 'ALG' : 'DS'}</span>
      <span className="study-topic-card-copy">
        <strong>{topic.title}</strong>
        <small>{topic.description}</small>
      </span>
      <span className={`study-topic-badge study-topic-badge-${tone}`}>{toneLabels[tone]}</span>
      <span className="study-topic-card-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
