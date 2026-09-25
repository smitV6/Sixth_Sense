'use client';

import { useState } from 'react';
import { ProjectFormInput, Platform, Deadline } from '@/lib/types';
import { Wand2 } from 'lucide-react';

interface ProjectFormStepProps {
  onSubmit: (data: ProjectFormInput) => void;
}

export function ProjectFormStep({ onSubmit }: ProjectFormStepProps) {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [platform, setPlatform] = useState<Platform>('web');
  const [deadline, setDeadline] = useState<Deadline>('2-3_months');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ description, name, targetUsers, platform, deadline });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Tell us what you want to build.</h1>
        <p className="text-lg text-slate-600">
          Describe your idea in your own words. Sixth Sense will turn it into a structured project and identify things
          you may have missed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Project Description *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="E.g., I want to build an attendance management system where teachers can mark attendance and students can view their percentage..."
            className="w-full h-40 p-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 resize-none"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="E.g., CampusConnect, FitFlow, FoodHub..."
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Target Users</label>
            <input
              type="text"
              value={targetUsers}
              onChange={e => setTargetUsers(e.target.value)}
              placeholder="E.g., college students and teachers, fitness enthusiasts..."
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Expected Platform</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value as Platform)}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            >
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="web_mobile">Web + Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Approximate Deadline</label>
            <select
              value={deadline}
              onChange={e => setDeadline(e.target.value as Deadline)}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            >
              <option value="1-2_weeks">1–2 weeks</option>
              <option value="1_month">1 month</option>
              <option value="2-3_months">2–3 months</option>
              <option value="3+_months">3+ months</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
        >
          <Wand2 className="w-5 h-5" />
          Analyze with Sixth Sense
        </button>
      </form>
    </div>
  );
}
