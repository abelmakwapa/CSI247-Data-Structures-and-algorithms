'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { EMPTY_PROGRESS, getStudyMetrics, readProgress, type StudyProgress } from '@/lib/study-progress';
import { topics, topicMap, topicUrl, type TopicMetadata } from '@/lib/topics';
import { PROGRESS_EVENT } from './ProgressTracker';
import { StudyStatCard } from './StudyStatCard';
import { StudyTopicList } from './StudyTopicList';
import { ReviewSession } from './ReviewSession';

const totalTopics = topics.length;

export function StudyDashboard() {
  const [progress, setProgress] = useState<StudyProgress | null>(null);

  useEffect(() => {
    const sync = () => setProgress(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const currentProgress = progress ?? EMPTY_PROGRESS;
  const metrics = getStudyMetrics(currentProgress, totalTopics);
  const understoodTopics = topics.filter((topic) => currentProgress.understood.includes(topic.id));
  const reviewTopics = topics.filter((topic) => currentProgress.review.includes(topic.id));
  const bookmarkedTopics = topics.filter((topic) => currentProgress.bookmarks.includes(topic.id));
  const notedTopics = topics.filter((topic) => Boolean(currentProgress.notes[topic.id]?.trim()));
  const recentlyStudiedTopics = useMemo(() => getTopicsInOrder(currentProgress.recentlyStudied), [currentProgress.recentlyStudied]);
  const continueTopic = topics.find((topic) => !currentProgress.understood.includes(topic.id)) ?? topics[0];

  return (
    <div className="study-dashboard">
      <ReviewSession />
      <section className="study-dashboard-intro" aria-labelledby="study-dashboard-title">
        <div className="study-dashboard-intro-copy">
          <p className="eyebrow">Local study dashboard</p>
          <h1 id="study-dashboard-title">Know where you stand.</h1>
          <p>Keep the whole field guide in view, then choose the next topic that deserves your attention.</p>
          <div className="dashboard-actions">
            <Link className="primary-link" href={topicUrl(continueTopic.id)}>
              Continue studying <span aria-hidden="true">→</span>
            </Link>
            <Link className="secondary-link" href="#review-session">
              Start review session <span aria-hidden="true">↺</span>
            </Link>
          </div>
        </div>
        <DashboardProgress metrics={metrics} />
      </section>

      <section className="study-stats" aria-label="Study totals">
        <StudyStatCard label="Understood" value={`${metrics.understoodCount} / ${totalTopics}`} detail={`${metrics.completionPercentage}% complete`} tone="green" />
        <StudyStatCard label="For review" value={`${metrics.reviewCount} / ${totalTopics}`} detail={`${metrics.reviewPercentage}% of the atlas`} tone="red" />
        <StudyStatCard label="Bookmarked" value={String(metrics.bookmarkCount)} detail="Saved for a return visit" tone="gold" />
        <StudyStatCard label="Personal notes" value={String(metrics.notedCount)} detail="Topics with saved notes" tone="blue" />
      </section>

      <div className="study-dashboard-grid">
        <StudyTopicList
          id="understood-topics"
          label="01 · Mastery"
          title="Topics marked as understood"
          description="The concepts you have already claimed. Revisit them when a new connection appears."
          items={understoodTopics}
          tone="understood"
          emptyTitle="Your understood list is waiting."
          emptyDescription="Mark a topic as understood from its field guide page when the explanation feels solid."
        />
        <StudyTopicList
          id="review-topics"
          label="02 · Active recall"
          title="Topics marked for review"
          description="Keep the uncertain edges visible so your next session has a clear starting point."
          items={reviewTopics}
          tone="review"
          emptyTitle="No review flags yet."
          emptyDescription="Use Mark for review on any topic page when you want to return to a concept."
        />
        <StudyTopicList
          id="bookmarked-topics"
          label="03 · Saved"
          title="Bookmarked topics"
          description="A short shelf for ideas you want close at hand while building connections."
          items={bookmarkedTopics}
          tone="bookmark"
          emptyTitle="Nothing bookmarked yet."
          emptyDescription="Bookmark a topic to keep it in this quick-access shelf."
        />
        <StudyTopicList
          id="recently-studied"
          label="04 · Your trail"
          title="Recently studied"
          description="The last five topic pages you opened, kept locally on this device."
          items={recentlyStudiedTopics}
          tone="recent"
          emptyTitle="Your study trail starts here."
          emptyDescription="Open a topic from the field guide and it will appear in this list."
        />
        <StudyTopicList
          id="topics-with-notes"
          label="05 · Marginalia"
          title="Topics with personal notes"
          description="Your own definitions, traps, and worked examples, ready for another pass."
          items={notedTopics}
          tone="notes"
          emptyTitle="No personal notes yet."
          emptyDescription="Capture your explanation in a topic's Personal notes panel to build this collection."
        />
      </div>
    </div>
  );
}

function DashboardProgress({ metrics }: { metrics: ReturnType<typeof getStudyMetrics> }) {
  return (
    <div className="dashboard-progress-card" role="group" aria-label={`${metrics.understoodCount} of ${totalTopics} topics understood`}>
      <div className="dashboard-progress-topline">
        <span>Overall progress</span>
        <strong>{metrics.completionPercentage}%</strong>
      </div>
      <div className="dashboard-progress-track" role="progressbar" aria-label="Completion percentage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={metrics.completionPercentage}>
        <span style={{ width: `${metrics.completionPercentage}%` }} />
      </div>
      <div className="dashboard-progress-footer">
        <span>{metrics.understoodCount} of {totalTopics} topics understood</span>
        <span>{metrics.reviewPercentage}% to review</span>
      </div>
    </div>
  );
}

function getTopicsInOrder(ids: StudyProgress['recentlyStudied']): TopicMetadata[] {
  return ids.map((id) => topicMap.get(id)).filter((topic): topic is TopicMetadata => Boolean(topic));
}
