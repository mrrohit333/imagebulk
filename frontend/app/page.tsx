import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Neon Dark Theme */}
      <section className="relative pt-32 pb-48 px-4 overflow-hidden">
        {/* Animated Neon Particles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-neon-cyan/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 animate-slideUp">
            <span className="gradient-text">
              Download Images
            </span>
            <br />
            <span className="text-white">
              in <span className="text-neon-green">Bulk</span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeIn leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Search and download high-quality images from Pexels in bulk.
            <br className="hidden md:block" />
            Perfect for AI datasets, design projects, and content creation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/register"
              className="px-12 py-5 btn-neon rounded-xl text-xl font-black relative group overflow-hidden"
            >
              <span className="relative z-10">🚀 Get Started Free</span>
            </Link>
            <Link
              href="/pricing"
              className="px-12 py-5 glass-card hover:border-neon-cyan rounded-xl text-xl font-bold text-white"
            >
              💎 View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-20 animate-slideUp">
            Why Choose <span className="gradient-text">ImageBulk</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl card-lift group">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-neon-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-green animate-float">
                <span className="text-5xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-neon-green transition-colors">Lightning Fast</h3>
              <p className="text-gray-400 text-lg">
                Download up to 100 images in seconds with our optimized download engine
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl card-lift group" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-cyan animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-5xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-neon-cyan transition-colors">Credit-Based</h3>
              <p className="text-gray-400 text-lg">
                Only pay for what you use. Start with 20 free credits on signup
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl card-lift group" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow-pink animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-5xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-neon-pink transition-colors">Auto ZIP</h3>
              <p className="text-gray-400 text-lg">
                All images automatically compressed and ready to download as ZIP
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center mb-20 text-white">
            How It Works
          </h2>

          <div className="space-y-12">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up and get 20 free credits instantly', icon: '👤' },
              { step: 2, title: 'Search Images', desc: 'Enter your keyword and select image count', icon: '🔍' },
              { step: 3, title: 'Download ZIP', desc: 'Get all images compressed in a single ZIP file', icon: '⬇️' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 glass-card p-8 rounded-2xl card-lift animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-3xl neon-glow-green font-black text-dark-bg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                    <span>{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-pink/20 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}></div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-8 animate-slideUp text-white">
            Start Downloading Today
          </h2>
          <p className="text-2xl mb-12 text-gray-300 animate-fadeIn font-medium" style={{ animationDelay: '0.2s' }}>
            Get 20 free credits when you sign up. No credit card required. 🎉
          </p>
          <Link
            href="/register"
            className="inline-block px-16 py-6 btn-neon rounded-xl font-black text-2xl animate-slideUp neon-glow-green"
            style={{ animationDelay: '0.4s' }}
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}
