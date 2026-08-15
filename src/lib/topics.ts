export type TopicId =
  | 'arrays'
  | 'linked-lists'
  | 'stacks'
  | 'queues'
  | 'deques'
  | 'hash-maps'
  | 'hash-sets'
  | 'trees'
  | 'binary-search-trees'
  | 'heaps'
  | 'graphs'
  | 'tries'
  | 'disjoint-set-union'
  | 'bloom-filters'
  | 'lru-cache'
  | 'sorting'
  | 'binary-search'
  | 'recursion'
  | 'backtracking'
  | 'greedy-algorithms'
  | 'dynamic-programming'
  | 'big-o';

import { getTopicQuiz } from './quiz-data';
import { topicTaxonomy, type TopicDifficulty } from './topic-taxonomy';

export type TopicCategory = 'Data structures' | 'Algorithms';

export type DiagramKind =
  | 'array'
  | 'chain'
  | 'stack'
  | 'queue'
  | 'deque'
  | 'hash-map'
  | 'set'
  | 'tree'
  | 'bst'
  | 'heap'
  | 'graph'
  | 'trie'
  | 'dsu'
  | 'bloom'
  | 'lru'
  | 'sorting'
  | 'binary-search'
  | 'recursion'
  | 'backtracking'
  | 'greedy'
  | 'dynamic-programming'
  | 'big-o';

export type ComplexitySummary =
  | ComplexityNotation
  | 'O(1)*'
  | 'O(log n)*'
  | 'O(n)*'
  | '~O(1)'
  | 'O(depth)'
  | 'blocked'
  | 'count them'
  | 'must prove'
  | 'not safe*'
  | 'per state'
  | 'exponential'
  | 'high'
  | 'states × work'
  | 'table or compressed';

export interface ComplexityEntry {
  operation: string;
  average: ComplexitySummary;
  note?: string;
}

export type ComplexityNotation =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(2ⁿ)'
  | 'O(V)'
  | 'O(V + E)'
  | 'O(k)'
  | 'O(k + z)'
  | 'O(z)'
  | 'O(h)'
  | 'O(d)'
  | 'O(m)'
  | 'O(n + m)'
  | 'O(q log n)'
  | 'O(states)'
  | 'O(n · k)'
  | 'O(α(n))'
  | 'O(n α(n))'
  | 'O(m α(n))'
  | 'O(capacity)'
  | 'O(states × work)'
  | 'O(decisions)'
  | 'Ω(n log n)'
  | 'varies'
  | 'depends'
  | 'problem-dependent'
  | 'not applicable'
  | 'not supported'
  | 'possible';

export type ComplexityQualifier =
  | 'amortized'
  | 'expected'
  | 'if balanced'
  | 'with a known reference'
  | 'output-sensitive'
  | 'recursive'
  | 'iterative'
  | 'adjacency list'
  | 'probabilistic'
  | 'with pruning'
  | 'implementation-dependent';

export interface ComplexityMeasure {
  value: ComplexityNotation;
  qualifier?: ComplexityQualifier;
}

export interface ComplexityTableEntry {
  operation: string;
  best: ComplexityMeasure;
  average: ComplexityMeasure;
  worst: ComplexityMeasure;
  space: ComplexityMeasure;
  explanation: string;
  amortized?: string;
}

export interface ComplexityScaleItem {
  notation: Extract<ComplexityNotation, 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)'>;
  label: string;
  rank: 1 | 2 | 3 | 4 | 5 | 6;
  explanation: string;
}

export type ComplexityClass = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)' | 'O(V + E)' | 'Other';

