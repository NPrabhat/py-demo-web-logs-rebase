import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RepurposeAI - Transform Content into 6 Formats Instantly',
  description: 'Paste your content and get AI-repurposed outputs for Twitter, LinkedIn, Instagram, Email, Reddit, and Key Takeaways. Powered by Llama 3.3 via Groq.',
  keywords: ['AI', 'content repurposing', 'social media', 'Twitter', 'LinkedIn', 'Instagram', 'email newsletter'],
  authors: [{ name: 'RepurposeAI' }],
  openGraph: {
    title: 'RepurposeAI - Transform Content into 6 Formats Instantly',
    description: 'Paste your content and get AI-repurposed outputs for Twitter, LinkedIn, Instagram, Email, Reddit, and Key Takeaways.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
