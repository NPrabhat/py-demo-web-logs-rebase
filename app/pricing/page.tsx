'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PricingCard from '@/components/PricingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PLAN_LIMITS } from '@/lib/constants';

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Handle checkout canceled
  if (searchParams.get('checkout') === 'canceled') {
    // Could show a toast here
  }

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const freeFeatures = [
    '5 repurposes per month',
    'All 6 output formats',
    'Basic processing speed',
    '7-day history retention',
    'Email support',
  ];

  const proFeatures = [
    'Unlimited repurposes',
    'All 6 output formats',
    'Priority processing with Groq',
    'Unlimited history',
    'Priority email support',
    'Cancel anytime',
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Simple Pricing
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Start free, upgrade when you need more
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center space-x-4 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-violet-600 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-violet-600 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <PricingCard
          planName="Free"
          price={0}
          yearlyPrice={0}
          features={freeFeatures}
          ctaText={user ? 'Current Plan' : 'Get Started'}
          ctaAction={() => router.push(user ? '/dashboard' : '/auth/login')}
          isCurrentPlan={profile?.plan === 'free'}
          billingPeriod={billingPeriod}
        />

        {/* Pro Plan */}
        <PricingCard
          planName="Pro"
          price={19}
          yearlyPrice={149}
          features={proFeatures}
          isPopular
          ctaText={billingPeriod === 'monthly' ? '$19/month' : '$149/year'}
          ctaAction={() =>
            handleCheckout(
              billingPeriod === 'monthly'
                ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!
                : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY!
            )
          }
          isCurrentPlan={profile?.plan === 'pro'}
          isLoading={checkoutLoading}
          billingPeriod={billingPeriod}
        />
      </div>

      {/* FAQ */}
      <div className="mt-16 glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-white font-medium mb-2">
              What happens when I exceed the free limit?
            </h3>
            <p className="text-white/50 text-sm">
              You'll be prompted to upgrade to Pro. Your free limit resets on the 
              first day of each month.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">
              Can I cancel my Pro subscription?
            </h3>
            <p className="text-white/50 text-sm">
              Yes, you can cancel anytime from your account settings. You'll keep 
              access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">
              What AI model powers RepurposeAI?
            </h3>
            <p className="text-white/50 text-sm">
              We use Llama 3.3 70B via Groq for blazing-fast generation speeds. 
              Pro users get priority processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
