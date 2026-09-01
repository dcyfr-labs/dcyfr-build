import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // NEXT_PUBLIC_VERCEL_ENV, not VERCEL_ENV: this file runs in the browser and
  // Next only inlines NEXT_PUBLIC_* into the client bundle, so the bare name
  // reads undefined and every browser event silently falls through to
  // 'development' — which makes environment:production queries look clean while
  // excluding the entire client half.
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  tracesSampleRate: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  debug: false,
});
