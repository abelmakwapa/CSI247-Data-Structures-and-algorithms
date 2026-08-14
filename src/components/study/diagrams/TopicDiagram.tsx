'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { DiagramKind, TopicId, TopicMetadata } from '@/lib/topics';
import { getTopic } from '@/lib/topics';

const EXPORT_STYLES = `
.atlas-label{font:12px ui-monospace,monospace;fill:#24324a}.atlas-muted{font:11px ui-monospace,monospace;fill:#65748a}.atlas-node{fill:#fff;stroke:#526b88;stroke-width:1.6}.atlas-node-focus{fill:#edfff5;stroke:#1e7a4a;stroke-width:2}.atlas-accent{fill:#1e7a4a}.atlas-blue{fill:#2563a8}.atlas-line{stroke:#526b88;stroke-width:1.8;fill:none}.atlas-dash{stroke:#c8973a;stroke-width:2;stroke-dasharray:5 5;fill:none;animation:atlasDash 1.8s linear infinite}.atlas-focus{fill:rgba(200,151,58,.12);stroke:#c8973a;stroke-width:2;stroke-dasharray:5 4}.atlas-step{font:700 11px ui-monospace,monospace;fill:#fff}.atlas-step-bg{fill:#0d1b2e}.atlas-callout{font:11px ui-monospace,monospace;fill:#0d1b2e}@keyframes atlasDash{to{stroke-dashoffset:-20}}
`;

interface DiagramStep {
  caption: string;
  complexity?: string;
  label: string;
}

