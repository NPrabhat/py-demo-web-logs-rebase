'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import InputSection from '@/components/InputSection';
import OutputSection from '@/components/OutputSection';
import UsageBadge from '@/components/UsageBadge';
import UpgradeModal from '@/components/UpgradeModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { FormatResult } from '@/lib/types';
import { PLAN_LIMITS } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading, refreshProfile } = useAuth();
  const { toasts, dismissToast, success, error } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<FormatResult[]>([]);
  const [loadingFormats, setLoadingFormats] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Check for checkout success
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      success('Payment successful! Welcome to Pro ✨');
      refreshProfile();
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, success, refreshProfile]);

  const checkUsageLimit = (): boolean => {
    if (!profile) return false;
    
    const limit = profile.plan === 'pro' ? -1 : PLAN_LIMITS.free;
    if (limit === -1) return true;
    
    if (profile.monthly_usage >= limit) {
      setUpgradeModalOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (content: string) => {
    if (!checkUsageLimit()) return;

    setIsGenerating(true);
    setResults([]);
    setHasStarted(true);
    setLoadingFormats(['twitter', 'linkedin', 'instagram', 'email', 'reddit', 'takeaways']);

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.status === 403) {
        const data = await response.json();
        error(data.error || 'Usage limit exceeded');
        setUpgradeModalOpen(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data.outputs);
        success('Content repurposed successfully!');
        await refreshProfile();
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      error((err as Error).message);
    } finally {
      setIsGenerating(false);
      setLoadingFormats([]);
    }
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY 
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');
      
      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      error('Failed to start checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        {profile && (
          <div className="w-48">
            <UsageBadge
              used={profile.monthly_usage}
              limit={profile.plan === 'pro' ? -1 : PLAN_LIMITS.free}
              plan={profile.plan}
              resetsAt={profile.usage_reset_date}
              compact
            />
          </div>
        )}
      </div>

      {/* Input Section */}
      <InputSection onSubmit={handleSubmit} isLoading={isGenerating} />

      {/* Output Section */}
      {(hasStarted || results.length > 0) && (
        <OutputSection
          results={results}
          loadingFormats={loadingFormats}
          hasStarted={hasStarted}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
        resetDate={profile?.usage_reset_date}
        isLoading={checkoutLoading}
      />

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => dismissToast(toast.id)}
              className={`glass-card p-4 min-w-[280px] cursor-pointer animate-slide-in ${
                toast.type === 'success' ? 'border-green-500/30' :
                toast.type === 'error' ? 'border-red-500/30' :
                'border-blue-500/30'
              }`}
            >
              <p className={`text-sm ${
                toast.type === 'success' ? 'text-green-400' :
                toast.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {toast.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
