'use client';

interface Props {
  content: string;
  filename: string;
}

export function DownloadButton({ content, filename }: Readonly<Props>) {
  function handleDownload() {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 bg-muted hover:bg-primary text-foreground hover:text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      ↓ Download
    </button>
  );
}