function getDiagramSteps(topic: TopicMetadata): DiagramStep[] {
  return [
    { label: 'Orient', caption: topic.description },
    ...topic.operations.map((operation) => ({ label: operation.label, caption: operation.explanation, complexity: operation.complexity })),
  ];
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

function focus(step: number, expected: number): string {
  return step === expected ? ' atlas-node-focus' : ' atlas-node';
}

function Line({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={dashed ? 'atlas-dash' : 'atlas-line'} markerEnd={dashed ? 'url(#atlas-arrow)' : undefined} />;
}

function Box({ x, y, width = 72, height = 44, label, active = false, muted = false }: { x: number; y: number; width?: number; height?: number; label: string; active?: boolean; muted?: boolean }) {
  return <g opacity={muted ? 0.38 : 1}><rect x={x} y={y} width={width} height={height} rx={6} className={active ? 'atlas-node-focus' : 'atlas-node'} /><text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle" className={active ? 'atlas-accent atlas-label' : 'atlas-label'}>{label}</text></g>;
}

function DiagramContent({ kind, step }: { kind: DiagramKind; step: number }) {
  switch (kind) {
    case 'array':
      return <><text x="20" y="24" className="atlas-muted">CONTIGUOUS MEMORY · INDEXED SLOTS</text>{[10, 24, 31, 48, 57, 63].map((value, index) => <g key={value}><Box x={30 + index * 90} y={72} label={String(value)} active={(step === 1 && index === 2) || (step === 2 && index >= 2) || (step === 3 && index >= 4)} muted={step === 3 && index === 4} /><text x={66 + index * 90} y="137" textAnchor="middle" className={(step === 1 && index === 2) || (step === 2 && index >= 2) || (step === 3 && index >= 4) ? 'atlas-accent atlas-label' : 'atlas-muted'}>{index}</text></g>)}<Line x1={255} y1={158} x2={255} y2={202} dashed={step > 0} /><text x="275" y="198" className="atlas-accent atlas-label">base + index × slot</text></>;
    case 'chain':
      return <><text x="20" y="24" className="atlas-muted">NODES CAN LIVE ANYWHERE · POINTERS KEEP ORDER</text>{['A', 'B', 'C', 'D'].map((label, index) => <g key={label}><Box x={34 + index * 138} y={80} label={label} active={(step === 1 && index <= 2) || (step === 2 && index === 1) || (step === 3 && index === 2)} /><Line x1={106 + index * 138} y1={102} x2={164 + index * 138} y2={102} dashed={step > 0} /></g>)}<text x="34" y="160" className="atlas-muted">head</text><text x="440" y="160" className="atlas-muted">tail</text></>;
    case 'stack':
      return <><text x="20" y="24" className="atlas-muted">TOP ONLY · LAST IN, FIRST OUT</text>{['10', '8', '3'].map((label, index) => <Box key={label} x={218} y={58 + index * 50} width={150} label={label} active={(step === 1 && index === 0) || (step === 2 && index === 1) || step === 3} muted={step === 2 && index === 0} />)}<Line x1={390} y1={80} x2={470} y2={80} dashed={step > 0} /><text x="402" y="70" className="atlas-accent atlas-label">top boundary</text><text x="207" y="222" className="atlas-muted">push and pop share one boundary</text></>;
    case 'queue':
      return <><text x="20" y="24" className="atlas-muted">FIFO · FRONT SERVES · REAR ARRIVES</text>{['A', 'B', 'C', 'D'].map((label, index) => <Box key={label} x={72 + index * 110} y={82} label={label} active={(step === 1 && index === 3) || (step === 2 && index === 0) || step === 3} muted={(step === 2 || step === 3) && index === 0} />)}<Line x1={30} y1={104} x2={64} y2={104} dashed={step === 2 || step === 3} /><Line x1={520} y1={104} x2={584} y2={104} dashed={step === 1} /><text x="24" y="154" className="atlas-muted">dequeue / shift</text><text x="520" y="154" className="atlas-muted">enqueue</text></>;
    case 'deque':
      return <><text x="20" y="24" className="atlas-muted">TWO LIVE ENDS · BOTH BOUNDARIES ARE ACTIONABLE</text>{['A', 'B', 'C', 'D'].map((label, index) => <Box key={label} x={100 + index * 105} y={86} label={label} active={(step === 1 && index === 0) || (step === 2 && index === 3) || (step === 3 && (index === 1 || index === 2))} />)}<Line x1={78} y1={108} x2={40} y2={108} dashed={step === 1} /><Line x1={522} y1={108} x2={580} y2={108} dashed={step === 2} /><text x="28" y="158" className="atlas-accent atlas-label">front</text><text x="518" y="158" className="atlas-accent atlas-label">back</text></>;
    case 'hash-map':
      return <><text x="20" y="24" className="atlas-muted">KEY → HASH → BUCKET → VALUE</text><Box x={26} y={82} width={124} label="'Mom'" active={step === 1} /><Line x1={154} y1={104} x2={218} y2={104} dashed={step === 1} /><Box x={222} y={82} width={130} label="hash = 4827" active={step === 2} />{[0, 1, 2, 3].map((row) => <Box key={row} x={420} y={44 + row * 38} width={158} height={28} label={row === 2 ? 'Mom → 555' : 'empty'} active={step === 3 && row === 2} />)}<Line x1={356} y1={104} x2={414} y2={104} dashed={step === 3} /></>;
    case 'set':
      return <><text x="20" y="24" className="atlas-muted">MEMBERSHIP · UNIQUE KEYS ONLY</text>{['Ada', 'Linus', step === 3 ? 'Ada' : 'Grace', 'Ken'].map((label, index) => <Box key={`${label}-${index}`} x={34 + index * 138} y={76} width={116} label={label} active={(step === 1 && index === 1) || (step === 2 && index === 2) || (step === 3 && (index === 0 || index === 2))} muted={step === 3 && index === 2} />)}<rect x="160" y="162" width="190" height="30" rx="5" className="atlas-node-focus" /><text x="255" y="182" textAnchor="middle" className="atlas-accent atlas-label">{step === 3 ? 'duplicate rejected' : 'membership check ✓'}</text><Line x1={218} y1={134} x2={234} y2={158} dashed={step > 0} /></>;
    case 'tree':
    case 'bst': {
      const nodes: Array<[string, number, number]> = kind === 'bst' ? [['25', 170, 140], ['75', 450, 140], ['10', 100, 185], ['30', 240, 185], ['60', 380, 185], ['90', 520, 185]] : [['docs', 170, 140], ['media', 450, 140], ['readme', 100, 185], ['notes', 240, 185], ['photos', 380, 185], ['video', 520, 185]];
      return <><text x="20" y="24" className="atlas-muted">{kind === 'bst' ? 'ORDER DISCARDS A SUBTREE' : 'PARENT → CHILD → LEAF'}</text><Line x1={310} y1={70} x2={310} y2={108} dashed={step === 1} /><Line x1={310} y1={108} x2={170} y2={154} dashed={step === 2} /><Line x1={310} y1={108} x2={450} y2={154} dashed={step === 3} /><Line x1={170} y1={154} x2={100} y2={198} /><Line x1={170} y1={154} x2={240} y2={198} /><Line x1={450} y1={154} x2={380} y2={198} /><Line x1={450} y1={154} x2={520} y2={198} /><circle cx="310" cy="54" r="24" className={focus(step, 1)} /><text x="310" y="58" textAnchor="middle" className="atlas-label">{kind === 'bst' ? '50' : 'root'}</text>{nodes.map(([label, x, y], index) => <g key={label} opacity={step === 2 && index > 1 ? .35 : 1}><circle cx={x} cy={y} r="22" className={(step === 2 && index === 0) || (step === 3 && (index === 1 || index === 4 || index === 5)) ? 'atlas-node-focus' : 'atlas-node'} /><text x={x} y={y + 4} textAnchor="middle" className="atlas-label">{label}</text></g>)}</>;
    }
    case 'heap':
      return <><text x="20" y="24" className="atlas-muted">COMPLETE SHAPE · PRIORITY AT ROOT</text><Line x1={310} y1={70} x2={310} y2={110} dashed={step === 3} /><Line x1={310} y1={110} x2={180} y2={155} dashed={step === 2 || step === 3} /><Line x1={310} y1={110} x2={440} y2={155} /><Line x1={180} y1={155} x2={115} y2={198} /><Line x1={180} y1={155} x2={245} y2={198} /><circle cx="310" cy="54" r="25" className={step === 1 || step === 3 ? 'atlas-node-focus' : 'atlas-node'} /><text x="310" y="58" textAnchor="middle" className="atlas-accent atlas-label">100</text>{[['80', 180, 140], ['65', 440, 140], ['30', 115, 185], ['20', 245, 185]].map(([label, x, y], index) => <g key={String(label)}><circle cx={Number(x)} cy={Number(y)} r="21" className={(step === 2 && index === 0) || (step === 3 && index < 2) ? 'atlas-node-focus' : 'atlas-node'} /><text x={Number(x)} y={Number(y) + 4} textAnchor="middle" className="atlas-label">{label}</text></g>)}</>;
    case 'graph':
      return <><text x="20" y="24" className="atlas-muted">RELATIONSHIPS · CYCLES ARE NORMAL</text><Line x1={150} y1={92} x2={310} y2={58} dashed={step === 1 || step === 3} /><Line x1={310} y1={58} x2={478} y2={92} dashed={step === 2} /><Line x1={150} y1={92} x2={198} y2={184} dashed={step === 1} /><Line x1={198} y1={184} x2={388} y2={184} /><Line x1={388} y1={184} x2={478} y2={92} dashed={step === 3} /><Line x1={310} y1={58} x2={388} y2={184} dashed={step === 3} />{[['A', 150, 92], ['B', 310, 58], ['C', 478, 92], ['D', 198, 184], ['E', 388, 184]].map(([label, x, y], index) => <g key={String(label)} opacity={step === 2 && ![1, 2].includes(index) ? .35 : 1}><circle cx={Number(x)} cy={Number(y)} r="26" className={(step === 1 && [0, 1, 3].includes(index)) || (step === 2 && [1, 2].includes(index)) || (step === 3 && [0, 1, 4].includes(index)) ? 'atlas-node-focus' : 'atlas-node'} /><text x={Number(x)} y={Number(y) + 4} textAnchor="middle" className="atlas-label">{label}</text></g>)}<Line x1={118} y1={92} x2={82} y2={92} dashed={step === 1} /></>;
    case 'trie':
      return <><text x="20" y="24" className="atlas-muted">SHARED PREFIXES · ONE EDGE PER CHARACTER</text><Line x1={310} y1={66} x2={210} y2={108} dashed={step > 0} /><Line x1={310} y1={66} x2={410} y2={108} /><Line x1={210} y1={108} x2={150} y2={160} dashed={step === 1 || step === 2 || step === 3} /><Line x1={210} y1={108} x2={270} y2={160} dashed={step === 2} /><Line x1={410} y1={108} x2={350} y2={160} /><Line x1={410} y1={108} x2={470} y2={160} />{[['∅', 310, 52], ['a', 210, 98], ['b', 410, 98], ['p', 150, 150], ['d', 270, 150], ['t', 350, 150], ['y', 470, 150]].map(([label, x, y], index) => <g key={String(label)} opacity={step === 3 && index === 3 ? .38 : 1}><circle cx={Number(x)} cy={Number(y)} r="22" className={(step === 1 && [0, 1, 3].includes(index)) || (step === 2 && [1, 3, 4].includes(index)) || (step === 3 && [0, 1, 3].includes(index)) ? 'atlas-node-focus' : 'atlas-node'} /><text x={Number(x)} y={Number(y) + 4} textAnchor="middle" className="atlas-label">{label}</text></g>)}<text x="116" y="208" className={step === 3 ? 'atlas-accent atlas-label' : 'atlas-muted'}>{step === 3 ? 'app terminal removed' : 'app'}</text><text x="238" y="208" className="atlas-muted">add</text></>;
    case 'dsu':
      return <><text x="20" y="24" className="atlas-muted">PARENT LINKS · COMPONENT REPRESENTATIVES</text><Line x1={120} y1={90} x2={260} y2={90} dashed={step === 2} /><Line x1={260} y1={90} x2={400} y2={90} dashed={step === 3} />{[['A', 120], ['B', 260], ['C', 400], ['D', 120], ['E', 260], ['F', 400]].map(([label, x], index) => <g key={String(label)}><circle cx={Number(x)} cy={index < 3 ? 90 : 175} r="24" className={step === 1 && index === 0 ? 'atlas-node-focus' : 'atlas-node'} /><text x={Number(x)} y={(index < 3 ? 90 : 175) + 4} textAnchor="middle" className="atlas-label">{label}</text></g>)}<Line x1={120} y1={114} x2={120} y2={151} dashed={step === 3} /><Line x1={400} y1={114} x2={400} y2={151} dashed={step === 3} /><text x="192" y="224" className="atlas-accent atlas-label">find → compress → union</text></>;
    case 'bloom':
      return <><text x="20" y="24" className="atlas-muted">HASHES → BITS · NO FALSE NEGATIVES</text><Box x={36} y={86} width={134} label={step === 2 ? '/missing' : '/checkout'} active={step > 0} /><Line x1={174} y1={108} x2={245} y2={108} dashed={step > 0} />{Array.from({ length: 12 }, (_, index) => <rect key={index} x={258 + index * 26} y={86} width={19} height={48} rx={3} className={(step === 1 && [1, 4, 8].includes(index)) || (step === 2 && index === 6) || (step === 3 && [1, 4, 8, 10].includes(index)) ? 'atlas-node-focus' : 'atlas-node'} />)}<text x="258" y="164" className="atlas-muted">0 1 0 0 1 0 0 0 1 0 1 0</text><text x="36" y="206" className="atlas-accent atlas-label">{step === 1 ? 'set every hash-derived bit' : step === 3 ? 'all bits are 1 → maybe present' : 'one zero bit → definitely absent'}</text></>;
    case 'lru':
      return <><text x="20" y="24" className="atlas-muted">HASH MAP FOR WHERE · LIST FOR WHEN</text><Box x={30} y={86} width={124} label="get(key)" active={step === 1} /><Line x1={158} y1={108} x2={226} y2={108} dashed={step === 1} /><Box x={230} y={86} width={120} label="map → node" active={step === 2} />{['MRU', 'A', 'B', 'LRU'].map((label, index) => <Box key={label} x={370 + index * 52} y={86} width={46} label={label} active={(step === 2 && index === 0) || (step === 3 && index === 3)} muted={step === 3 && index !== 3} />)}<Line x1={350} y1={108} x2={364} y2={108} dashed={step === 2} /><text x="190" y="172" className="atlas-accent atlas-label">touch → front · full → evict back</text></>;
    case 'sorting':
      return <><text x="20" y="24" className="atlas-muted">COMPARE → PLACE → SORTED PREFIX GROWS</text>{[7, 3, 6, 2, 5].map((value, index) => <Box key={value} x={42 + index * 102} y={150 - value * 9} width={68} height={value * 9} label={String(value)} active={(step === 1 && (index === 1 || index === 2)) || (step === 2 && index <= 2) || step === 3} muted={step === 2 && index > 2} />)}<Line x1={140} y1={96} x2={242} y2={96} dashed={step === 1 || step === 2} /><Line x1={42} y1={196} x2={518} y2={196} dashed={step === 3} /><text x="40" y="214" className="atlas-muted">{step === 3 ? 'merge two ordered runs' : 'ordered prefix'}</text></>;
    case 'binary-search':
      return <><text x="20" y="24" className="atlas-muted">TARGET 44 · KEEP ONLY THE POSSIBLE INTERVAL</text>{[4, 9, 15, 22, 31, 44, 58].map((value, index) => <Box key={value} x={34 + index * 78} y={88} width={60} label={String(value)} active={(step === 1 && index === 3) || ((step === 2 || step === 3) && index === 5)} muted={(step === 2 && index <= 3) || (step === 3 && index !== 5)} />)}<Line x1={306} y1={140} x2={514} y2={182} dashed={step === 2 || step === 3} /><text x="310" y="202" className="atlas-accent atlas-label">{step === 3 ? 'repeat until midpoint = 44' : '44 is higher than midpoint → right half'}</text></>;
    case 'recursion':
      return <><text x="20" y="24" className="atlas-muted">DEFER WORK ON THE WAY DOWN · RETURN ON THE WAY UP</text>{['fact(4)', 'fact(3)', 'fact(2)', 'fact(1)'].map((label, index) => <g key={label}><Box x={54 + index * 130} y={86} width={104} label={label} active={(step === 1 && index === 0) || (step === 2 && index === 3)} muted={step === 3 && index < 2} />{index < 3 && <Line x1={160 + index * 130} y1={108} x2={178 + index * 130} y2={108} dashed={step === 1} />}</g>)}<Line x1={472} y1={140} x2={78} y2={170} dashed={step === 3} /><text x="180" y="210" className="atlas-accent atlas-label">base case → unwind stack</text></>;
    case 'backtracking':
      return <><text x="20" y="24" className="atlas-muted">CHOOSE · EXPLORE · UNCHOOSE</text><Line x1={310} y1={70} x2={190} y2={118} /><Line x1={310} y1={70} x2={430} y2={118} /><Line x1={190} y1={118} x2={120} y2={180} /><Line x1={190} y1={118} x2={260} y2={180} /><circle cx="310" cy="54" r="22" className="atlas-node-focus" /><text x="310" y="58" textAnchor="middle" className="atlas-label">start</text><circle cx="190" cy="106" r="21" className={step === 1 ? 'atlas-node-focus' : 'atlas-node'} /><text x="190" y="110" textAnchor="middle" className="atlas-label">A</text><circle cx="430" cy="106" r="21" className="atlas-node" /><text x="430" y="110" textAnchor="middle" className="atlas-label">B</text><circle cx="120" cy="168" r="19" className="atlas-node" /><text x="120" y="172" textAnchor="middle" className="atlas-label">dead</text><circle cx="260" cy="168" r="19" className={step === 2 ? 'atlas-node-focus' : 'atlas-node'} /><text x="260" y="172" textAnchor="middle" className="atlas-label">✓</text><Line x1={260} y1={188} x2={190} y2={132} dashed={step === 3} /><text x="326" y="204" className="atlas-accent atlas-label">undo before sibling</text></>;
    case 'greedy':
      return <><text x="20" y="24" className="atlas-muted">TAKE THE BEST SAFE NEXT CHOICE</text>{[['$10', 1], ['$6', 0], ['$5', 0], ['$1', 0]].map(([label, active], index) => <Box key={String(label)} x={40 + index * 122} y={88} width={92} label={String(label)} active={(step === 1 && Boolean(active)) || (step === 2 && index === 0) || (step === 3 && index < 2)} muted={step === 2 && !Boolean(active)} />)}<Line x1={84} y1={146} x2={84} y2={188} dashed={step === 2} /><Line x1={84} y1={188} x2={206} y2={146} dashed={step === 3} /><text x="110" y="194" className="atlas-accent atlas-label">{step === 3 ? 'exchange keeps value without breaking feasibility' : 'commit only when feasible'}</text></>;
    case 'dynamic-programming':
      return <><text x="20" y="24" className="atlas-muted">STATE TABLE · EACH ANSWER IS REUSED</text>{[0, 1, 2, 3, 4, 5].map((value) => <Box key={value} x={60 + value * 82} y={92} width={62} label={`dp[${value}]`} active={(step === 1 && value < 2) || (step === 2 && value === 3) || (step === 3 && value <= 5)} muted={step === 2 && value > 3} />)}<Line x1={190} y1={148} x2={390} y2={148} dashed={step === 2 || step === 3} /><text x="90" y="194" className="atlas-accent atlas-label">base cases → transition → final state</text></>;
    case 'big-o':
      return <><text x="20" y="24" className="atlas-muted">GROWTH RATE · SAME INPUT, DIFFERENT CURVES</text><Line x1={76} y1={204} x2={76} y2={52} /><Line x1={76} y1={204} x2={570} y2={204} /><path d="M76 188 C220 188 390 183 560 176" className={step === 1 ? 'atlas-dash' : 'atlas-line'} /><path d="M76 188 C220 180 390 145 560 86" className={step === 2 ? 'atlas-dash' : 'atlas-line'} /><path d="M76 188 C180 184 300 120 560 46" className={step === 3 ? 'atlas-dash' : 'atlas-line'} /><text x="500" y="180" className="atlas-muted">O(log n)</text><text x="500" y="90" className="atlas-blue atlas-label">O(n)</text><text x="500" y="50" className="atlas-accent atlas-label">O(n²)</text><text x="28" y="56" className="atlas-muted">work</text><text x="520" y="224" className="atlas-muted">input n</text></>;
  }
}

export function TopicDiagram({ topicId }: { topicId: TopicId }) {
  const topic = getTopic(topicId);
  const steps = getDiagramSteps(topic);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const titleId = `${topicId}-diagram-title`;
  const svgTitleId = `${topicId}-svg-title`;
  const svgDescriptionId = `${topicId}-svg-description`;
  const activeStep = steps[step];
  const svgTitle = `${topic.title} visual explainer: ${activeStep.label}`;
  const svgDescription = `Step ${step + 1} of ${steps.length}. ${activeStep.caption}${activeStep.complexity ? ` Complexity: ${activeStep.complexity}.` : ''}`;

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((value) => value === steps.length - 1 ? 0 : value + 1);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, steps.length]);

  function moveTo(nextStep: number) {
    setStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
  }

  function reset() {
    setPlaying(false);
    setStep(0);
  }

  function prepareSvgExport(event: MouseEvent<HTMLAnchorElement>) {
    if (!svgRef.current) {
      event.preventDefault();
      return;
    }
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '620');
    clone.setAttribute('height', '250');
    clone.setAttribute('aria-labelledby', `${svgTitleId} ${svgDescriptionId}`);
    clone.setAttribute('data-exported-step', String(step + 1));
    const source = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
    event.currentTarget.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  }

  return (
    <figure className="diagram-panel academic-panel panel-definition" aria-labelledby={titleId}>
      <div className="diagram-head"><div><div className="panel-kicker">Visual explainer</div><h2 id={titleId}>{topic.title}: operation trace</h2></div><a className="text-button" href="#" download={`${topicId}-explainer.svg`} onClick={prepareSvgExport}>Export SVG</a></div>
      <div className="diagram-canvas"><svg ref={svgRef} viewBox="0 0 620 250" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby={`${svgTitleId} ${svgDescriptionId}`} data-topic={topicId} data-step={step + 1} className={playing && !reducedMotion ? 'is-playing' : undefined}><style>{EXPORT_STYLES}</style><title id={svgTitleId}>{svgTitle}</title><desc id={svgDescriptionId}>{svgDescription}</desc><defs><marker id="atlas-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L0 6 L7 3Z" fill="#c8973a" /></marker></defs><rect width="620" height="250" fill="#ffffff" /><DiagramContent kind={topic.diagram} step={step} /><g transform="translate(20 220)"><rect width="24" height="20" rx="4" className="atlas-step-bg" /><text x="12" y="14" textAnchor="middle" className="atlas-step">{step + 1}</text><text x="34" y="14" className="atlas-callout">Step {step + 1} of {steps.length} · {activeStep.label}{activeStep.complexity ? ` · ${activeStep.complexity}` : ''}</text></g></svg></div>
      <figcaption aria-live="polite" aria-atomic="true"><div className="diagram-step-header"><strong>{activeStep.label}</strong><span>{step + 1} / {steps.length}{activeStep.complexity ? ` · ${activeStep.complexity}` : ''}</span></div><p>{activeStep.caption}</p><DiagramControls step={step} steps={steps} playing={playing} reducedMotion={reducedMotion} onMove={moveTo} onPlayingChange={setPlaying} onReset={reset} /></figcaption>
      <details className="diagram-text-alternative"><summary>Text alternative for all steps</summary><ol>{steps.map((item, index) => <li key={item.label}><strong>Step {index + 1}: {item.label}{item.complexity ? ` (${item.complexity})` : ''}.</strong> {item.caption}</li>)}</ol></details>
    </figure>
  );
}

