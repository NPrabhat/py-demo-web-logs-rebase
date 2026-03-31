'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormatCard from '@/components/FormatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { RepurposeHistory, FormatResult } from '@/lib/types';
import { calculateTimeAgo } from '@/lib/utils';

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [item, setItem] = useState<RepurposeHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [resolvedParams.id]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/history/${resolvedParams.id}`);
      if (!response.ok) throw new Error('Not found');
      
      const data = await response.json();
      setItem(data.item);
    } catch (err) {
      console.error('Error fetching history:', err);
      router.push('/history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Not Found</h1>
        <Link href="/history" className="text-violet-400 hover:text-violet-300">
          ← Back to History
        </Link>
      </div>
    );
  }

  const outputs: FormatResult[] = (item.outputs || []).map((o) => ({
    format: o.format as any,
    label: o.label,
    emoji: o.emoji,
    content: o.content,
    modelUsed: o.model_used,
    tokensUsed: o.tokens_used,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/history"
          className="text-white/50 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-white truncate">
          {item.content_title || 'Untitled'}
        </h1>
      </div>

      {/* Metadata */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-white/50">
          Created {calculateTimeAgo(item.created_at)}
        </span>
        <span className="text-white/30">•</span>
        <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
          {item.ai_model_used}
        </span>
        <span className="text-white/50">
          {item.generation_time_ms}ms
        </span>
      </div>

      {/* Original Content */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Original Content</h2>
          {item.original_content.length > 500 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        <pre className={`whitespace-pre-wrap text-sm text-white/70 ${!expanded && 'line-clamp-10'}`}>
          {item.original_content}
        </pre>
      </div>

      {/* Generated Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {outputs.map((output) => (
          <FormatCard
            key={output.format}
            emoji={output.emoji}
            label={output.label}
            content={output.content}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  );
}
