'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  resetDate?: string;
  isLoading?: boolean;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, resetDate, isLoading }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card w-full max-w-md p-8 animate-fade-in border-violet-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-white/70">
            You've used all 5 free repurposes this month
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-green-400">✓</span>
            <span className="text-white/70">Unlimited repurposes</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400">✓</span>
            <span className="text-white/70">Priority processing with Groq</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400">✓</span>
            <span className="text-white/70">Full history access</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400">✓</span>
            <span className="text-white/70">Cancel anytime</span>
          </div>
        </div>

        {resetDate && (
          <p className="text-sm text-white/50 text-center mb-6">
            Or wait until {new Date(resetDate).toLocaleDateString()} for your free limit to reset
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Upgrade to Pro - $19/month'
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 text-white/50 hover:text-white transition-colors text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