export const complexityClasses: readonly ComplexityClass[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(V + E)', 'Other'];

export const complexityScale: readonly ComplexityScaleItem[] = [
  { notation: 'O(1)', label: 'Constant', rank: 1, explanation: 'Work stays the same as n grows.' },
  { notation: 'O(log n)', label: 'Logarithmic', rank: 2, explanation: 'Work grows by shrinking the remaining search space.' },
  { notation: 'O(n)', label: 'Linear', rank: 3, explanation: 'Work grows in direct proportion to n.' },
  { notation: 'O(n log n)', label: 'Linearithmic', rank: 4, explanation: 'A logarithmic process repeats across n items.' },
  { notation: 'O(n²)', label: 'Quadratic', rank: 5, explanation: 'Each item can trigger another pass over n items.' },
  { notation: 'O(2ⁿ)', label: 'Exponential', rank: 6, explanation: 'Each new decision can double the search space.' },
];

type ComplexityMeasureInput = ComplexityNotation | ComplexityMeasure;

const measure = (value: ComplexityMeasureInput, qualifier?: ComplexityQualifier): ComplexityMeasure =>
  typeof value === 'string' ? { value, qualifier } : value;

const complexityRow = (
  operation: string,
  best: ComplexityMeasureInput,
  average: ComplexityMeasureInput,
  worst: ComplexityMeasureInput,
  space: ComplexityMeasureInput,
  explanation: string,
  amortized?: string,
): ComplexityTableEntry => ({
  operation,
  best: measure(best),
  average: measure(average),
  worst: measure(worst),
  space: measure(space),
  explanation,
  amortized,
});

export const complexityProfileByTopic: Record<TopicId, readonly ComplexityTableEntry[]> = {
  arrays: [
    complexityRow('Access by index', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'The index is converted directly into an address.'),
    complexityRow('Search', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'An unsorted array may require checking every element.'),
    complexityRow('Insert', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Inserting before the end shifts the tail to open a slot.', 'Appending is O(1) amortized when capacity grows geometrically.'),
    complexityRow('Delete', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Deleting before the end shifts later elements left.'),
  ],
  'linked-lists': [
    complexityRow('Access by index', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Nodes must be followed from a known end one link at a time.'),
    complexityRow('Search', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Without an ordering shortcut, a value may be anywhere in the chain.'),
    complexityRow('Insert with node reference', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Redirect the neighboring links once the insertion point is known.', 'Finding the reference can still cost O(n).'),
    complexityRow('Delete with node reference', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Unlink the node by changing a constant number of pointers.', 'The bound assumes the predecessor or equivalent reference is already available.'),
  ],
  stacks: [
    complexityRow('Push', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Place one item at the top.'),
    complexityRow('Pop', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Remove the item at the top.'),
    complexityRow('Peek', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Read the top without changing the stack.'),
    complexityRow('Search', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Inspecting an interior value requires passing the items above it.'),
  ],
  queues: [
    complexityRow('Enqueue', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Attach an item at the rear pointer.'),
    complexityRow('Dequeue', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Advance the front pointer to the next item.'),
    complexityRow('Peek', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Read the front item without removing it.'),
    complexityRow('Search', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'A queue exposes order, not a direct lookup path.'),
  ],
  deques: [
    complexityRow('Push at either end', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'A deque keeps both boundary operations local.'),
    complexityRow('Pop at either end', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Remove through the front or rear pointer.'),
    complexityRow('Peek at either end', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Both boundary items are directly available.'),
    complexityRow('Inspect middle', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'The middle still requires walking through the structure.'),
  ],
  'hash-maps': [
    complexityRow('Get', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(1)', 'Hashing usually selects one bucket; collisions can form a scan.'),
    complexityRow('Put', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(n)', 'Insert or update a bucket, possibly while resizing the table.', 'The expected O(1) bound is amortized across resizes.'),
    complexityRow('Delete', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(1)', 'Find the key, then unlink its bucket entry.'),
    complexityRow('Resize table', 'O(n)', 'O(n)', 'O(n)', 'O(n)', 'Rehash every stored key into a larger table.'),
  ],
  'hash-sets': [
    complexityRow('Has', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(1)', 'Hash the candidate and inspect its expected bucket.'),
    complexityRow('Add', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(n)', 'Insert only when the candidate is not already present.', 'The expected O(1) bound is amortized across resizes.'),
    complexityRow('Delete', 'O(1)', { value: 'O(1)', qualifier: 'expected' }, 'O(n)', 'O(1)', 'Locate the bucket entry and unlink it.'),
    complexityRow('Find first duplicate', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'A pass remembers each item and stops at the first repeat.'),
  ],
  trees: [
    complexityRow('Find node', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'A plain tree has no ordering rule to eliminate branches.'),
    complexityRow('Insert child', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'With the parent reference in hand, attach one child directly.', 'The bound assumes the parent reference is already known.'),
    complexityRow('Depth-first traversal', 'O(n)', 'O(n)', 'O(n)', 'O(h)', 'A complete traversal visits each of n nodes once.'),
    complexityRow('Compute height', 'O(1)', 'O(n)', 'O(n)', 'O(h)', 'Height is discovered by visiting the relevant subtree structure.'),
  ],
  'binary-search-trees': [
    complexityRow('Search', 'O(1)', { value: 'O(log n)', qualifier: 'if balanced' }, 'O(n)', 'O(h)', 'Each comparison discards one subtree only when height stays small.'),
    complexityRow('Insert', 'O(1)', { value: 'O(log n)', qualifier: 'if balanced' }, 'O(n)', 'O(h)', 'Follow the ordering path, then attach the new leaf.', 'Balancing maintenance can change the exact implementation cost.'),
    complexityRow('Delete', 'O(1)', { value: 'O(log n)', qualifier: 'if balanced' }, 'O(n)', 'O(h)', 'Find the node and reconnect its successor or child.'),
    complexityRow('In-order traversal', 'O(n)', 'O(n)', 'O(n)', 'O(h)', 'Visit left, node, and right to emit all n keys in order.'),
  ],
  heaps: [
    complexityRow('Peek top', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'The root always stores the highest-priority item.'),
    complexityRow('Push', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', 'Bubble the new leaf upward until heap order is restored.'),
    complexityRow('Pop top', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', 'Move the last leaf to the root, then sink it down.'),
    complexityRow('Build heap', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Bottom-up heap construction reuses work between levels.'),
  ],
  graphs: [
    complexityRow('Add edge', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Append the neighbor in an adjacency list.', 'The representation determines the constant factors; adjacency lists keep the update local.'),
    complexityRow('BFS / DFS', 'O(V + E)', 'O(V + E)', 'O(V + E)', 'O(V)', 'Each reachable vertex and each incident edge is examined at most once.'),
    complexityRow('Edge lookup', 'O(1)', 'O(1)', 'O(V)', 'O(1)', 'A matrix or hashed neighbors give direct lookup; a list may scan a vertex degree.'),
    complexityRow('Shortest path', 'O(1)', 'varies', 'varies', 'O(V)', 'Weights, negative edges, and the chosen algorithm determine the bound.'),
  ],
  tries: [
    complexityRow('Insert word', 'O(k)', 'O(k)', 'O(k)', 'O(k)', 'Follow or create one edge per character.'),
    complexityRow('Find word', 'O(k)', 'O(k)', 'O(k)', 'O(1)', 'The search follows at most one path of key length k.'),
    complexityRow('Prefix query', 'O(k)', 'O(k + z)', 'O(k + z)', 'O(z)', 'Reach the prefix in k steps, then emit z matching completions.', 'The output-sensitive term z counts returned words.'),
    complexityRow('Store dictionary', 'O(k)', 'O(n · k)', 'O(n · k)', 'O(n · k)', 'A trie stores shared prefixes, but each character can still create a node.'),
  ],
  'disjoint-set-union': [
    complexityRow('Find representative', 'O(1)', { value: 'O(α(n))', qualifier: 'amortized' }, 'O(α(n))', 'O(1)', 'Path compression flattens parent links used by the query.', 'With union by rank or size, a sequence of operations is nearly constant amortized.'),
    complexityRow('Union components', 'O(1)', { value: 'O(α(n))', qualifier: 'amortized' }, 'O(α(n))', 'O(1)', 'Find two representatives, then attach one root under the other.', 'The inverse-Ackermann factor applies across the operation sequence.'),
    complexityRow('Make set', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Initialize one parent and one rank or size value.'),
    complexityRow('Process m unions/finds', 'O(m)', 'O(m α(n))', 'O(m α(n))', 'O(n)', 'The near-linear sequence bound captures the cost of repeated connectivity checks.'),
  ],
  'bloom-filters': [
    complexityRow('Add', 'O(k)', 'O(k)', 'O(k)', 'O(1)', 'Set k hash-derived bits in the filter.'),
    complexityRow('Check membership', 'O(k)', 'O(k)', 'O(k)', 'O(1)', 'One zero bit proves absence; all set bits mean “maybe present.”'),
    complexityRow('False-positive outcome', 'possible', 'possible', 'possible', 'O(1)', 'The filter can report a present item that was never inserted.', 'False positives are probabilistic; false negatives are not expected in a standard filter.'),
    complexityRow('Delete', 'not supported', 'not supported', 'not supported', 'O(1)', 'A standard Bloom filter cannot tell which item set a bit; use a counting variant for deletion.'),
  ],
  'lru-cache': [
    complexityRow('Get', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Map lookup finds the node, then the list moves it to the front.'),
    complexityRow('Put', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Insert or update, move to the front, and evict the tail if full.'),
    complexityRow('Evict least recent', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'The linked-list tail is always the least recently used node.'),
    complexityRow('Cache storage', 'O(capacity)', 'O(capacity)', 'O(capacity)', 'O(capacity)', 'The map and recency list retain at most capacity entries.'),
  ],
  sorting: [
    complexityRow('Merge sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Divide the input, then merge sorted halves in linear work per level.'),
    complexityRow('Quicksort', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(h)', 'Good pivots keep partitions balanced; repeated bad pivots form a chain.'),
    complexityRow('Insertion sort', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', 'A nearly sorted prefix makes each insertion cheap.'),
    complexityRow('Comparison lower bound', 'Ω(n log n)', 'Ω(n log n)', 'Ω(n log n)', 'O(1)', 'Any comparison sort needs at least this many comparisons in the general case.'),
  ],
  'binary-search': [
    complexityRow('Search', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', 'Each comparison discards roughly half of an ordered search interval.', 'The iterative form keeps auxiliary space constant.'),
    complexityRow('Check midpoint', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Compute one midpoint and compare one value.'),
    complexityRow('Pre-sort input', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Binary search only pays off after the input is ordered.'),
    complexityRow('Search repeated queries', 'O(log n)', 'O(q log n)', 'O(q log n)', 'O(1)', 'Run the logarithmic query q times after ordering is available.'),
  ],
  recursion: [
    complexityRow('Linear recursion', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'One smaller call waits on the stack at each depth.', 'The stack-space term is the recursion depth, even when each call is constant work.'),
    complexityRow('Binary recursion', 'O(1)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(n)', 'Two recursive branches can repeat the same subproblems exponentially.'),
    complexityRow('Memoized recurrence', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'Store each state once so repeated calls become table lookups.'),
    complexityRow('One call frame', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Creating or returning from one frame is constant work.'),
  ],
  backtracking: [
    complexityRow('Choose / undo', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Add or remove one candidate from the current partial solution.'),
    complexityRow('Enumerate subsets', 'O(1)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(n)', 'Each item creates an include/exclude branch in the decision tree.'),
    complexityRow('Pruned search', 'O(1)', 'problem-dependent', 'O(2ⁿ)', 'O(n)', 'A valid bound can cut branches, but worst-case exploration may remain exponential.', 'The benefit of pruning depends on the constraints and input distribution.'),
    complexityRow('Decision depth', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'The current path stores at most one decision per input item.'),
  ],
  'greedy-algorithms': [
    complexityRow('Sort choices', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', 'Order candidates by the key that supports the greedy choice.'),
    complexityRow('Scan choices', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Inspect each candidate once after the ordering is ready.'),
    complexityRow('Take safe choice', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Commit to the next feasible candidate after the proof condition holds.'),
    complexityRow('Greedy workspace', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'Input copying, sorting, or selected-output storage determines extra space.'),
  ],
  'dynamic-programming': [
    complexityRow('State transition', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Read previously computed state and combine a fixed number of values.'),
    complexityRow('Fill table', 'O(n)', 'O(states × work)', 'O(states × work)', 'O(states)', 'Compute each state once, then pay the transition cost for that state.'),
    complexityRow('Memoized recursion', 'O(1)', 'O(states × work)', 'O(states × work)', 'O(states)', 'Caching prevents the same state from expanding repeatedly.'),
    complexityRow('Space-compressed DP', 'O(1)', 'O(states)', 'O(states)', 'O(n)', 'Keep only the dependency frontier when the full table is unnecessary.'),
  ],
  'big-o': [
    complexityRow('O(1) constant', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'The amount of work does not depend on n.'),
    complexityRow('O(log n) logarithmic', 'O(log n)', 'O(log n)', 'O(log n)', 'O(1)', 'A constant fraction of the remaining input disappears each step.'),
    complexityRow('O(n) linear', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'A single pass scales directly with the number of items.'),
    complexityRow('O(n log n) linearithmic', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Divide-and-conquer or ordered processing combines n work with log n levels.'),
    complexityRow('O(n²) quadratic', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', 'Nested passes can compare each item with many other items.'),
    complexityRow('O(2ⁿ) exponential', 'O(2ⁿ)', 'O(2ⁿ)', 'O(2ⁿ)', 'O(n)', 'Binary choices can double the number of branches at every input step.'),
  ],
};

export interface OperationLabStep {
  label: string;
  complexity: string;
  explanation: string;
  visualStep: number;
}

export interface CodeExamples {
  javascript: string;
  python: string;
}

export interface ChoiceQuizQuestion {
  kind: 'choice';
  id: string;
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
}

export interface TrueFalseQuizQuestion {
  kind: 'true-false';
  id: string;
  prompt: string;
  answer: boolean;
  explanation: string;
}

export interface ShortAnswerQuizQuestion {
  kind: 'short-answer';
  id: string;
  prompt: string;
  answer: string;
  acceptedAnswers?: readonly string[];
  explanation: string;
}

export interface OutputQuizQuestion {
  kind: 'output';
  id: string;
  prompt: string;
  code: string;
  answer: string;
  acceptedAnswers?: readonly string[];
  explanation: string;
}

export type QuizQuestion = ChoiceQuizQuestion | TrueFalseQuizQuestion | ShortAnswerQuizQuestion | OutputQuizQuestion;

export interface TopicMetadata {
  id: TopicId;
  title: string;
  category: TopicCategory;
  difficulty: TopicDifficulty;
  description: string;
  diagram: DiagramKind;
  complexity: ComplexityEntry[];
  complexityProfile: readonly ComplexityTableEntry[];
  operations: OperationLabStep[];
  examples: CodeExamples;
  quiz: QuizQuestion[];
  related: TopicId[];
}

type TopicDefinition = Omit<TopicMetadata, 'quiz' | 'difficulty' | 'complexityProfile'> & { quiz?: unknown };

const topic = (value: TopicDefinition): TopicMetadata => ({
  ...value,
  complexityProfile: complexityProfileByTopic[value.id],
  difficulty: topicTaxonomy[value.id].difficulty,
  quiz: getTopicQuiz(value.id),
});

export const topics: TopicMetadata[] = [
  topic({ id: 'arrays', title: 'Arrays', category: 'Data structures', description: "The fastest way to reach a known position — and a reminder that flexibility always has a price.", diagram: 'array', complexity: [{ operation: "Access", average: "O(1)", note: "One direct move. The input size does not change the number of steps." }, { operation: "Search", average: "O(n)" }, { operation: "Insert", average: "O(n)", note: "Everything after the gap shifts one slot to the right." }, { operation: "Delete", average: "O(n)", note: "The tail closes the gap by shifting left." }], operations: [{ label: "Access index", complexity: "O(1)", explanation: "One direct move. The input size does not change the number of steps.", visualStep: 1 }, { label: "Insert middle", complexity: "O(n)", explanation: "Everything after the gap shifts one slot to the right.", visualStep: 2 }, { label: "Delete middle", complexity: "O(n)", explanation: "The tail closes the gap by shifting left.", visualStep: 3 }], examples: { javascript: `const seats = [10, 20, 30, 40];\nconsole.log(seats[2]);\nseats.splice(1, 0, 15);`, python: `seats = [10, 20, 30, 40]\nprint(seats[2])\nseats.insert(1, 15)` }, quiz: [{ kind: 'choice', prompt: 'Why is array access by index usually constant time?', options: ['The address is calculated directly', 'The array scans every value', 'The array sorts itself'], answer: 0, explanation: 'Contiguous slots let the runtime calculate base + index × slot size.' }, { kind: 'recall', prompt: 'When does inserting into the middle become expensive?', answer: 'When later elements must shift to preserve order.', explanation: 'The shift touches the tail, so the work grows with n.' }], related: ['linked-lists', 'binary-search', 'sorting'] }),
  topic({ id: 'linked-lists', title: 'Linked Lists', category: 'Data structures', description: "A chain of small records that optimizes for local edits instead of direct access.", diagram: 'chain', complexity: [{ operation: "Access", average: "O(n)" }, { operation: "Search", average: "O(n)", note: "There is no address calculation shortcut." }, { operation: "Insert*", average: "O(1)" }, { operation: "Delete*", average: "O(1)" }], operations: [{ label: "Walk to index", complexity: "O(n)", explanation: "Follow next pointers one node at a time.", visualStep: 1 }, { label: "Splice after node", complexity: "O(1)", explanation: "Redirect two links; the rest of the chain is untouched.", visualStep: 2 }, { label: "Search value", complexity: "O(n)", explanation: "There is no address calculation shortcut.", visualStep: 3 }], examples: { javascript: `class Node { constructor(value) { this.value = value; this.next = null; } }\nconst head = new Node('A');\nhead.next = new Node('B');`, python: `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\nhead = Node('A')\nhead.next = Node('B')` }, quiz: [{ kind: 'choice', prompt: 'What makes a linked-list insertion O(1)?', options: ['Having the insertion node reference', 'Random indexing', 'Sorting the list first'], answer: 0, explanation: 'The pointer updates are constant-time; finding the node may still be O(n).' }, { kind: 'recall', prompt: 'Why is indexing a linked list O(n)?', answer: 'You must follow the chain from a known end until the target position.', explanation: 'Nodes are not contiguous, so there is no direct address formula.' }], related: ['arrays', 'stacks', 'queues'] }),
  topic({ id: 'stacks', title: 'Stacks', category: 'Data structures', description: "A deliberately narrow interface where the newest item is always the next one out.", diagram: 'stack', complexity: [{ operation: "Push", average: "O(1)", note: "Place one item on top." }, { operation: "Pop", average: "O(1)", note: "Remove the top item." }, { operation: "Peek", average: "O(1)" }, { operation: "Search", average: "O(n)", note: "To find the middle, you must pop past the top." }], operations: [{ label: "Push", complexity: "O(1)", explanation: "Place one item on top.", visualStep: 1 }, { label: "Pop", complexity: "O(1)", explanation: "Remove the top item.", visualStep: 2 }, { label: "Search", complexity: "O(n)", explanation: "To find the middle, you must pop past the top.", visualStep: 3 }], examples: { javascript: `const stack = [];\nstack.push('parse header');\nstack.push('parse body');\nconsole.log(stack.pop());`, python: `stack = []\nstack.append('parse header')\nstack.append('parse body')\nprint(stack.pop())` }, quiz: [{ kind: 'choice', prompt: 'What does LIFO mean?', options: ['Last in, first out', 'Least input, first output', 'Links in, files out'], answer: 0, explanation: 'The most recently pushed item is the next item popped.' }, { kind: 'recall', prompt: 'Name one algorithmic task that naturally uses a stack.', answer: 'Parsing, undo, browser back, or recursion simulation.', explanation: 'Nested unfinished work is resolved in reverse order.' }], related: ['queues', 'recursion', 'backtracking'] }),
  topic({ id: 'queues', title: 'Queues', category: 'Data structures', description: "A fair line for work: new arrivals join the rear while the oldest request leaves the front.", diagram: 'queue', complexity: [{ operation: "Enqueue", average: "O(1)", note: "Attach at the rear." }, { operation: "Dequeue", average: "O(1)", note: "Advance the front pointer." }, { operation: "Peek", average: "O(1)" }, { operation: "Search", average: "O(n)" }], operations: [{ label: "Enqueue", complexity: "O(1)", explanation: "Attach at the rear.", visualStep: 1 }, { label: "Dequeue", complexity: "O(1)", explanation: "Advance the front pointer.", visualStep: 2 }, { label: "Dequeue from array", complexity: "O(n)", explanation: "Naively shifting the array makes the queue expensive.", visualStep: 3 }], examples: { javascript: `const queue = ['request A'];\nqueue.push('request B');\nconsole.log(queue.shift());`, python: `from collections import deque\nqueue = deque(['request A'])\nqueue.append('request B')\nprint(queue.popleft())` }, quiz: [{ kind: 'choice', prompt: 'Which item leaves a queue first?', options: ['The oldest item', 'The newest item', 'The highest-priority item'], answer: 0, explanation: 'FIFO means first in, first out.' }, { kind: 'recall', prompt: 'Why can array.shift() be a queue trap?', answer: 'It may shift every remaining element and cost O(n).', explanation: 'Use a head index, circular buffer, or deque instead.' }], related: ['stacks', 'deques', 'graphs'] }),
  topic({ id: 'deques', title: 'Deques', category: 'Data structures', description: "A double-ended queue that can behave like a stack, a queue, or something in between.", diagram: 'deque', complexity: [{ operation: "Push front", average: "O(1)", note: "Add to the left edge." }, { operation: "Push back", average: "O(1)", note: "Add to the left edge." }, { operation: "Pop front", average: "O(1)", note: "Remove the right edge." }, { operation: "Pop back", average: "O(1)", note: "Remove the right edge." }], operations: [{ label: "Push front", complexity: "O(1)", explanation: "Add to the left edge.", visualStep: 1 }, { label: "Pop back", complexity: "O(1)", explanation: "Remove the right edge.", visualStep: 2 }, { label: "Inspect middle", complexity: "O(n)", explanation: "The middle is still not the point of a deque.", visualStep: 3 }], examples: { javascript: `const window = ['B', 'C'];\nwindow.unshift('A');\nconsole.log(window.pop());`, python: `from collections import deque\nwindow = deque(['B', 'C'])\nwindow.appendleft('A')\nprint(window.pop())` }, quiz: [{ kind: 'choice', prompt: 'What makes a deque different from a queue?', options: ['Both ends support insertion and removal', 'It always sorts items', 'It stores only priorities'], answer: 0, explanation: 'A deque exposes both ends.' }, { kind: 'recall', prompt: 'Why is a deque useful for a sliding window?', answer: 'Old and new candidates can enter or leave from opposite ends.', explanation: 'Monotonic deques keep the best candidate at a boundary.' }], related: ['queues', 'stacks', 'graphs'] }),
  topic({ id: 'hash-maps', title: 'Hash Maps', category: 'Data structures', description: "Turn a key into a near-direct address so lookup does not scale with the size of the collection.", diagram: 'hash-map', complexity: [{ operation: "Get", average: "O(1)", note: "Hash the key and inspect the expected bucket." }, { operation: "Put", average: "O(1)", note: "Insert or update, amortized across resizes." }, { operation: "Delete", average: "O(1)" }, { operation: "Worst case", average: "O(n)", note: "Many keys in one bucket can degrade into a scan." }], operations: [{ label: "Get key", complexity: "O(1)", explanation: "Hash the key and inspect the expected bucket.", visualStep: 1 }, { label: "Put key", complexity: "O(1)", explanation: "Insert or update, amortized across resizes.", visualStep: 2 }, { label: "Worst-case collision", complexity: "O(n)", explanation: "Many keys in one bucket can degrade into a scan.", visualStep: 3 }], examples: { javascript: `const phone = new Map([['Mom', '+267 555 0147']]);\nconsole.log(phone.get('Mom'));`, python: `phone = {'Mom': '+267 555 0147'}\nprint(phone['Mom'])` }, quiz: [{ kind: 'choice', prompt: 'Why is hash-map lookup average O(1)?', options: ['The key selects a near-direct bucket', 'The map scans sorted values', 'The map uses recursion'], answer: 0, explanation: 'Hashing avoids scanning unrelated keys on average.' }, { kind: 'recall', prompt: 'What is a collision?', answer: 'Two keys map to the same bucket or probe location.', explanation: 'Collision handling is part of the map implementation.' }], related: ['hash-sets', 'lru-cache', 'tries'] }),
  topic({ id: 'hash-sets', title: 'Hash Sets', category: 'Data structures', description: "The stripped-down membership engine: keep the keys, discard the values, reject duplicates.", diagram: 'set', complexity: [{ operation: "Has", average: "O(1)", note: "Hash the candidate and check its bucket." }, { operation: "Add", average: "O(1)", note: "Insert only if the item is not already present." }, { operation: "Delete", average: "O(1)" }, { operation: "Duplicates", average: "blocked" }], operations: [{ label: "Has item", complexity: "O(1)", explanation: "Hash the candidate and check its bucket.", visualStep: 1 }, { label: "Add item", complexity: "O(1)", explanation: "Insert only if the item is not already present.", visualStep: 2 }, { label: "Deduplicate", complexity: "O(n)", explanation: "One pass while the set remembers what appeared.", visualStep: 3 }], examples: { javascript: `const seen = new Set();\nfor (const value of [3, 1, 3]) seen.add(value);\nconsole.log(seen.size);`, python: `seen = set([3, 1, 3])\nprint(len(seen))` }, quiz: [{ kind: 'choice', prompt: 'What is a hash set best at answering?', options: ['Is this item present?', 'What value belongs to this key?', 'What is the sorted median?'], answer: 0, explanation: 'Sets focus on membership and uniqueness.' }, { kind: 'recall', prompt: 'How can a set find the first duplicate?', answer: 'Track seen values and stop when a value is already present.', explanation: 'The set turns repeated membership checks into average O(1) work.' }], related: ['hash-maps', 'graphs', 'sorting'] }),
  topic({ id: 'trees', title: 'Trees', category: 'Data structures', description: "A parent–child model for data that branches: one root, many paths, and leaves at the edge.", diagram: 'tree', complexity: [{ operation: "Find node", average: "O(n)", note: "A plain tree has no ordering shortcut." }, { operation: "Insert child", average: "O(1)*" }, { operation: "Depth-first", average: "O(n)" }, { operation: "Height", average: "O(n)" }], operations: [{ label: "Add child", complexity: "O(1)*", explanation: "With the parent reference in hand, attach a child directly.", visualStep: 1 }, { label: "Traverse all", complexity: "O(n)", explanation: "Every node must be visited once.", visualStep: 2 }, { label: "Find by value", complexity: "O(n)", explanation: "A plain tree has no ordering shortcut.", visualStep: 3 }], examples: { javascript: `const folder = { name: 'src', children: [{ name: 'index.js', children: [] }] };\nconsole.log(folder.children[0].name);`, python: `folder = {'name': 'src', 'children': [{'name': 'index.py', 'children': []}]}\nprint(folder['children'][0]['name'])` }, quiz: [{ kind: 'choice', prompt: 'What distinguishes a tree from a general graph?', options: ['A parent-child hierarchy without cycles', 'It must be sorted', 'It has no edges'], answer: 0, explanation: 'A tree is connected and acyclic with a hierarchy when rooted.' }, { kind: 'recall', prompt: 'When is BFS more natural than DFS on a tree?', answer: 'When the problem is about levels or the nearest matching node.', explanation: 'A queue preserves level order.' }], related: ['binary-search-trees', 'graphs', 'tries'] }),
  topic({ id: 'binary-search-trees', title: 'Binary Search Trees', category: 'Data structures', description: "A binary tree with one ordering rule that lets each comparison eliminate a whole side.", diagram: 'bst', complexity: [{ operation: "Search", average: "O(log n)*", note: "Each comparison discards one subtree." }, { operation: "Insert", average: "O(log n)*", note: "Sorted data can turn the tree into a linked list." }, { operation: "Delete", average: "O(log n)*" }, { operation: "Worst case", average: "O(n)" }], operations: [{ label: "Search balanced", complexity: "O(log n)", explanation: "Each comparison discards one subtree.", visualStep: 1 }, { label: "Insert sorted input", complexity: "O(n)", explanation: "Sorted data can turn the tree into a linked list.", visualStep: 2 }, { label: "In-order walk", complexity: "O(n)", explanation: "Visit left, node, right to emit sorted values.", visualStep: 3 }], examples: { javascript: `function contains(node, target) {\n  if (!node) return false;\n  if (node.value === target) return true;\n  return contains(target < node.value ? node.left : node.right, target);\n}`, python: `def contains(node, target):\n    if node is None: return False\n    if node.value == target: return True\n    child = node.left if target < node.value else node.right\n    return contains(child, target)` }, quiz: [{ kind: 'choice', prompt: 'What does in-order traversal of a BST produce?', options: ['Sorted order', 'Insertion order', 'Random order'], answer: 0, explanation: 'Visit left, node, right to emit increasing keys.' }, { kind: 'recall', prompt: 'Why can a plain BST degrade to O(n)?', answer: 'Sorted insertion can create a one-sided chain.', explanation: 'Balance, not the label BST alone, preserves logarithmic height.' }], related: ['trees', 'binary-search', 'heaps'] }),
  topic({ id: 'heaps', title: 'Heaps', category: 'Data structures', description: "A nearly ordered tree that keeps the highest-priority item at the root without fully sorting everything.", diagram: 'heap', complexity: [{ operation: "Peek", average: "O(1)", note: "The root is always the best priority." }, { operation: "Push", average: "O(log n)", note: "Bubble the new leaf upward until the rule returns." }, { operation: "Pop top", average: "O(log n)", note: "Move the last leaf to the root, then sink it down." }, { operation: "Build heap", average: "O(n)" }], operations: [{ label: "Peek top", complexity: "O(1)", explanation: "The root is always the best priority.", visualStep: 1 }, { label: "Push item", complexity: "O(log n)", explanation: "Bubble the new leaf upward until the rule returns.", visualStep: 2 }, { label: "Pop top", complexity: "O(log n)", explanation: "Move the last leaf to the root, then sink it down.", visualStep: 3 }], examples: { javascript: `const tasks = [{ priority: 1, job: 'deploy' }, { priority: 3, job: 'email' }];\ntasks.sort((a, b) => a.priority - b.priority);\nconsole.log(tasks[0].job);`, python: `import heapq\ntasks = []\nheapq.heappush(tasks, (1, 'deploy'))\nprint(heapq.heappop(tasks))` }, quiz: [{ kind: 'choice', prompt: 'What is guaranteed at the top of a min-heap?', options: ['The smallest priority', 'Every value is sorted', 'The newest value'], answer: 0, explanation: 'Heap order is local: parent priority beats child priority.' }, { kind: 'recall', prompt: 'Why is arbitrary heap search O(n)?', answer: 'Only parent-child priority is guaranteed; unrelated branches are not ordered.', explanation: 'A heap is a priority structure, not a sorted search tree.' }], related: ['binary-search-trees', 'queues', 'sorting'] }),
  topic({ id: 'graphs', title: 'Graphs', category: 'Data structures', description: "Dots and connections for systems where relationships matter more than hierarchy.", diagram: 'graph', complexity: [{ operation: "Add edge", average: "O(1)*" }, { operation: "BFS / DFS", average: "O(V + E)", note: "Each vertex and edge is explored at most once." }, { operation: "Edge lookup", average: "O(1)*" }, { operation: "Shortest path", average: "varies", note: "The right algorithm depends on weights and constraints." }], operations: [{ label: "BFS / DFS", complexity: "O(V + E)", explanation: "Each vertex and edge is explored at most once.", visualStep: 1 }, { label: "Adjacency matrix lookup", complexity: "O(1)", explanation: "Fast lookup, but it pays O(V²) space.", visualStep: 2 }, { label: "Shortest path", complexity: "varies", explanation: "The right algorithm depends on weights and constraints.", visualStep: 3 }], examples: { javascript: `const graph = new Map([['A', ['B', 'C']], ['B', ['A', 'D']]]);\nconst visited = new Set(['A']);\nconsole.log(graph.get('A'));`, python: `graph = {'A': ['B', 'C'], 'B': ['A', 'D']}\nvisited = {'A'}\nprint(graph['A'])` }, quiz: [{ kind: 'choice', prompt: 'What usually determines adjacency-list traversal cost?', options: ['Vertices plus edges', 'Only the root', 'The number of array indices'], answer: 0, explanation: 'A traversal visits vertices and inspects their edges.' }, { kind: 'recall', prompt: 'Why must graph traversal track visited nodes?', answer: 'Graphs can contain cycles and multiple paths to the same vertex.', explanation: 'Visited state prevents infinite loops and duplicate work.' }], related: ['queues', 'trees', 'disjoint-set-union'] }),
  topic({ id: 'tries', title: 'Tries', category: 'Data structures', description: "A character-by-character tree that makes shared prefixes first-class data.", diagram: 'trie', complexity: [{ operation: "Insert", average: "O(k)" }, { operation: "Find word", average: "O(k)", note: "Follow one edge for each typed character." }, { operation: "Prefix query", average: "O(k + z)" }, { operation: "Space", average: "high" }], operations: [{ label: "Find prefix", complexity: "O(k)", explanation: "Follow one edge for each typed character.", visualStep: 1 }, { label: "List matches", complexity: "O(k + z)", explanation: "Reach the prefix, then emit z completions.", visualStep: 2 }, { label: "Delete word", complexity: "O(k)", explanation: "Unmark the terminal path and prune safely.", visualStep: 3 }], examples: { javascript: `const words = ['app', 'add', 'bat'];\nconsole.log(words.filter(word => word.startsWith('ap')));`, python: `words = ['app', 'add', 'bat']\nprint([word for word in words if word.startswith('ap')])` }, quiz: [{ kind: 'choice', prompt: 'What is k in trie complexity?', options: ['The key or prefix length', 'The number of unrelated keys', 'The number of buckets'], answer: 0, explanation: 'Trie work follows one edge per character.' }, { kind: 'recall', prompt: 'What does a terminal marker distinguish?', answer: 'A complete word from a prefix that only starts a longer word.', explanation: 'For example, app can be a word even when apple continues below it.' }], related: ['trees', 'hash-maps', 'binary-search'] }),
  topic({ id: 'disjoint-set-union', title: 'Disjoint Set Union', category: 'Data structures', description: "A tiny structure for tracking which items belong to the same connected component as groups merge.", diagram: 'dsu', complexity: [{ operation: "Find", average: "~O(1)", note: "Follow parent links, then compress the path." }, { operation: "Union", average: "~O(1)", note: "Attach one representative under the other." }, { operation: "Make set", average: "O(1)" }, { operation: "Space", average: "O(n)" }], operations: [{ label: "Find leader", complexity: "~O(1)", explanation: "Follow parent links, then compress the path.", visualStep: 1 }, { label: "Union groups", complexity: "~O(1)", explanation: "Attach one representative under the other.", visualStep: 2 }, { label: "Build components", complexity: "O(n α(n))", explanation: "A sequence of unions and finds is effectively linear.", visualStep: 3 }], examples: { javascript: `const parent = [0, 1, 2];\nfunction find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }\nparent[1] = 0; console.log(find(1));`, python: `parent = [0, 1, 2]\ndef find(x):\n    if parent[x] != x: parent[x] = find(parent[x])\n    return parent[x]\nparent[1] = 0\nprint(find(1))` }, quiz: [{ kind: 'choice', prompt: 'What does find(x) return in DSU?', options: ['The set representative', 'The shortest path', 'The tree height'], answer: 0, explanation: 'DSU identifies the component leader.' }, { kind: 'recall', prompt: 'What does path compression improve?', answer: 'It flattens used paths so later finds are faster.', explanation: 'Together with union by rank/size, operations are nearly constant amortized.' }], related: ['graphs', 'heaps', 'greedy-algorithms'] }),
  topic({ id: 'bloom-filters', title: 'Bloom Filters', category: 'Data structures', description: "A compact probabilistic gate that can say “definitely not” or “maybe yes.”", diagram: 'bloom', complexity: [{ operation: "Add", average: "O(k)", note: "Set k hash-derived bits." }, { operation: "Check", average: "O(k)", note: "One zero bit proves the item was never added." }, { operation: "False positive", average: "possible", note: "All bits can be set by other items." }, { operation: "Delete", average: "not safe*" }], operations: [{ label: "Add item", complexity: "O(k)", explanation: "Set k hash-derived bits.", visualStep: 1 }, { label: "Check absent", complexity: "O(k)", explanation: "One zero bit proves the item was never added.", visualStep: 2 }, { label: "False positive", complexity: "possible", explanation: "All bits can be set by other items.", visualStep: 3 }], examples: { javascript: `const bits = new Set([1, 4, 8]);\nconst positions = [1, 4];\nconsole.log(positions.every(position => bits.has(position)));`, python: `bits = {1, 4, 8}\npositions = [1, 4]\nprint(all(position in bits for position in positions))` }, quiz: [{ kind: 'choice', prompt: 'Which error can a standard Bloom filter never make?', options: ['False negative', 'False positive', 'Hash collision'], answer: 0, explanation: 'Inserted items set every bit they need; “no” is always certain.' }, { kind: 'recall', prompt: 'What should happen after a Bloom filter says “maybe present”?', answer: 'Run an exact check against the authoritative store.', explanation: 'A positive result can be a collision-driven false positive.' }], related: ['hash-sets', 'hash-maps', 'lru-cache'] }),
  topic({ id: 'lru-cache', title: 'LRU Cache', category: 'Data structures', description: "A bounded memory strategy that keeps hot items close and evicts the item untouched for longest.", diagram: 'lru', complexity: [{ operation: "Get", average: "O(1)", note: "Map lookup, then move the node to the front." }, { operation: "Put", average: "O(1)", note: "Insert/update, move to front, evict tail if full." }, { operation: "Evict", average: "O(1)", note: "The tail is always the least recently used node." }, { operation: "Space", average: "O(capacity)" }], operations: [{ label: "Get key", complexity: "O(1)", explanation: "Map lookup, then move the node to the front.", visualStep: 1 }, { label: "Put key", complexity: "O(1)", explanation: "Insert/update, move to front, evict tail if full.", visualStep: 2 }, { label: "Evict LRU", complexity: "O(1)", explanation: "The tail is always the least recently used node.", visualStep: 3 }], examples: { javascript: `const cache = new Map();\ncache.set('route', 'cached result');\nconsole.log(cache.get('route'));`, python: `from functools import lru_cache\n@lru_cache(maxsize=2)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)` }, quiz: [{ kind: 'choice', prompt: 'Why does an LRU cache need two structures?', options: ['Map for lookup, list for order', 'Queue for sorting, tree for hashing', 'Only to increase memory'], answer: 0, explanation: 'The map answers where; the linked list answers which item is oldest.' }, { kind: 'recall', prompt: 'Which item is evicted when an LRU cache is full?', answer: 'The item that has gone unused for the longest time.', explanation: 'The tail of the recency list represents the least recent item.' }], related: ['hash-maps', 'linked-lists', 'dynamic-programming'] }),
  topic({ id: 'sorting', title: 'Sorting', category: 'Algorithms', description: 'Reorder values so later work can exploit order.', diagram: 'sorting', complexity: [{ operation: 'Comparison lower bound', average: 'Ω(n log n)' }, { operation: 'Merge sort', average: 'O(n log n)' }, { operation: 'Simple sorts', average: 'O(n²)' }, { operation: 'Stability', average: 'depends' }], operations: [{ label: 'Compare pair', complexity: 'O(1)', explanation: 'Inspect two values and decide their relative order.', visualStep: 1 }, { label: 'Place next value', complexity: 'O(n)', explanation: 'Insert a value into an already ordered prefix.', visualStep: 2 }, { label: 'Merge halves', complexity: 'O(n)', explanation: 'Combine two ordered runs in one linear pass.', visualStep: 3 }], examples: { javascript: `const values = [7, 3, 6, 2, 5];\nvalues.sort((a, b) => a - b);\nconsole.log(values.join(' → '));`, python: `values = [7, 3, 6, 2, 5]\nvalues.sort()\nprint(' → '.join(map(str, values)))` }, quiz: [{ kind: 'choice', prompt: 'What question should you ask before choosing a sort?', options: ['Do stability, memory, and constraints matter?', 'Can I avoid comparing anything?', 'Is the code one line?'], answer: 0, explanation: 'Input constraints and guarantees determine the right sort.' }, { kind: 'recall', prompt: 'Why can sorting simplify duplicate detection?', answer: 'Equal values become adjacent after the order is established.', explanation: 'A single neighboring comparison can then reveal duplicates.' }], related: ['arrays', 'binary-search', 'big-o'] }),
  topic({ id: 'binary-search', title: 'Binary Search', category: 'Algorithms', description: 'Halve a sorted or monotonic search space after each comparison.', diagram: 'binary-search', complexity: [{ operation: 'Search', average: 'O(log n)' }, { operation: 'Midpoint', average: 'O(1)' }, { operation: 'Pre-sort', average: 'O(n log n)' }, { operation: 'Iterative space', average: 'O(1)' }], operations: [{ label: 'Check midpoint', complexity: 'O(1)', explanation: 'One comparison identifies the possible half.', visualStep: 1 }, { label: 'Discard half', complexity: 'O(1)', explanation: 'Move the boundary without scanning rejected values.', visualStep: 2 }, { label: 'Repeat', complexity: 'O(log n)', explanation: 'The interval shrinks by a constant fraction each round.', visualStep: 3 }], examples: { javascript: `function search(values, target) {\n  let lo = 0, hi = values.length - 1;\n  while (lo <= hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n    if (values[mid] === target) return mid;\n    if (values[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\nconsole.log(search([4, 9, 15, 22, 31], 22));`, python: `def search(values, target):\n    lo, hi = 0, len(values) - 1\n    while lo <= hi:\n        mid = lo + (hi - lo) // 2\n        if values[mid] == target: return mid\n        if values[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1\n\nprint(search([4, 9, 15, 22, 31], 22))` }, quiz: [{ kind: 'choice', prompt: 'What must be true for ordinary binary search?', options: ['The search space is ordered or monotonic', 'Every value is unique', 'The input is a linked list'], answer: 0, explanation: 'The discard decision depends on order or a monotonic predicate.' }, { kind: 'recall', prompt: 'What is the loop invariant?', answer: 'If the target exists, it remains inside the current interval.', explanation: 'Every boundary update must preserve that claim.' }], related: ['arrays', 'sorting', 'binary-search-trees'] }),
  topic({ id: 'recursion', title: 'Recursion', category: 'Algorithms', description: 'A function solves a smaller instance and returns through the call stack.', diagram: 'recursion', complexity: [{ operation: 'Depth', average: 'O(n)*' }, { operation: 'One call', average: 'O(1)' }, { operation: 'Stack space', average: 'O(depth)' }, { operation: 'Memoized', average: 'varies' }], operations: [{ label: 'Call smaller', complexity: 'O(1)', explanation: 'Create a new frame with a smaller argument.', visualStep: 1 }, { label: 'Hit base case', complexity: 'O(1)', explanation: 'Return a known result and stop descending.', visualStep: 2 }, { label: 'Unwind', complexity: 'O(depth)', explanation: 'Waiting frames resume and combine answers.', visualStep: 3 }], examples: { javascript: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(4));`, python: `def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))` }, quiz: [{ kind: 'choice', prompt: 'What two parts must a recursive function have?', options: ['Base case and progress toward it', 'A queue and a hash', 'A sorted input and a pivot'], answer: 0, explanation: 'Without a stopping case or progress, recursion can be infinite.' }, { kind: 'recall', prompt: 'What does the call stack remember?', answer: 'Each waiting call’s local state and where execution should resume.', explanation: 'That is why recursive code can return in reverse order.' }], related: ['stacks', 'backtracking', 'dynamic-programming'] }),
  topic({ id: 'backtracking', title: 'Backtracking', category: 'Algorithms', description: 'Depth-first choice exploration with explicit undo and pruning.', diagram: 'backtracking', complexity: [{ operation: 'Worst case', average: 'exponential' }, { operation: 'Choose', average: 'O(1)' }, { operation: 'Prune', average: 'problem-dependent' }, { operation: 'Depth', average: 'O(decisions)' }], operations: [{ label: 'Choose', complexity: 'O(1)', explanation: 'Add one candidate to the partial solution.', visualStep: 1 }, { label: 'Prune', complexity: 'varies', explanation: 'Stop a branch when a constraint is already broken.', visualStep: 2 }, { label: 'Undo', complexity: 'O(1)', explanation: 'Restore state before exploring the sibling branch.', visualStep: 3 }], examples: { javascript: `function subsets(values) {\n  const out = [], path = [];\n  function visit(i) {\n    if (i === values.length) { out.push([...path]); return; }\n    visit(i + 1); path.push(values[i]); visit(i + 1); path.pop();\n  }\n  visit(0); return out;\n}\nconsole.log(subsets(['A', 'B']));`, python: `def subsets(values):\n    out, path = [], []\n    def visit(i):\n        if i == len(values): out.append(path[:]); return\n        visit(i + 1)\n        path.append(values[i]); visit(i + 1); path.pop()\n    visit(0)\n    return out\n\nprint(subsets(['A', 'B']))` }, quiz: [{ kind: 'choice', prompt: 'Why is the undo step essential?', options: ['It prevents one branch’s state leaking into the next', 'It sorts the candidates', 'It makes every branch constant time'], answer: 0, explanation: 'Backtracking reuses mutable state while exploring siblings.' }, { kind: 'recall', prompt: 'What makes pruning correct?', answer: 'A valid constraint proves that no completion of the current branch can work.', explanation: 'Guessing that a branch is bad can silently lose solutions.' }], related: ['recursion', 'stacks', 'dynamic-programming'] }),
  topic({ id: 'greedy-algorithms', title: 'Greedy Algorithms', category: 'Algorithms', description: 'Commit to a locally safe choice when a proof supports global optimality.', diagram: 'greedy', complexity: [{ operation: 'Sort choices', average: 'O(n log n)' }, { operation: 'Scan', average: 'O(n)' }, { operation: 'Optimal?', average: 'must prove' }, { operation: 'Space', average: 'varies' }], operations: [{ label: 'Rank choices', complexity: 'O(n log n)', explanation: 'Sort or prioritize candidates by the greedy key.', visualStep: 1 }, { label: 'Take safe choice', complexity: 'O(1)', explanation: 'Commit to the best candidate that preserves feasibility.', visualStep: 2 }, { label: 'Exchange proof', complexity: 'reasoning', explanation: 'Show an optimal solution can adopt the same choice.', visualStep: 3 }], examples: { javascript: `const activities = [{ start: 1, end: 3 }, { start: 2, end: 4 }, { start: 3, end: 5 }];\nactivities.sort((a, b) => a.end - b.end);\nconsole.log(activities[0]);`, python: `activities = [(1, 3), (2, 4), (3, 5)]\nactivities.sort(key=lambda item: item[1])\nprint(activities[0])` }, quiz: [{ kind: 'choice', prompt: 'What is the extra responsibility in a greedy solution?', options: ['Prove the local choice is safe', 'Avoid all sorting', 'Use recursion'], answer: 0, explanation: 'A plausible local choice is not enough without a correctness argument.' }, { kind: 'recall', prompt: 'Name a proof idea used for greedy algorithms.', answer: 'An exchange argument or a cut property.', explanation: 'Both show how a local choice can be part of an optimal solution.' }], related: ['sorting', 'heaps', 'dynamic-programming'] }),
  topic({ id: 'dynamic-programming', title: 'Dynamic Programming', category: 'Algorithms', description: 'Solve overlapping subproblems once and reuse their states.', diagram: 'dynamic-programming', complexity: [{ operation: 'States', average: 'count them' }, { operation: 'Transition', average: 'per state' }, { operation: 'Time', average: 'states × work' }, { operation: 'Space', average: 'table or compressed' }], operations: [{ label: 'Define state', complexity: 'reasoning', explanation: 'Choose the smallest information that determines the remaining answer.', visualStep: 1 }, { label: 'Reuse state', complexity: 'O(1)*', explanation: 'Read a subproblem that has already been solved.', visualStep: 2 }, { label: 'Fill table', complexity: 'states × transition', explanation: 'Compute each state once in dependency order.', visualStep: 3 }], examples: { javascript: `function fib(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];\n  return dp[n];\n}\nconsole.log(fib(8));`, python: `def fib(n):\n    dp = [0, 1]\n    for i in range(2, n + 1): dp.append(dp[-1] + dp[-2])\n    return dp[n]\n\nprint(fib(8))` }, quiz: [{ kind: 'choice', prompt: 'What signals a dynamic-programming candidate?', options: ['Overlapping subproblems and optimal substructure', 'Only sorted input', 'A single loop with no state'], answer: 0, explanation: 'DP stores answers when a recursive search would repeat the same state.' }, { kind: 'recall', prompt: 'What should you define before writing a DP transition?', answer: 'The meaning of one state or table cell.', explanation: 'A clear state makes transitions and base cases checkable.' }], related: ['recursion', 'greedy-algorithms', 'lru-cache'] }),
  topic({ id: 'big-o', title: 'Big O Analysis', category: 'Algorithms', description: 'Describe how time and space grow as input size grows.', diagram: 'big-o', complexity: [{ operation: 'Constant', average: 'O(1)' }, { operation: 'Logarithmic', average: 'O(log n)' }, { operation: 'Linear', average: 'O(n)' }, { operation: 'Quadratic', average: 'O(n²)' }], operations: [{ label: 'Count a loop', complexity: 'O(n)', explanation: 'One pass grows in proportion to the input.', visualStep: 1 }, { label: 'Nest loops', complexity: 'O(n²)', explanation: 'Each outer item triggers a full inner pass.', visualStep: 2 }, { label: 'Halve range', complexity: 'O(log n)', explanation: 'Each step removes a constant fraction of candidates.', visualStep: 3 }], examples: { javascript: `function hasDuplicate(values) {\n  const seen = new Set();\n  for (const value of values) {\n    if (seen.has(value)) return true;\n    seen.add(value);\n  }\n  return false;\n}\nconsole.log(hasDuplicate([3, 1, 3]));`, python: `def has_duplicate(values):\n    seen = set()\n    for value in values:\n        if value in seen: return True\n        seen.add(value)\n    return False\n\nprint(has_duplicate([3, 1, 3]))` }, quiz: [{ kind: 'choice', prompt: 'What usually happens to sequential Big O costs?', options: ['Add them and keep the dominant term', 'Multiply every block', 'Ignore the input size'], answer: 0, explanation: 'Sequential blocks add; the fastest-growing term dominates.' }, { kind: 'recall', prompt: 'What should you name when stating Big O?', answer: 'The input variable, resource, and case or assumptions.', explanation: 'For example: O(n) time and O(n) auxiliary space in the average case.' }], related: ['sorting', 'binary-search', 'dynamic-programming'] }),
];

export const topicMap = new Map(topics.map((item) => [item.id, item]));

export function getComplexityClasses(topic: TopicMetadata): ComplexityClass[] {
  const found = new Set<ComplexityClass>();

  const averages = [
    ...topic.complexity.map(({ average }) => average),
    ...topic.complexityProfile.map(({ average }) => average.value),
  ];

  averages.forEach((average) => {
    const normalized = average.replaceAll('~', '');
    if (normalized.includes('O(n log n)')) found.add('O(n log n)');
    else if (normalized.includes('O(log n)')) found.add('O(log n)');
    else if (normalized.includes('O(n²)') || normalized.includes('O(n^2)')) found.add('O(n²)');
    else if (normalized.includes('O(2ⁿ)') || normalized.includes('O(2^n)')) found.add('O(2ⁿ)');
    else if (normalized.includes('O(V + E)')) found.add('O(V + E)');
    else if (normalized.includes('O(n)')) found.add('O(n)');
    else if (normalized.includes('O(1)')) found.add('O(1)');
    else found.add('Other');
  });

  return complexityClasses.filter((complexityClass) => found.has(complexityClass));
}

export function getTopic(id: TopicId): TopicMetadata {
  const value = topicMap.get(id);
  if (!value) throw new Error(`Unknown topic: ${id}`);
  return value;
}

export function topicUrl(id: TopicId): string {
  return `/docs/${getTopic(id).category === 'Algorithms' ? 'algorithms' : 'data-structures'}/${id}`;
}
