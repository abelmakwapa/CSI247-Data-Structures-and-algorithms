import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { AccessibilityEnhancements } from '@/components/a11y/AccessibilityEnhancements';
import { OfflineStatus } from '@/components/offline/OfflineStatus';
import { AtlasSearchDialog } from '@/components/search/AtlasSearchDialog';
import { SearchPageTreeProvider } from '@/components/search/SearchPageTreeProvider';
import { getSearchPageTreeEntries } from '@/lib/search-page-tree';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Algo Atlas — Data Structures & Algorithms',
    template: '%s | Algo Atlas',
  },
  description: 'A visual, university-level field guide for data structures, algorithms, complexity, and interviews.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const searchPages = getSearchPageTreeEntries();

  return <html lang="en" data-scroll-behavior="smooth"><body><SearchPageTreeProvider pages={searchPages}><RootProvider search={{ SearchDialog: AtlasSearchDialog }} theme={{ enabled: false }}><AccessibilityEnhancements /><OfflineStatus />{children}</RootProvider></SearchPageTreeProvider></body></html>;
}
