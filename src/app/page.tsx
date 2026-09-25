import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, MessageSquare, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Sixth Sense
          </Link>
          <Link href="/onboarding" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Try Sixth Sense
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Your product's sixth sense.</h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Know what was requested. See what was built. Understand what users want. Know what to do next.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
              >
                Try Sixth Sense <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition font-semibold">
                See How It Works
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center text-sm font-semibold">
              <div className="flex-1 bg-indigo-50 p-4 rounded-xl text-slate-900">CLIENT REQUIREMENTS</div>
              <div className="text-2xl text-indigo-600">↓</div>
              <div className="flex-1 bg-indigo-50 p-4 rounded-xl text-slate-900">DEVELOPMENT</div>
              <div className="text-2xl text-indigo-600">↓</div>
              <div className="flex-1 bg-indigo-50 p-4 rounded-xl text-slate-900">USER FEEDBACK</div>
              <div className="text-2xl text-indigo-600">↓</div>
              <div className="flex-1 bg-violet-600 p-4 rounded-xl text-white">SIXTH SENSE AI</div>
              <div className="text-2xl text-indigo-600">↓</div>
              <div className="flex-1 bg-indigo-50 p-4 rounded-xl text-slate-900">INSIGHTS</div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Three perspectives. One intelligence.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition">
                <Zap className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Requirement Intelligence</h3>
                <p className="text-slate-600">Turn client ideas into structured requirements and discover what may be missing.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition">
                <BarChart3 className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Development Intelligence</h3>
                <p className="text-slate-600">Understand development progress and identify requirements that still need attention.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition">
                <MessageSquare className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">User Intelligence</h3>
                <p className="text-slate-600">Turn large amounts of user feedback into clear product insights.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">One intelligence layer. Three perspectives.</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-900 mb-2">CLIENT</div>
                <p className="text-blue-800 font-semibold">What should be built?</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-900 mb-2">DEVELOPER</div>
                <p className="text-purple-800 font-semibold">What has been built?</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl border border-pink-200">
                <div className="text-3xl font-bold text-pink-900 mb-2">USERS</div>
                <p className="text-pink-800 font-semibold">What are people experiencing?</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-violet-100 p-8 rounded-2xl border border-indigo-300">
                <div className="text-3xl font-bold text-indigo-900 mb-2">SIXTH SENSE</div>
                <p className="text-indigo-800 font-semibold">What should happen next?</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Build with your sixth sense.</h2>
            <p className="text-xl text-indigo-100 mb-8">Join the teams transforming product development with AI-powered intelligence.</p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
            >
              Start Demo <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
