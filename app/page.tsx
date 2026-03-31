'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FORMATS, FORMAT_CONFIGS } from '@/lib/constants';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
          <span className="text-sm text-violet-400">Powered by Groq ⚡</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          One Content →{' '}
          <span className="text-gradient">6 Formats Instantly</span>
        </h1>
        
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Transform your blog posts, articles, and content into Twitter threads, 
          LinkedIn posts, Instagram captions, emails, Reddit posts, and key takeaways 
          with AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                See Pricing
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Format Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {FORMATS.map((format) => (
          <div
            key={format}
            className="glass-card px-4 py-2 flex items-center space-x-2"
          >
            <span>{FORMAT_CONFIGS[format].emoji}</span>
            <span className="text-white/70">{FORMAT_CONFIGS[format].label}</span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center text-2xl">
              📝
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">1. Paste Content</h3>
            <p className="text-white/50">
              Copy and paste your blog post, article, or any text content
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">2. AI Processing</h3>
            <p className="text-white/50">
              Llama 3.3 transforms your content into 6 optimized formats
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center text-2xl">
              🚀
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">3. Copy & Share</h3>
            <p className="text-white/50">
              Copy each format and share across your favorite platforms
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="glass-card p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Start Free, Upgrade When Ready
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Get 5 free repurposes every month. Upgrade to Pro for unlimited access 
          and priority processing.
        </p>
        <Link href="/pricing" className="btn-primary">
          View Pricing Plans
        </Link>
      </div>
    </div>
  );
}
