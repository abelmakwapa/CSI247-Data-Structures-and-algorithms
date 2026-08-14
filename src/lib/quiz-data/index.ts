import type { QuizQuestion, TopicId } from '../topics';
import { arraysQuiz } from './arrays';
import { backtrackingQuiz } from './backtracking';
import { bigOQuiz } from './big-o';
import { binarySearchQuiz } from './binary-search';
import { binarySearchTreesQuiz } from './binary-search-trees';
import { bloomFiltersQuiz } from './bloom-filters';
import { dequesQuiz } from './deques';
import { disjointSetUnionQuiz } from './disjoint-set-union';
import { dynamicProgrammingQuiz } from './dynamic-programming';
import { graphsQuiz } from './graphs';
import { greedyAlgorithmsQuiz } from './greedy-algorithms';
import { hashMapsQuiz } from './hash-maps';
import { hashSetsQuiz } from './hash-sets';
import { heapsQuiz } from './heaps';
import { linkedListsQuiz } from './linked-lists';
import { lruCacheQuiz } from './lru-cache';
import { queuesQuiz } from './queues';
import { recursionQuiz } from './recursion';
import { sortingQuiz } from './sorting';
import { stacksQuiz } from './stacks';
import { treesQuiz } from './trees';
import { triesQuiz } from './tries';

interface QuizSet {
  topicId: TopicId;
  questions: QuizQuestion[];
}

const quizSets: QuizSet[] = [
  { topicId: 'arrays', questions: arraysQuiz },
  { topicId: 'linked-lists', questions: linkedListsQuiz },
  { topicId: 'stacks', questions: stacksQuiz },
  { topicId: 'queues', questions: queuesQuiz },
  { topicId: 'deques', questions: dequesQuiz },
  { topicId: 'hash-maps', questions: hashMapsQuiz },
  { topicId: 'hash-sets', questions: hashSetsQuiz },
  { topicId: 'trees', questions: treesQuiz },
  { topicId: 'binary-search-trees', questions: binarySearchTreesQuiz },
  { topicId: 'heaps', questions: heapsQuiz },
  { topicId: 'graphs', questions: graphsQuiz },
  { topicId: 'tries', questions: triesQuiz },
  { topicId: 'disjoint-set-union', questions: disjointSetUnionQuiz },
  { topicId: 'bloom-filters', questions: bloomFiltersQuiz },
  { topicId: 'lru-cache', questions: lruCacheQuiz },
  { topicId: 'sorting', questions: sortingQuiz },
  { topicId: 'binary-search', questions: binarySearchQuiz },
  { topicId: 'recursion', questions: recursionQuiz },
  { topicId: 'backtracking', questions: backtrackingQuiz },
  { topicId: 'greedy-algorithms', questions: greedyAlgorithmsQuiz },
  { topicId: 'dynamic-programming', questions: dynamicProgrammingQuiz },
  { topicId: 'big-o', questions: bigOQuiz },
];

export function getTopicQuiz(topicId: TopicId): QuizQuestion[] {
  const quiz = quizSets.find((set) => set.topicId === topicId)?.questions;
  if (!quiz) throw new Error(`Missing quiz data for ${topicId}`);
  return quiz;
}
