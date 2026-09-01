'use client';

import { useState } from 'react';
import type { InfraTemplate } from '@/lib/types';
import templatesData from '@/data/templates.json';
import { TemplateCard } from '@/components/TemplateCard';

const templates = templatesData as InfraTemplate[];

type CategoryFilter = 'all' | InfraTemplate['category'];
type DifficultyFilter = 'all' | InfraTemplate['difficulty'];

const CATEGORIES: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'ci-cd', label: 'CI/CD' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'security', label: 'Security' },
  { value: 'networking', label: 'Networking' },
];

const DIFFICULTIES: Array<{ value: DifficultyFilter; label: string }> = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function TemplatesPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = templates.filter((t) => {
    if (category !== 'all' && t.category !== category) return false;
    if (difficulty !== 'all' && t.difficulty !== difficulty) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const btnBase = 'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors';
  const btnActive = 'bg-muted border-primary/60 text-foreground';
  const btnInactive = 'bg-card/20 border-border/40 text-muted-foreground hover:text-muted-foreground hover:border-primary/60/60';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Infrastructure Templates</h1>
        <p className="text-muted-foreground">{templates.length} templates — all MIT licensed and production-validated.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates…"
          className="w-full sm:max-w-sm bg-background/60 border border-border/40 rounded-lg px-4 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/50"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button key={cat.value} onClick={() => setCategory(cat.value)}
            className={`${btnBase} ${category === cat.value ? btnActive : btnInactive}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by difficulty">
        {DIFFICULTIES.map((d) => (
          <button key={d.value} onClick={() => setDifficulty(d.value)}
            className={`${btnBase} ${difficulty === d.value ? btnActive : btnInactive}`}>
            {d.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-primary mb-6">
        Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => <TemplateCard key={t.id} template={t} />)}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 text-primary">No templates match your filters.</p>
      )}
    </div>
  );
}
