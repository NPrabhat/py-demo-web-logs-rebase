export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-sm text-white/70">
              Built with ❤️ • RepurposeAI
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-sm text-white/50">
              Powered by Groq ⚡
            </span>
            <a href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <p className="text-sm text-white/30">
            © {currentYear} RepurposeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
