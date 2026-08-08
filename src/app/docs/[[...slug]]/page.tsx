import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { getMDXComponents } from '@/mdx-components';
import { source } from '@/lib/source';

export default async function DocsPageRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const MDX = page.data.body;

  return <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }}><DocsBody><MDX components={getMDXComponents()} /></DocsBody></DocsPage>;
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
}
