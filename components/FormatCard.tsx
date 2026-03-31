'use client';

import { useState, useEffect } from 'react';
import { truncateText } from '@/lib/utils';

interface FormatCardProps {
  emoji: string;
  label: string;
  content: string;
  isLoading: boolean;
}

export default function FormatCard({ emoji, label, content, isLoading }: FormatCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    }
  };

  const shouldTruncate = content.length > 400;
  const displayContent = expanded || !shouldTruncate ? content : truncateText(content, 400);
  const isEmpty = !content && !isLoading;

  if (isEmpty) {
    return (
      <div className="glass-card p-6 opacity-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <span className="font-medium text-white/50">{label}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded animate-pulse" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card p-6 border-violet-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <span className="font-medium text-white">{label}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-dot" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
        </div>
        <p className="mt-4 text-sm text-violet-400">Generating...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 hover:border-violet-500/30 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-medium text-white">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      <div className="relative">
        <pre className="whitespace-pre-wrap text-sm text-white/70 font-sans leading-relaxed">
          {displayContent}
        </pre>
        
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}
