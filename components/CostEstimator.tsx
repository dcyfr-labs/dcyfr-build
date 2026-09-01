'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CopyIcon, RotateCcwIcon } from 'lucide-react';
import type { InfraTemplate, CostLine } from '@/lib/types';
import { DcyfrCard } from '@/components/ui/dcyfr-card';
import { DcyfrLabel } from '@/components/ui/dcyfr-label';
import { DcyfrButton } from '@/components/ui/dcyfr-button';
import { DcyfrProgress } from '@/components/ui/dcyfr-progress';
import {
  DcyfrSelect,
  DcyfrSelectContent,
  DcyfrSelectItem,
  DcyfrSelectTrigger,
  DcyfrSelectValue,
} from '@/components/ui/dcyfr-select';

interface Props {
  templates: InfraTemplate[];
}

type Provider = 'aws' | 'gcp' | 'azure' | 'digitalocean' | 'fly';
type Workload = 'small' | 'medium' | 'large';

const PROVIDERS: Array<{ value: Provider; label: string }> = [
  { value: 'aws', label: 'AWS' },
  { value: 'gcp', label: 'GCP' },
  { value: 'azure', label: 'Azure' },
  { value: 'digitalocean', label: 'DigitalOcean' },
  { value: 'fly', label: 'Fly.io' },
];

const WORKLOADS: Array<{ value: Workload; label: string; desc: string }> = [
  { value: 'small', label: 'Small', desc: '1 vCPU, 1GB RAM' },
  { value: 'medium', label: 'Medium', desc: '2 vCPU, 4GB RAM' },
  { value: 'large', label: 'Large', desc: '4 vCPU, 8GB RAM' },
];

// Base monthly costs per (provider, workload) in USD
const BASE_COSTS: Record<Provider, Record<Workload, number>> = {
  aws: { small: 18, medium: 65, large: 180 },
  gcp: { small: 16, medium: 60, large: 170 },
  azure: { small: 20, medium: 72, large: 195 },
  digitalocean: { small: 12, medium: 48, large: 130 },
  fly: { small: 8, medium: 30, large: 90 },
};

// Soft budget threshold — progress bar shows total / this value, capped at 100%
const BUDGET_CEILING = 300;

const DEFAULT_PROVIDER: Provider = 'aws';
const DEFAULT_WORKLOAD: Workload = 'small';

function buildLines(
  templateId: string,
  provider: Provider,
  workload: Workload
): CostLine[] {
  const base = BASE_COSTS[provider][workload];
  const isK8s = templateId.startsWith('k8s');
  const isCompose = templateId === 'docker-compose-dev-stack';

  const lines: CostLine[] = [
    { service: 'Compute', provider, unitCost: base * 0.6, units: 1, totalCost: base * 0.6 },
    { service: 'Storage (20 GB)', provider, unitCost: base * 0.1, units: 1, totalCost: base * 0.1 },
    { service: 'Network egress', provider, unitCost: base * 0.05, units: 1, totalCost: base * 0.05 },
  ];

  if (isK8s) {
    lines.push({ service: 'Load Balancer', provider, unitCost: base * 0.15, units: 1, totalCost: base * 0.15 });
    lines.push({ service: 'Control Plane', provider, unitCost: base * 0.1, units: 1, totalCost: base * 0.1 });
  }

  if (isCompose) {
    lines.push({ service: 'PostgreSQL', provider, unitCost: base * 0.2, units: 1, totalCost: base * 0.2 });
    lines.push({ service: 'Redis', provider, unitCost: base * 0.05, units: 1, totalCost: base * 0.05 });
  }

  return lines;
}

