import Link from 'next/link';
import type { InfraTemplate } from '@/lib/types';

interface Props {
  template: InfraTemplate;
  compact?: boolean;
}

// CATEGORY_COLORS — industry-convention hues (docker/k8s/monitoring) + DCYFR
// semantic tokens (ci-cd→warning, security→destructive, networking→neutral).
// The 2 remaining hardcoded scales (violet/cyan) have no matching semantic
// token on dcyfr-build's identity palette; keeping them as deliberate
// carveouts per openspec/changes/archive/2026-04-19-dcyfr-build-work-hardcoded-colors §3.1.
// docker=blue migrated to `secure` (which IS blue: 217 91% 60% under theme).
// Lint exception: the workspace-level `scripts/polish-loop/lint-design-tokens.mjs`
// informational rule tolerates these as carveouts; strict backstop stays green.
//
// Every pill pairs a fill token with its DESIGNED foreground partner rather
// than tinting the fill with the same hue as its own label. The tint idiom
// these maps used before (`bg-warning/40 text-warning`) cannot reach WCAG AA
// for the warm tokens: measured against the live stylesheet, `text-warning` on
// `bg-warning/40` is 2.81:1 in light, and it does not clear 4.5 at ANY fill
// alpha — 10% still only reaches 4.38:1, because light `--warning`
// (26 90% 37%) is already marginal against white before any tint is applied.
// `text-success` behaves the same way (4.43:1 at its best). The designed pair
// is the fix the palette already ships for this: solid fill, `-foreground`
// label, 4.83:1 light / 10.38:1 dark for warning and 4.86 / 10.3 for success.
// The violet and cyan carveouts have no `-foreground` partner, so they carry
// an explicit light-mode pair; the previous single-value styling was tuned for
// dark (9.23:1) and applied unconditionally, which rendered `text-violet-300`
// on a pale violet wash at 1.23:1 in light — the worst reading on this site.
const CATEGORY_COLORS: Record<InfraTemplate['category'], string> = {
  docker:      'bg-secure border-secure text-secure-foreground',
  kubernetes:  'bg-violet-700 border-violet-700 text-violet-50 dark:bg-violet-400 dark:border-violet-400 dark:text-violet-950',
  'ci-cd':     'bg-warning border-warning text-warning-foreground',
  monitoring:  'bg-cyan-700 border-cyan-700 text-cyan-50 dark:bg-cyan-400 dark:border-cyan-400 dark:text-cyan-950',
  security:    'bg-destructive border-destructive text-destructive-foreground',
  networking:  'bg-muted border-border text-foreground',
};

const DIFFICULTY_COLORS: Record<InfraTemplate['difficulty'], string> = {
  beginner:     'bg-success border-success text-success-foreground',
  intermediate: 'bg-warning border-warning text-warning-foreground',
  advanced:     'bg-destructive border-destructive text-destructive-foreground',
};

export function TemplateCard({ template, compact = false }: Readonly<Props>) {
  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group block bg-card/20 border border-border/30 rounded-xl p-5 hover:bg-muted/30 hover:border-primary/60/50 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors leading-tight">
          {template.name}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[template.category]}`}>
          {template.category}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[template.difficulty]}`}>
          {template.difficulty}
        </span>
      </div>

      {!compact && (
        <>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {template.stack.map((s) => (
              <span key={s} className="text-xs text-primary font-mono">{s}</span>
            ))}
          </div>
        </>
      )}

      {compact && (
        <p className="text-xs text-primary line-clamp-1">{template.stack.join(' · ')}</p>
      )}
    </Link>
  );
}
