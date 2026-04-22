import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black font-sans">
      <main className="flex flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
            🦆 Duck OS
          </h1>
          <p className="text-xl md:text-2xl text-green-300 font-semibold">
            Life Architecture for Neurodivergent Creators
          </p>
          <p className="text-lg text-gray-400 max-w-2xl">
            Systems over willpower. Asset-building over busywork. Momentum over motivation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/momentum"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Experience ACT-04: Momentum Protocol
          </Link>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          <p>Interactive 3D Content Studio • Built with Next.js + React Three Fiber</p>
        </div>
      </main>
    </div>
  );
}
