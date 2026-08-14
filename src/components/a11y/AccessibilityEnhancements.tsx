'use client';

import { useEffect } from 'react';
import type { MouseEvent } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(element: HTMLElement): boolean {
  const styles = window.getComputedStyle(element);
  return styles.display !== 'none' && styles.visibility !== 'hidden' && element.getClientRects().length > 0;
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
}

function focusFirst(element: HTMLElement | null): void {
  if (!element) return;
  window.requestAnimationFrame(() => element.focus());
}

function setAttributeIfChanged(element: HTMLElement, name: string, value: string): void {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

export function AccessibilityEnhancements() {
  useEffect(() => {
    let drawerOpener: HTMLElement | null = null;
    let searchOpener: HTMLElement | null = null;
    let drawerWasOpen = false;
    let dialogWasOpen = false;

    function rememberTrigger(event: Event): void {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const searchTrigger = target.closest<HTMLElement>('[data-search], [data-search-full]');
      if (searchTrigger) searchOpener = searchTrigger;

      const drawerTrigger = target.closest<HTMLElement>('[aria-controls="nd-sidebar-mobile"]');
      if (drawerTrigger?.getAttribute('aria-expanded') === 'false') drawerOpener = drawerTrigger;
    }

    function labelNavigation(dialogIsOpen: boolean): void {
      const desktopSidebar = document.querySelector<HTMLElement>('#nd-sidebar');
      if (desktopSidebar) setAttributeIfChanged(desktopSidebar, 'aria-label', 'Documentation navigation');
      const mobileSidebar = document.querySelector<HTMLElement>('#nd-sidebar-mobile');
      if (mobileSidebar) {
        setAttributeIfChanged(mobileSidebar, 'aria-label', 'Documentation navigation');
        if (mobileSidebar.getAttribute('data-state') === 'open') {
          setAttributeIfChanged(mobileSidebar, 'role', 'dialog');
          setAttributeIfChanged(mobileSidebar, 'aria-modal', 'true');
        } else {
          mobileSidebar.removeAttribute('role');
          mobileSidebar.removeAttribute('aria-modal');
        }
      }

      document.querySelectorAll<HTMLElement>('[data-search], [data-search-full]').forEach((trigger) => {
        setAttributeIfChanged(trigger, 'aria-haspopup', 'dialog');
        setAttributeIfChanged(trigger, 'aria-expanded', String(dialogIsOpen));
        setAttributeIfChanged(trigger, 'aria-controls', 'algo-atlas-search-dialog');
      });
    }

    function syncManagedSurfaces(): void {
      const drawer = document.querySelector<HTMLElement>('#nd-sidebar-mobile[data-state="open"]');
      const drawerIsOpen = Boolean(drawer);
      if (drawerIsOpen && !drawerWasOpen && drawer) {
        const closeButton = drawer.querySelector<HTMLElement>('button[aria-label="Close Sidebar"]');
        focusFirst(closeButton);
      }
      if (!drawerIsOpen && drawerWasOpen) {
        focusFirst(drawerOpener);
        drawerOpener = null;
      }
      drawerWasOpen = drawerIsOpen;

      const dialog = document.querySelector<HTMLElement>('[role="dialog"]:not(#nd-sidebar-mobile):not([data-state="closed"])');
      const dialogIsOpen = Boolean(dialog);
      if (dialog) dialog.id = 'algo-atlas-search-dialog';
      labelNavigation(dialogIsOpen);
      if (!dialogIsOpen && dialogWasOpen) {
        focusFirst(searchOpener);
        searchOpener = null;
      }
      dialogWasOpen = dialogIsOpen;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      const drawer = document.querySelector<HTMLElement>('#nd-sidebar-mobile[data-state="open"]');
      if (drawer) {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          drawer.querySelector<HTMLElement>('button[aria-label="Close Sidebar"]')?.click();
          return;
        }

        if (event.key === 'Tab') {
          const elements = focusableElements(drawer);
          if (!elements.length) return;
          const first = elements[0];
          const last = elements[elements.length - 1];
          if (!drawer.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
          } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          return;
        }
      }

      const dialog = document.querySelector<HTMLElement>('[role="dialog"][data-state="open"]:not(#nd-sidebar-mobile)');
      if (dialog && event.key === 'Tab') {
        const elements = focusableElements(dialog);
        if (!elements.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!dialog.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    const observer = new MutationObserver(syncManagedSurfaces);
    observer.observe(document.body, { attributes: true, attributeFilter: ['aria-expanded', 'data-state'], childList: true, subtree: true });
    document.addEventListener('click', rememberTrigger, true);
    document.addEventListener('focusin', rememberTrigger, true);
    document.addEventListener('keydown', handleKeyDown, true);
    syncManagedSurfaces();

    return () => {
      observer.disconnect();
      document.removeEventListener('click', rememberTrigger, true);
      document.removeEventListener('focusin', rememberTrigger, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  function moveToMainContent(event: MouseEvent<HTMLAnchorElement>): void {
    const target = document.getElementById('main-content');
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView({ block: 'start' });
    window.history.replaceState(null, '', '#main-content');
  }

  return <a className="skip-link" href="#main-content" onClick={moveToMainContent}>Skip to main content</a>;
}
