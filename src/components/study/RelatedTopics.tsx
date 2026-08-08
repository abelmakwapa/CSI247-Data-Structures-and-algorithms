import Link from 'next/link';
import type { TopicId } from '@/lib/topics';
import { getRelatedTopics } from '@/lib/search';

export function RelatedTopics({ topicIds }: { topicIds: TopicId[] }) {
  return <section className="related-topics" aria-labelledby="related-topics-title"><div className="panel-kicker">Continue the path</div><h2 id="related-topics-title">Related topics</h2><div className="related-grid">{getRelatedTopics(topicIds).map((topic) => <Link key={topic.id} href={topic.url} className="related-card"><strong>{topic.title}</strong><span>{topic.description}</span></Link>)}</div></section>;
}
