import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // Drop {projectName} and {platform} from snapshot paths so one baseline set
  // serves every project. The 5% tolerance (maxDiffPixelRatio: 0.05 in
  // e2e/snapshots.spec.ts) absorbs per-OS font/anti-aliasing noise.
  //
  // IMPORTANT: baselines MUST come from the CI render, never a local capture,
  // at BOTH viewports. Tolerance only applies once the two images are the same
  // size — a fullPage height difference is a hard size mismatch that fails
  // before any pixel ratio is considered. Local arm64 macOS and the x86 Linux
  // runner wrap text differently, so page height diverges and no tolerance can
  // rescue it.
  //
  // Measured 2026-07-31, which is why this gate had never once passed here:
  // local macOS rendered dcyfr.bot's / at 1440px as exactly 1743px tall —
  // matching its committed baseline — while CI rendered 1803px on three
  // consecutive attempts. Desktop is NOT immune; the drift was +20px here,
  // +60px on dcyfr-bot, +51px on dcyfr-work.
  //
  // Procedure: push the change, let this gate fail, download the failed run's
  // `playwright-report` artifact, and commit its `<name>-actual.png` as the
  // new `<name>.png` (that artifact is the exact CI render). CI output is
  // deterministic — identical dimensions across retries, branches, and days —
  // so baselines converge. Do NOT use `--update-snapshots` locally.
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://dcyfr.build',
    trace: 'on-first-retry',
    // Vercel Protection Bypass for Automation. Without these headers, Playwright
    // hits the Vercel SSO login wall on protected preview deploys instead of the
    // site. Header bypass + cookie bypass together cover both fetch + navigation.
    // https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : undefined,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
