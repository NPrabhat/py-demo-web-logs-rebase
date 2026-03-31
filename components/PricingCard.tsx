'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface PricingCardProps {
  planName: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaAction: () => void;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  billingPeriod: 'monthly' | 'yearly';
}

export default function PricingCard({
  planName,
  price,
  yearlyPrice,
  features,
  isPopular = false,
  ctaText,
  ctaAction,
  isCurrentPlan = false,
  isLoading = false,
  billingPeriod,
}: PricingCardProps) {
  const displayPrice = billingPeriod === 'monthly' ? price : yearlyPrice;
  const periodLabel = billingPeriod === 'monthly' ? '/month' : '/year';

  return (
    <div
      className={`relative glass-card p-8 ${
        isPopular ? 'border-violet-500/50 ring-1 ring-violet-500/20' : 'border-white/10'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{planName}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-white">
            {formatCurrency(displayPrice)}
          </span>
          <span className="text-white/50 ml-1">{periodLabel}</span>
        </div>
        {billingPeriod === 'yearly' && yearlyPrice > 0 && (
          <p className="text-sm text-green-400 mt-2">
            Save {Math.round((1 - yearlyPrice / (price * 12)) * 100)}% vs monthly
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-white/70 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={ctaAction}
        disabled={isCurrentPlan || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] ${
          isCurrentPlan
            ? 'bg-white/5 text-white/50 cursor-not-allowed'
            : isPopular
            ? 'btn-primary'
            : 'btn-secondary'
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          ctaText
        )}
      </button>
    </div>
  );
}
