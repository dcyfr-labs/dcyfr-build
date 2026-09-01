import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { PageShell, SiteNav, SiteFooter } from '@/components/chrome';
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

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/cost-estimator', label: 'Cost Estimator' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Tools',
    links: [
      { href: '/templates', label: 'Templates' },
      { href: '/cost-estimator', label: 'Cost Estimator' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { href: 'https://dcyfr.io', label: 'dcyfr.io', external: true },
      { href: 'https://dcyfr.app', label: 'dcyfr.app', external: true },
      { href: 'https://github.com/dcyfr', label: 'GitHub', external: true },
    ],
  },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: 'https://dcyfr.ai/terms', label: 'Terms', external: true },
  { href: 'https://dcyfr.ai/security', label: 'Security', external: true },
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
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageShell
            nav={<SiteNav logo={DcyfrBuildLogo} links={NAV_LINKS} />}
            footer={
              <SiteFooter
                brand={{
                  name: 'dcyfr.build',
                  tagline: 'Infrastructure for AI-powered apps · All templates MIT licensed',
                }}
                columns={FOOTER_COLUMNS}
                legal={LEGAL_LINKS}
              />
            }
            padding="none"
            maxWidth="full"
          >
            {children}
          </PageShell>
          <DcyfrToaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
