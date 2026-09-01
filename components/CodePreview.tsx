'use client';

import { useState } from 'react';

interface Props {
  content: string;
  filename?: string;
}

export function CodePreview({ content, filename }: Readonly<Props>) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border/30">
      <div className="flex items-center justify-between bg-background/80 border-b border-border/40 px-4 py-2">
        <span className="text-xs text-primary font-mono">{filename ?? 'template'}</span>
        <button
          onClick={() => void handleCopy()}
          className="text-xs text-muted-foreground hover:text-muted-foreground transition-colors px-3 py-1 rounded border border-border/40 hover:border-primary/60"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-background/60 p-4 overflow-x-auto text-sm text-muted-foreground leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}
