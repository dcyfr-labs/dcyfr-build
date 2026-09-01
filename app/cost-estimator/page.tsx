import type { Metadata } from 'next';
import type { InfraTemplate } from '@/lib/types';
import templatesData from '@/data/templates.json';
import { CostEstimator } from '@/components/CostEstimator';

const templates = templatesData as InfraTemplate[];

export const metadata: Metadata = {
  title: 'Cost Estimator — DCYFR Build',
  description: 'Estimate monthly infrastructure costs across AWS, GCP, Azure, DigitalOcean, and Fly.io.',
};

export default function CostEstimatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cost Estimator</h1>
        <p className="text-muted-foreground">
          Estimate monthly infrastructure costs across 5 cloud providers for any template.
        </p>
      </div>
      <CostEstimator templates={templates} />
    </div>
  );
}
