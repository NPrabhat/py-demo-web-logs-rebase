'use client';

import { PLAN_LIMITS } from '@/lib/constants';
import type { Profile } from '@/lib/types';

interface UsageBadgeProps {
  used: number;
  limit: number;
  plan: 'free' | 'pro';
  resetsAt?: string;
  compact?: boolean;
}

export default function UsageBadge({ used, limit, plan, resetsAt, compact = false }: UsageBadgeProps) {
  const isUnlimited = plan === 'pro' || limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  
  let progressColor = 'bg-green-500';
  if (percentage >= 80) progressColor = 'bg-red-500';
  else if (percentage >= 50) progressColor = 'bg-yellow-500';

  if (isUnlimited) {
    return (
      <div className={`flex items-center space-x-2 ${compact ? '' : 'glass-card p-4'}`}>
        <span className="text-sm font-medium text-white">Unlimited ✨</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? '' : 'glass-card p-4'} w-full`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">
          {used}/{limit} used
        </span>
        {resetsAt && !compact && (
          <span className="text-xs text-white/50">
            Resets {new Date(resetsAt).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {!compact && (
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      
      {compact && percentage >= 80 && (
        <span className="text-xs text-red-400">Almost at limit!</span>
      )}
    </div>
  );
}
