'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SearchPageTreeEntry } from '@/lib/search-page-tree';

const SearchPageTreeContext = createContext<readonly SearchPageTreeEntry[]>([]);

export function SearchPageTreeProvider({ pages, children }: { pages: readonly SearchPageTreeEntry[]; children: ReactNode }) {
  return <SearchPageTreeContext.Provider value={pages}>{children}</SearchPageTreeContext.Provider>;
}

export function useSearchPageTree(): readonly SearchPageTreeEntry[] {
  return useContext(SearchPageTreeContext);
}
