import { useEffect } from 'react';

export interface SEOOptions {
  title?: string;
  canonical?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

/**
 * useSEO — injects per-page JSON-LD structured data into <head>
 * and updates <link rel="canonical"> for GEO & SEO.
 */
export function useSEO({ title, canonical, schema }: SEOOptions) {
  useEffect(() => {
    // ── Title ────────────────────────────────────────────────────
    if (title) {
      document.title = title;
    }

    // ── Canonical ────────────────────────────────────────────────
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl && canonical) {
      canonicalEl.setAttribute('href', canonical);
    }

    // ── JSON-LD ──────────────────────────────────────────────────
    if (!schema) return;

    const schemas = Array.isArray(schema) ? schema : [schema];
    const injected: HTMLScriptElement[] = [];

    schemas.forEach((s) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-page-schema', 'true');
      el.textContent = JSON.stringify(s);
      document.head.appendChild(el);
      injected.push(el);
    });

    // Cleanup when route changes
    return () => {
      if (title) {
        document.title = 'Fuenzer Sports | AI-Driven Tournament Simulator'; // Fallback default
      }
      injected.forEach((el) => el.remove());
      // Restore canonical to root when leaving a sub-page
      if (canonicalEl) {
        canonicalEl.setAttribute('href', 'https://sports.fuenzer.web.id/');
      }
    };
  }, [title, canonical, schema]);
}
