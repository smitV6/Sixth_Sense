'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="mb-8">
        <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto animate-bounce" />
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-3 text-center">Your project is ready.</h1>
      <p className="text-xl text-slate-600 mb-12 text-center max-w-lg">
        Sixth Sense has converted your idea into a developer-ready project brief.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/client/developers"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:opacity-90 transition font-semibold"
        >
          Find a Developer
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/client/projects"
          className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}
