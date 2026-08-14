import type { TopicId } from '../topics';
import type { CodeExampleConfig } from './types';
import { arraysCodeExample } from './arrays';
import { backtrackingCodeExample } from './backtracking';
import { bigOCodeExample } from './big-o';
import { binarySearchTreesCodeExample } from './binary-search-trees';
import { binarySearchCodeExample } from './binary-search';
import { bloomFiltersCodeExample } from './bloom-filters';
import { dequesCodeExample } from './deques';
import { disjointSetUnionCodeExample } from './disjoint-set-union';
import { dynamicProgrammingCodeExample } from './dynamic-programming';
import { graphsCodeExample } from './graphs';
import { greedyAlgorithmsCodeExample } from './greedy-algorithms';
import { hashMapsCodeExample } from './hash-maps';
import { hashSetsCodeExample } from './hash-sets';
import { heapsCodeExample } from './heaps';
import { linkedListsCodeExample } from './linked-lists';
import { lruCacheCodeExample } from './lru-cache';
import { queuesCodeExample } from './queues';
import { recursionCodeExample } from './recursion';
import { sortingCodeExample } from './sorting';
import { stacksCodeExample } from './stacks';
import { treesCodeExample } from './trees';
import { triesCodeExample } from './tries';

const codeExampleSets: Array<readonly [TopicId, CodeExampleConfig]> = [
  ['arrays', arraysCodeExample],
  ['linked-lists', linkedListsCodeExample],
  ['stacks', stacksCodeExample],
  ['queues', queuesCodeExample],
  ['deques', dequesCodeExample],
  ['hash-maps', hashMapsCodeExample],
  ['hash-sets', hashSetsCodeExample],
  ['trees', treesCodeExample],
  ['binary-search-trees', binarySearchTreesCodeExample],
  ['heaps', heapsCodeExample],
  ['graphs', graphsCodeExample],
  ['tries', triesCodeExample],
  ['disjoint-set-union', disjointSetUnionCodeExample],
  ['bloom-filters', bloomFiltersCodeExample],
  ['lru-cache', lruCacheCodeExample],
  ['sorting', sortingCodeExample],
  ['binary-search', binarySearchCodeExample],
  ['recursion', recursionCodeExample],
  ['backtracking', backtrackingCodeExample],
  ['greedy-algorithms', greedyAlgorithmsCodeExample],
  ['dynamic-programming', dynamicProgrammingCodeExample],
  ['big-o', bigOCodeExample],
];

export function getCodeExampleConfig(topicId: TopicId): CodeExampleConfig {
  const config = codeExampleSets.find(([id]) => id === topicId)?.[1];
  if (!config) throw new Error('Missing code example data for ' + topicId);
  return config;
}
