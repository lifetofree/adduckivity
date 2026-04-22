import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black font-sans">
      {/* Navigation Header with Logo */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="Adduckivity Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-white font-semibold text-lg">Adduckivity</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/momentum" className="text-gray-300 hover:text-white transition-colors">
            3D Experience
          </Link>
          <a href="https://wp.adduckivity.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            Blog
          </a>
          <a href="https://duckshort.cc" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            Tools
          </a>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center gap-8 px-6 py-12 text-center pt-24">
        <div className="space-y-6">
          {/* Logo Hero */}
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Adduckivity Logo"
              width={120}
              height={120}
              className="rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              Duck OS
            </h1>
            <p className="text-xl md:text-2xl text-green-300 font-semibold">
              Life Architecture for Neurodivergent Creators
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Systems over willpower. Asset-building over busywork. Momentum over motivation.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/momentum"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg shadow-lg hover:shadow-green-500/25"
          >
            Experience ACT-04: Momentum Protocol
          </Link>
        </div>

        <div className="mt-12 text-gray-500 text-sm space-y-2">
          <p>Interactive 3D Content Studio • Built with Next.js + React Three Fiber</p>
          <p className="text-gray-600">Powered by Duck OS Systems</p>
        </div>
      </main>
    </div>
  );
}
