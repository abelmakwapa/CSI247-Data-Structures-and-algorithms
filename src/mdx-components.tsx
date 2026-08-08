import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { AcademicPanel } from '@/components/ui/AcademicPanel';
import { CodeExample } from '@/components/study/CodeExample';
import { ComplexityTable } from '@/components/study/ComplexityTable';
import { OperationLab } from '@/components/study/OperationLab';
import { Quiz } from '@/components/study/Quiz';
import { RelatedTopics } from '@/components/study/RelatedTopics';
import { StudyNotes } from '@/components/study/StudyNotes';
import { TopicDiagram } from '@/components/study/diagrams/TopicDiagram';
import { TopicHero } from '@/components/study/TopicHero';

export function getMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...defaultMdxComponents,
    AcademicPanel,
    CodeExample,
    ComplexityTable,
    OperationLab,
    Quiz,
    RelatedTopics,
    StudyNotes,
    TopicDiagram,
    TopicHero,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
