'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { PLAN_LIMITS } from '@/lib/constants';

export default function Header() {
  const { user, profile, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const isPro = profile?.plan === 'pro';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gradient">RepurposeAI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/history" className="text-white/70 hover:text-white transition-colors">
                  History
                </Link>
                <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-9 w-24 bg-white/10 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials(user.email)
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">{user.email}</span>
                      {isPro && (
                        <span className="text-xs bg-gradient-to-r from-violet-500 to-indigo-500 px-2 py-0.5 rounded-full text-white">
                          PRO ✨
                        </span>
                      )}
                      {!isPro && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                      <Link
                        href="/account"
                        className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Account
                      </Link>
                      <Link
                        href="/history"
                        className="block px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        History
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/auth/login" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/history" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    History
                  </Link>
                  <Link href="/pricing" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </Link>
                  <Link href="/account" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    Account
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left text-red-400">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/pricing" className="text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </Link>
                  <Link href="/auth/login" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/login" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