interface DiagramControlsProps {
  onMove: (step: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onReset: () => void;
  playing: boolean;
  reducedMotion: boolean;
  step: number;
  steps: DiagramStep[];
}

function DiagramControls({ step, steps, playing, reducedMotion, onMove, onPlayingChange, onReset }: DiagramControlsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onMove(step - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onMove(step + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onReset();
    }
  }

  return <div className="diagram-controls" role="group" aria-label="Visual explainer controls" aria-describedby="diagram-keyboard-help" onKeyDown={handleKeyDown}><span id="diagram-keyboard-help" className="sr-only">Use Left and Right Arrow to change steps. Press Home to reset.</span><button type="button" onClick={() => onMove(step - 1)} disabled={step === 0}>← Previous</button>{steps.map((item, index) => <button key={item.label} type="button" className={`step-dot${step === index ? ' active' : ''}`} onClick={() => onMove(index)} aria-label={`Show step ${index + 1}: ${item.label}`} aria-pressed={step === index} />)}<button type="button" onClick={() => onMove(step + 1)} disabled={step === steps.length - 1}>Next →</button><span className="diagram-control-divider" aria-hidden="true" /><button type="button" onClick={() => onPlayingChange(!playing)} disabled={reducedMotion} aria-pressed={playing}>{playing ? '❚❚ Pause' : '▶ Play'}</button><button type="button" onClick={onReset} disabled={step === 0 && !playing}>↺ Reset</button>{reducedMotion && <span className="reduced-motion-note" role="status">Autoplay off: reduced motion</span>}</div>;
}
