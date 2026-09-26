import Link from 'next/link';
import { ArrowRight, Briefcase, Code } from 'lucide-react';

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How are you using Sixth Sense?</h1>
          <p className="text-xl text-slate-600">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="group bg-white rounded-3xl shadow-lg border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition p-12">
            <Briefcase className="w-16 h-16 text-indigo-600 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Client</h2>
            <p className="text-slate-600 mb-8 font-semibold text-lg">Turn your idea into a better-defined project.</p>
            <ul className="space-y-3 mb-12">
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Create projects
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Improve requirements
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Discover useful features
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Find developers
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Track progress
              </li>
            </ul>
            <Link
              href="/client"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold w-full justify-center"
            >
              Continue as Client <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="group bg-white rounded-3xl shadow-lg border-2 border-slate-200 hover:border-violet-400 hover:shadow-xl transition p-12">
            <Code className="w-16 h-16 text-violet-600 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Developer</h2>
            <p className="text-slate-600 mb-8 font-semibold text-lg">Build better products with continuous AI help.</p>
            <ul className="space-y-3 mb-12">
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                Manage client projects
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                Track development
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                Connect GitHub
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                Analyze user feedback
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                Discover what to build
              </li>
            </ul>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-semibold w-full justify-center"
            >
              Continue as Developer <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
