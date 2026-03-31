'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const [modalOpen, setModalOpen] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      router.push(redirect);
    } else if (!loading && !user) {
      setIsChecking(false);
    }
  }, [user, loading, router, redirect]);

  if (isChecking || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-2xl font-bold text-gradient">RepurposeAI</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back
        </h1>
        <p className="text-white/50">
          Sign in to access your dashboard
        </p>
      </div>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        redirect={redirect}
      />

      {!modalOpen && (
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary w-full"
        >
          Open Sign In
        </button>
      )}
    </div>
  );
}
