'use client';

import Link from 'next/link';
import type { ConfidenceRating, ReviewOutcome } from '@/lib/study-progress';
import type { ReviewQueueItem } from '@/lib/review-queue';
import { topicUrl } from '@/lib/topics';

interface ReviewCardProps {
  item: ReviewQueueItem;
  confidence: ConfidenceRating;
  explanationVisible: boolean;
  onConfidenceChange: (rating: ConfidenceRating) => void;
  onExplanationToggle: () => void;
  onAnswer: (outcome: ReviewOutcome) => void;
}

export function ReviewCard({ item, confidence, explanationVisible, onConfidenceChange, onExplanationToggle, onAnswer }: ReviewCardProps) {
  const prompt = item.topic.quiz[0];
  const keyPoint = prompt?.kind === 'choice' ? prompt.options[prompt.answer] : prompt?.answer;
  return (
    <article className="review-card" aria-labelledby={`review-${item.topic.id}`}>
      <div className="review-card-heading">
        <div><p className="eyebrow">{item.topic.category}</p><h2 id={`review-${item.topic.id}`}>{item.topic.title}</h2></div>
        <Link href={topicUrl(item.topic.id)}>Open field guide <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="review-reasons" aria-label="Reasons this topic is in the queue">
        {item.reasons.map((reason) => <span key={reason}>{reason}</span>)}
      </div>
      <div className="review-prompt"><span>Recall prompt</span><p>{prompt?.prompt ?? item.topic.description}</p></div>
      {explanationVisible && <div className="review-explanation" role="region" aria-label="Explanation"><strong>Explanation</strong><p>{prompt?.explanation ?? item.topic.description}</p>{keyPoint && <p className="review-key-point"><strong>Key point:</strong> {keyPoint}</p>}</div>}
      <fieldset className="confidence-fieldset">
        <legend>How confident are you?</legend>
        <div className="confidence-scale">
          {([1, 2, 3, 4, 5] as const).map((rating) => <button key={rating} type="button" className={confidence === rating ? 'selected' : ''} aria-pressed={confidence === rating} onClick={() => onConfidenceChange(rating)}><span>{rating}</span><small>{rating === 1 ? 'Low' : rating === 5 ? 'High' : ''}</small></button>)}
        </div>
      </fieldset>
      <div className="review-card-actions">
        <button type="button" className="review-knew" onClick={() => onAnswer('knew')}>I knew this <kbd>K</kbd></button>
        <button type="button" className="review-practice" onClick={() => onAnswer('practice')}>Needs more practice <kbd>P</kbd></button>
        <button type="button" onClick={onExplanationToggle} aria-expanded={explanationVisible}>{explanationVisible ? 'Hide explanation' : 'Show explanation'} <kbd>E</kbd></button>
        <button type="button" onClick={() => onAnswer('skipped')}>Skip <kbd>S</kbd></button>
      </div>
    </article>
  );
}
