import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Algo Atlas — Data Structures & Algorithms',
    template: '%s | Algo Atlas',
  },
  description: 'A visual, university-level field guide for data structures, algorithms, complexity, and interviews.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><RootProvider theme={{ enabled: false }}>{children}</RootProvider></body></html>;
}
