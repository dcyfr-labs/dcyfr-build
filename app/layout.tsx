import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { PageShell, SiteNav, SiteFooter } from '@/components/chrome';
import { DcyfrToaster } from '@/components/ui/dcyfr-sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dcyfr.build'),
  title: 'DCYFR Build — Infrastructure Template Library',
  description: 'Battle-tested Docker, Kubernetes, and CI/CD templates with cost estimator.',
};

const DcyfrBuildLogo = (
  <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
    <span className="text-accent">◈</span>
    <span>
      dcyfr<span className="text-accent">.build</span>
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="theme-dcyfr-build">
      <body className={`${inter.className} min-h-screen font-sans`}>
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
