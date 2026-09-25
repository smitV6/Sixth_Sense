import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PlaceholderPage({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <Icon className="w-16 h-16 text-indigo-400 mb-6 opacity-50" />
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-600 text-lg mb-8 max-w-md">This feature will be available in the next phase.</p>
      <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
