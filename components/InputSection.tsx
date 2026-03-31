'use client';

import { useState } from 'react';
import { SAMPLE_CONTENT } from '@/lib/constants';

interface InputSectionProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export default function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isValid = charCount >= 50 && charCount <= 50000;

  const handleLoadSample = () => {
    setContent(SAMPLE_CONTENT);
    setError('');
  };

  const handleSubmit = () => {
    if (charCount < 50) {
      setError('Content must be at least 50 characters');
      return;
    }
    if (charCount > 50000) {
      setError('Content must be less than 50,000 characters');
      return;
    }
    setError('');
    onSubmit(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Your Content</h2>
        <button
          onClick={handleLoadSample}
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          Load sample content
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Paste your blog post, article, or any content here... (minimum 50 characters)"
        className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 input-focus resize-none"
        disabled={isLoading}
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-white/50">
          <span>{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>{charCount} chars</span>
          {charCount > 50000 && (
            <span className="ml-2 text-red-400">(max 50,000)</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="btn-primary flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Repurpose into 6 Formats</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-white/30">
        Tip: Press ⌘+Enter to submit quickly
      </p>
    </div>
  );
}
