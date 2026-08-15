import type { TopicId } from './topics';

export type TopicDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TopicTaxonomy {
  difficulty: TopicDifficulty;
}

export const topicTaxonomy: Record<TopicId, TopicTaxonomy> = {
  arrays: { difficulty: 'Beginner' },
  'linked-lists': { difficulty: 'Beginner' },
  stacks: { difficulty: 'Beginner' },
  queues: { difficulty: 'Beginner' },
  deques: { difficulty: 'Intermediate' },
  'hash-maps': { difficulty: 'Intermediate' },
  'hash-sets': { difficulty: 'Beginner' },
  trees: { difficulty: 'Intermediate' },
  'binary-search-trees': { difficulty: 'Intermediate' },
  heaps: { difficulty: 'Intermediate' },
  graphs: { difficulty: 'Advanced' },
  tries: { difficulty: 'Advanced' },
  'disjoint-set-union': { difficulty: 'Advanced' },
  'bloom-filters': { difficulty: 'Advanced' },
  'lru-cache': { difficulty: 'Advanced' },
  sorting: { difficulty: 'Intermediate' },
  'binary-search': { difficulty: 'Beginner' },
  recursion: { difficulty: 'Intermediate' },
  backtracking: { difficulty: 'Advanced' },
  'greedy-algorithms': { difficulty: 'Advanced' },
  'dynamic-programming': { difficulty: 'Advanced' },
  'big-o': { difficulty: 'Beginner' },
};