export function CostEstimator({ templates }: Readonly<Props>) {
  const defaultTemplate = templates[0]?.id ?? '';
  const [templateId, setTemplateId] = useState(defaultTemplate);
  const [provider, setProvider] = useState<Provider>(DEFAULT_PROVIDER);
  const [workload, setWorkload] = useState<Workload>(DEFAULT_WORKLOAD);

  const { lines, total, selectedTemplate } = useMemo(() => {
    const ls = buildLines(templateId, provider, workload);
    return {
      lines: ls,
      total: ls.reduce((sum, l) => sum + l.totalCost, 0),
      selectedTemplate: templates.find((t) => t.id === templateId),
    };
  }, [templateId, provider, workload, templates]);

  const budgetRatio = Math.min(100, Math.round((total / BUDGET_CEILING) * 100));
  const budgetVariant: 'default' | 'danger' =
    budgetRatio < 85 ? 'default' : 'danger';

  const handleCopy = async () => {
    const providerLabel = PROVIDERS.find((p) => p.value === provider)?.label ?? provider;
    const workloadLabel = WORKLOADS.find((w) => w.value === workload)?.label ?? workload;
    const body = [
      `Cost breakdown — ${selectedTemplate?.name ?? templateId}`,
      `Provider: ${providerLabel} · Workload: ${workloadLabel}`,
      '',
      ...lines.map(
        (l) => `${l.service.padEnd(22)} $${l.totalCost.toFixed(2).padStart(8)}`
      ),
      ''.padEnd(33, '—'),
      `${'Total / month'.padEnd(22)} $${total.toFixed(2).padStart(8)}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(body);
      toast.success('Breakdown copied', {
        description: 'Paste into your favorite editor.',
      });
    } catch {
      toast.error('Copy failed', { description: 'Try again or copy manually.' });
    }
  };

  const handleReset = () => {
    setTemplateId(defaultTemplate);
    setProvider(DEFAULT_PROVIDER);
    setWorkload(DEFAULT_WORKLOAD);
    toast.info('Reset to defaults');
  };

  return (
    <DcyfrCard variant="elevated" padding="lg" className="bg-card/20 border-border/30">
      <div className="px-6 sm:px-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Cost Estimator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <DcyfrLabel htmlFor="template" className="text-primary text-xs uppercase tracking-wide">
              Template
            </DcyfrLabel>
            <DcyfrSelect value={templateId} onValueChange={setTemplateId}>
              <DcyfrSelectTrigger id="template" className="w-full border-border/40 bg-background/60 text-muted-foreground">
                <DcyfrSelectValue placeholder="Select a template" />
              </DcyfrSelectTrigger>
              <DcyfrSelectContent>
                {templates.map((t) => (
                  <DcyfrSelectItem key={t.id} value={t.id}>
                    {t.name}
                  </DcyfrSelectItem>
                ))}
              </DcyfrSelectContent>
            </DcyfrSelect>
          </div>
          <div className="space-y-2">
            <DcyfrLabel htmlFor="provider" className="text-primary text-xs uppercase tracking-wide">
              Provider
            </DcyfrLabel>
            <DcyfrSelect value={provider} onValueChange={(v) => setProvider(v as Provider)}>
              <DcyfrSelectTrigger id="provider" className="w-full border-border/40 bg-background/60 text-muted-foreground">
                <DcyfrSelectValue />
              </DcyfrSelectTrigger>
              <DcyfrSelectContent>
                {PROVIDERS.map((p) => (
                  <DcyfrSelectItem key={p.value} value={p.value}>
                    {p.label}
                  </DcyfrSelectItem>
                ))}
              </DcyfrSelectContent>
            </DcyfrSelect>
          </div>
          <div className="space-y-2">
            <DcyfrLabel htmlFor="workload" className="text-primary text-xs uppercase tracking-wide">
              Workload Size
            </DcyfrLabel>
            <DcyfrSelect value={workload} onValueChange={(v) => setWorkload(v as Workload)}>
              <DcyfrSelectTrigger id="workload" className="w-full border-border/40 bg-background/60 text-muted-foreground">
                <DcyfrSelectValue />
              </DcyfrSelectTrigger>
              <DcyfrSelectContent>
                {WORKLOADS.map((w) => (
                  <DcyfrSelectItem key={w.value} value={w.value}>
                    {w.label} — {w.desc}
                  </DcyfrSelectItem>
                ))}
              </DcyfrSelectContent>
            </DcyfrSelect>
          </div>
        </div>

        <div className="border border-border/30 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card/40 border-b border-border/40">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Service</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Unit Cost</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Units</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.service} className="border-b border-border/30">
                  <td className="px-4 py-3 text-muted-foreground">{line.service}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${line.unitCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{line.units}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground font-medium">${line.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-card/30">
                <td colSpan={3} className="px-4 py-3 text-muted-foreground font-semibold">
                  Estimated Total / Month
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground font-bold text-base">
                  ${total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-primary uppercase tracking-wide">
              Budget ceiling · ${BUDGET_CEILING}/mo
            </span>
            <span className="text-muted-foreground">{budgetRatio}%</span>
          </div>
          <DcyfrProgress value={budgetRatio} variant={budgetVariant} size="md" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <DcyfrButton onClick={handleCopy} variant="brand" size="md">
            <CopyIcon className="size-4" aria-hidden="true" />
            Copy breakdown
          </DcyfrButton>
          <DcyfrButton onClick={handleReset} variant="ghostly" size="md">
            <RotateCcwIcon className="size-4" aria-hidden="true" />
            Reset
          </DcyfrButton>
        </div>

        <p className="text-xs text-primary">
          Estimates are approximate and exclude free-tier credits, data-transfer costs,
          and support plans. Always verify with your cloud provider&apos;s pricing calculator.
        </p>
      </div>
    </DcyfrCard>
  );
}
