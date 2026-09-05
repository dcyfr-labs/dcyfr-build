import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/chrome/theme-provider';
import { SiteHeader, type HeaderNavItem } from '@/components/chrome/site-header';
import { SiteFooter, type FooterLink } from '@/components/chrome/site-footer';
import type { ChromeNavSection } from '@/components/chrome/nav-utils';
import { DcyfrToaster } from '@/components/ui/dcyfr-sonner';
import './globals.css';

// Named for the face, not the role. The theme engine binds <body> and headings
// to --font-body / --font-display, and the theme resolves each through a
// --font-<role>-loaded hook; globals.css points those hooks and the `font-sans`
// utility at this one variable. Naming it for the face means three roles can
// share it without any Tailwind theme key pointing at another, and swapping
// Inter out later is a one-line change here.
//
// This replaces `inter.className` on <body>. That class carries a bare
// `font-family` unlayered, which beats anything in @layer base regardless of
// source order — so leaving it would have killed the engine's type binding
// while the source still looked correct.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dcyfr.build'),
  title: 'DCYFR Build — Infrastructure Template Library',
  description: 'Battle-tested Docker, Kubernetes, and CI/CD templates with cost estimator.',
};

const DcyfrBuildLogo = (
  <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
    <span className="text-accent-600">◈</span>
    <span>
      dcyfr<span className="text-accent-600">.build</span>
    </span>
  </span>
);

// The v1 nav list minus its "/" entry: SiteHeader skips "/" because the logo is
// the home link. v2 nav items carry no `external` flag; every off-site link
// opens in the same tab.
const NAV: HeaderNavItem[] = [
  { href: '/templates', label: 'Templates' },
  { href: '/cost-estimator', label: 'Cost Estimator' },
];

// The drawer is the only place every link is reachable below `md`: the header
// link row and the footer link row are both `hidden md:flex`. Tools and
// Ecosystem are the v1 footer's two columns; Legal is its legal row, which the
// one-line v2 footer keeps on desktop and drops below `md`.
//
// No item may carry `icon`. This file is a Server Component and SiteHeader is
// 'use client', so an ElementType cannot cross the boundary.
const SECTIONS: ChromeNavSection[] = [
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { href: '/templates', label: 'Templates' },
      { href: '/cost-estimator', label: 'Cost Estimator' },
    ],
  },
  {
    id: 'ecosystem',
    label: 'Ecosystem',
    items: [
      { href: 'https://dcyfr.io', label: 'dcyfr.io' },
      { href: 'https://dcyfr.app', label: 'dcyfr.app' },
      { href: 'https://github.com/dcyfr', label: 'GitHub' },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    items: [
      { href: '/privacy', label: 'Privacy' },
      { href: 'https://dcyfr.ai/terms', label: 'Terms' },
      { href: 'https://dcyfr.ai/security', label: 'Security' },
    ],
  },
];

// Flat, and short by design: the v2 footer link row sits on one line beside the
// copyright. The v1 footer's two link columns live in the drawer above, and its
// brand tagline is gone with the prop — "All templates MIT licensed" already
// reads on app/page.tsx and app/templates/page.tsx.
const FOOTER: FooterLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: 'https://dcyfr.ai/terms', label: 'Terms' },
  { href: 'https://dcyfr.ai/security', label: 'Security' },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-identity selects the theme package; the .dark class (added by
    // ThemeProvider) selects the scheme. They are orthogonal by construction —
    // the theme is scoped [data-identity="slate"] / [data-identity="slate"].dark
    // — so identity and scheme can no longer tie on specificity the way two
    // single classes on this same element did, which is how the old amber
    // identity block was reaching into dark mode. Stamped server-side, so it is
    // present in the first paint rather than after hydration.
    <html
      lang="en"
      suppressHydrationWarning
      data-identity="slate"
      className={`${inter.variable} theme-dcyfr-build`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* focus:z-50 clears the fixed header, which is z-40. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
          >
            Skip to content
          </a>
          <SiteHeader
            logo={DcyfrBuildLogo}
            logoAriaLabel="dcyfr.build home"
            links={NAV}
            mobileNavSections={SECTIONS}
          />
          {/* pt-18 clears the fixed h-18 header. */}
          <main id="main-content" className="flex-1 pt-18">
            {children}
          </main>
          <SiteFooter brand="DCYFR" links={FOOTER} />
          {/* Stays inside ThemeProvider: DcyfrToaster reads next-themes' resolved
              theme value to pick the toast palette, so hoisting it out would strand
              it on the "system" default in dark mode. */}
          <DcyfrToaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
