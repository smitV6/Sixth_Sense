'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  'Understanding your idea...',
  'Extracting requirements...',
  'Checking for missing requirements...',
  'Finding useful opportunities...',
  'Preparing your project blueprint...',
];

export function ProjectAnalyzingStep() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-8 flex justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full animate-spin opacity-50" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 min-h-8">
          {MESSAGES[currentMessageIndex]}
        </h2>
        <p className="text-slate-600">
          Sixth Sense is analyzing your project...
        </p>
        <div className="mt-8 flex gap-1 justify-center">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-2 rounded-full transition-all ${
                i <= currentMessageIndex ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
