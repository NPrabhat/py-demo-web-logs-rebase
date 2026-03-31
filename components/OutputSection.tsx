'use client';

import { useState } from 'react';
import { FORMAT_CONFIGS, type FormatKey } from '@/lib/types';
import FormatCard from './FormatCard';
import type { FormatResult } from '@/lib/types';

interface OutputSectionProps {
  results: FormatResult[];
  loadingFormats: string[];
  hasStarted: boolean;
}

export default function OutputSection({ results, loadingFormats, hasStarted }: OutputSectionProps) {
  const generatedCount = results.length;
  const totalCount = 6;
  const progressPercent = hasStarted ? (generatedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Generated Content
          {hasStarted && (
            <span className="ml-2 text-sm text-white/50">
              ({generatedCount}/{totalCount})
            </span>
          )}
        </h2>
        {hasStarted && (
          <span className="text-xs text-white/50">
            Powered by Llama 3.3 via Groq ⚡
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {hasStarted && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {FORMAT_CONFIGS && Object.entries(FORMAT_CONFIGS).map(([formatKey, config]) => {
          const result = results.find(r => r.format === formatKey);
          const isLoading = loadingFormats.includes(formatKey) && !result;
          
          return (
            <FormatCard
              key={formatKey}
              emoji={config.emoji}
              label={config.label}
              content={result?.content || ''}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
