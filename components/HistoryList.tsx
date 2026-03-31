'use client';

import { useRouter } from 'next/navigation';
import { calculateTimeAgo, truncateText } from '@/lib/utils';
import type { RepurposeHistory } from '@/lib/types';

interface HistoryListProps {
  items: RepurposeHistory[];
  onDelete: (id: string) => void;
}

export default function HistoryList({ items, onDelete }: HistoryListProps) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-white mb-2">No history yet</h3>
        <p className="text-white/50">Your repurposed content will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="glass-card p-6 hover:border-violet-500/30 transition-colors cursor-pointer group"
          onClick={() => router.push(`/history/${item.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate mb-2">
                {item.content_title || 'Untitled'}
              </h3>
              <p className="text-white/50 text-sm line-clamp-2">
                {truncateText(item.original_content, 150)}
              </p>
              
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-xs text-white/30">
                  {calculateTimeAgo(item.created_at)}
                </span>
                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                  {item.formats_generated} formats
                </span>
                <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
                  {item.ai_model_used}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this item?')) {
                  onDelete(item.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-white/30 hover:text-red-400 transition-all"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
