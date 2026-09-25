'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIAnalysisResult } from '@/lib/ai-service';
import { ProjectFormInput } from '@/lib/types';
import { AnalysisSummary } from './analysis-summary';
import { CoreRequirements } from './core-requirements';
import { MissingRequirements } from './missing-requirements';
import { OptionalAddOns } from './optional-addons';
import { ProjectBlueprint } from './project-blueprint';
import { CheckCircle2 } from 'lucide-react';

interface ProjectResultsStepProps {
  analysis: AIAnalysisResult;
  formData: ProjectFormInput;
  onFinalize: (addedRequirements: { id: string; name: string; description: string }[], addedAddOns: string[]) => void;
}

export function ProjectResultsStep({ analysis, onFinalize }: ProjectResultsStepProps) {
  const router = useRouter();
  const [addedSuggestions, setAddedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [addedAddOns, setAddedAddOns] = useState<Set<string>>(new Set());

  const handleAddSuggestion = (suggestionId: string) => {
    setAddedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const handleAddAddOn = (addOnId: string) => {
    setAddedAddOns(prev => new Set([...prev, addOnId]));
  };

  const handleAcceptAll = () => {
    analysis.missingRequirements.forEach(req => {
      if (!dismissedSuggestions.has(req.id)) {
        setAddedSuggestions(prev => new Set([...prev, req.id]));
      }
    });
  };

  const handleFinalize = () => {
    const addedRequirements = analysis.missingRequirements
      .filter(req => addedSuggestions.has(req.id))
      .map(req => ({
        id: req.id,
        name: req.title,
        description: req.description,
      }));

    const addedAddOnIds = Array.from(addedAddOns);

    onFinalize(addedRequirements, addedAddOnIds);

    // Navigate to success screen
    setTimeout(() => {
      router.push(`/client/projects/new/success`);
    }, 100);
  };

  return (
    <div className="space-y-8">
      <AnalysisSummary summary={analysis.summary} />
      <CoreRequirements requirements={analysis.coreRequirements} />

      <MissingRequirements
        suggestions={analysis.missingRequirements}
        onAdd={handleAddSuggestion}
        onDismiss={handleDismissSuggestion}
        addedSuggestions={addedSuggestions}
        dismissedSuggestions={dismissedSuggestions}
      />

      <OptionalAddOns addOns={analysis.optionalAddOns} onAdd={handleAddAddOn} addedAddOns={addedAddOns} />

      <ProjectBlueprint
        coreCount={analysis.coreRequirements.length}
        addedCount={addedSuggestions.size}
        addOnsCount={addedAddOns.size}
        health={analysis.projectHealth}
      />

      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-2xl border-2 border-indigo-200 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Finalize your project</h2>
          <div className="space-y-2 text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Core requirements: {analysis.coreRequirements.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Added requirements: {addedSuggestions.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Optional add-ons: {addedAddOns.size}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleAcceptAll}
            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
          >
            Accept All Recommended
          </button>
          <button
            onClick={handleFinalize}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:opacity-90 transition font-semibold"
          >
            Finalize Project
          </button>
        </div>
      </div>
    </div>
  );
}
