'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UsageBadge from '@/components/UsageBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PLAN_LIMITS } from '@/lib/constants';

export default function AccountPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.full_name || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdateName = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: nameInput }),
      });

      if (!response.ok) throw new Error('Failed to update');

      await refreshProfile();
      setEditingName(false);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create portal session');

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Portal error:', err);
    }
  };

  const handleUpgrade = async () => {
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
      console.error('Checkout error:', err);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Account Settings</h1>

      {/* Profile Section */}
      <div className="glass-card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full" />
            ) : (
              user?.email?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-white font-medium">{profile?.full_name || 'No name'}</p>
            <p className="text-white/50 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Name Input */}
        {editingName ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white input-focus"
              placeholder="Your name"
              disabled={updating}
            />
            <button
              onClick={handleUpdateName}
              disabled={updating}
              className="btn-primary"
            >
              {updating ? <LoadingSpinner size="sm" /> : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditingName(false);
                setNameInput(profile?.full_name || '');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setNameInput(profile?.full_name || '');
              setEditingName(true);
            }}
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            Edit name
          </button>
        )}
      </div>

      {/* Plan Section */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Subscription</h2>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Current Plan:</span>
              {profile?.plan === 'pro' ? (
                <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  PRO ✨
                </span>
              ) : (
                <span className="bg-white/10 text-white/70 text-xs font-bold px-2 py-0.5 rounded-full">
                  FREE
                </span>
              )}
            </div>
            {profile?.plan === 'pro' && profile.subscription_status && (
              <p className="text-sm text-white/50 mt-1">
                Status: {profile.subscription_status}
              </p>
            )}
          </div>

          {profile?.plan === 'free' ? (
            <button onClick={handleUpgrade} className="btn-primary">
              Upgrade to Pro
            </button>
          ) : (
            <button onClick={handleManageSubscription} className="btn-secondary">
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Usage Section */}
      {profile && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Usage</h2>
          <UsageBadge
            used={profile.monthly_usage}
            limit={profile.plan === 'pro' ? -1 : PLAN_LIMITS.free}
            plan={profile.plan}
            resetsAt={profile.usage_reset_date}
          />
        </div>
      )}

      {/* Sign Out */}
      <div className="pt-4">
        <button onClick={signOut} className="text-red-400 hover:text-red-300 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
