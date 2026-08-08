import type { TopicId } from './topics';
import { getTopic, topics, topicUrl } from './topics';

export interface TopicSearchResult {
  id: TopicId;
  title: string;
  description: string;
  url: string;
}

export function searchTopics(query: string): TopicSearchResult[] {
  const normalized = query.trim().toLowerCase();
  return topics
    .filter((topic) => !normalized || `${topic.title} ${topic.description} ${topic.category}`.toLowerCase().includes(normalized))
    .map((topic) => ({ id: topic.id, title: topic.title, description: topic.description, url: topicUrl(topic.id) }));
}

export function getRelatedTopics(ids: TopicId[]): TopicSearchResult[] {
  return ids.map((id) => getTopic(id)).map((topic) => ({ id: topic.id, title: topic.title, description: topic.description, url: topicUrl(topic.id) }));
}
