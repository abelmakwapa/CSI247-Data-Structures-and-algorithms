import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: 'Algo Atlas', url: '/' },
    links: [
      { type: 'main', text: 'Home', url: '/' },
      { type: 'main', text: 'Review mode', url: '/review' },
    ],
    searchToggle: { enabled: true },
    themeSwitch: { enabled: false },
  };
}
