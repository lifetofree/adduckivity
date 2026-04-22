import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Momentum Protocol",
      description: "Action over motivation. Build momentum when you don't feel like it.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260408-IMG-ACT-04-MOMENTUM.webp?fit=768%2C432&ssl=1",
      href: "/content/momentum-protocol",
      badge: "Article + 3D"
    },
    {
      title: "Digital Declutter",
      description: "Clear the noise. Reclaim your focus and system speed.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260407-IMG-SURV-DIGITAL-DECLUTTER.webp?fit=768%2C432&ssl=1",
      href: "https://wp.adduckivity.com/survival/digital-declutter-system-speed-up-survival-protocol",
      badge: "SURV-01"
    },
    {
      title: "System Awareness",
      description: "See the invisible systems running your life.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260408-IMG-AWARE-01-INVISIBLE-SYSTEMS.webp?fit=768%2C432&ssl=1",
      href: "https://wp.adduckivity.com/system-awareness/system-awareness-visible-architecture",
      badge: "Foundation"
    },
    {
      title: "Flow State Architecture",
      description: "Turn scattered focus into sustained deep work.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260405-cnt-act-02-cover.webp?fit=768%2C432&ssl=1",
      href: "https://wp.adduckivity.com/system-in-action/architecture-of-flow-duck-os-protocol",
      badge: "Advanced"
    },
    {
      title: "Single-Tasking Protocol",
      description: "Stop multitasking. Start mastering deep work.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260407-cnt-prod-01-cover-single-tasking.webp?fit=768%2C432&ssl=1",
      href: "https://wp.adduckivity.com/productivity-hacks/stop-scattered-focus-single-tasking-protocol-2026",
      badge: "Productivity"
    },
    {
      title: "Vibe Coding",
      description: "Ship ideas to production in one night with AI.",
      image: "https://i0.wp.com/wp.adduckivity.com/wp-content/uploads/2026/04/20260412-IMG-PROD-VIBE-CODE-ADDUCK.webp?fit=768%2C432&ssl=1",
      href: "https://wp.adduckivity.com/protocols/vibe-code-idea-to-production-one-night-ai-spec",
      badge: "Systems"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Adduckivity Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-semibold text-xl text-gray-900">Adduckivity</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/momentum" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              3D Experience
            </Link>
            <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Blog
            </a>
            <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Tools
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-8">
            <Image 
              src="/logo.png" 
              alt="Adduckivity Logo"
              width={80}
              height={80}
              className="rounded-xl mb-8"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Duck OS
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
            Life Architecture for Neurodivergent Creators
          </p>
          
          <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl">
            Systems over willpower. Asset-building over busywork. Momentum over motivation.
            Build your life operating system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/content/momentum-protocol"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              Read Momentum Protocol
            </Link>
            <Link 
              href="/momentum"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg border border-gray-300 transition-colors"
            >
              3D Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-200">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Protocols
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Evidence-based systems for ADHD/MDD creators who need more than motivation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link 
              key={index}
              href={feature.href}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={768}
                    height={432}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Adduckivity Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-gray-900">Adduckivity</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                Blog
              </a>
              <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                Tools
              </a>
              <a href="https://github.com/lifetofree/adduckivity" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                GitHub
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Powered by Duck OS Systems
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
