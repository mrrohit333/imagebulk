import Script from "next/script";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Neon Dark Theme */}
      <section className="relative pt-16 md:pt-32 pb-24 md:pb-48 px-4 overflow-hidden">
        {/* Animated Neon Particles */}
        <div className="absolute top-20 left-10 w-48 md:w-64 h-48 md:h-64 bg-neon-green/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-neon-cyan/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 animate-slideUp leading-tight">
            <span className="gradient-text">
              Download Images
            </span>
            <br />
            <span className="text-white">
              in <span className="text-neon-green">Bulk</span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto animate-fadeIn leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Search and download high-quality images from Pexels in bulk.
            <br className="hidden md:block" />
            Perfect for AI datasets, design projects, and content creation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 btn-neon rounded-xl text-lg md:text-xl font-black relative group overflow-hidden text-center"
            >
              <span className="relative z-10">🚀 Get Started Free</span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 glass-card hover:border-neon-cyan rounded-xl text-lg md:text-xl font-bold text-white text-center"
            >
              💎 View Pricing
            </Link>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-12 md:mb-20 animate-slideUp">
            Why Choose <span className="gradient-text">ImageBulk</span>?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card p-6 md:p-8 rounded-2xl card-lift group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-neon-green to-neon-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-green animate-float">
                <span className="text-4xl md:text-5xl">⚡</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-neon-green transition-colors text-center">Lightning Fast</h3>
              <p className="text-gray-400 text-base md:text-lg text-center">
                Download up to 100 images in seconds with our optimized download engine
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl card-lift group" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-cyan animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-4xl md:text-5xl">🎯</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-neon-cyan transition-colors text-center">Credit-Based</h3>
              <p className="text-gray-400 text-base md:text-lg text-center">
                Only pay for what you use. Start with 20 free credits on signup
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl card-lift group col-span-1 sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-pink animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-4xl md:text-5xl">📦</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-neon-pink transition-colors text-center">Auto ZIP</h3>
              <p className="text-gray-400 text-base md:text-lg text-center">
                All images automatically compressed and ready to download as ZIP
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 md:mb-20 text-white">
            How It Works
          </h2>

          <div className="space-y-8 md:space-y-12">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up and get 20 free credits instantly', icon: '👤' },
              { step: 2, title: 'Search Images', desc: 'Enter your keyword and select image count', icon: '🔍' },
              { step: 3, title: 'Download ZIP', desc: 'Get all images compressed in a single ZIP file', icon: '⬇️' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 glass-card p-6 md:p-8 rounded-2xl card-lift animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-2xl md:text-3xl neon-glow-green font-black text-dark-bg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-white flex items-center justify-center sm:justify-start gap-3">
                    <span>{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-base md:text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-pink/20 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}></div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 animate-slideUp text-white leading-tight">
            Start Downloading Today
          </h2>
          <p className="text-lg md:text-2xl mb-8 md:mb-12 text-gray-300 animate-fadeIn font-medium" style={{ animationDelay: '0.2s' }}>
            Get 20 free credits when you sign up. No credit card required. 🎉
          </p>
          <Link
            href="/register"
            className="inline-block w-full sm:w-auto px-12 md:px-16 py-5 md:py-6 btn-neon rounded-xl font-black text-xl md:text-2xl animate-slideUp neon-glow-green shadow-xl"
            style={{ animationDelay: '0.4s' }}
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}
