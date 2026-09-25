'use client';

import { useState } from 'react';
import { ProjectFormStep } from '@/components/client/project-wizard/project-form-step';
import { ProjectAnalyzingStep } from '@/components/client/project-wizard/project-analyzing-step';
import { ProjectResultsStep } from '@/components/client/project-wizard/project-results-step';
import { ProjectFormInput } from '@/lib/types';
import { analyzeProjectRequirements, generateProjectTimeline } from '@/lib/ai-service';
import { useProjectStore } from '@/lib/project-store';
import { AIAnalysisResult } from '@/lib/ai-service';

type Step = 'form' | 'analyzing' | 'results';

export default function NewProjectPage() {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<ProjectFormInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const createProject = useProjectStore(state => state.createProject);

  const handleSubmitForm = async (data: ProjectFormInput) => {
    setFormData(data);
    setStep('analyzing');

    const result = await analyzeProjectRequirements(data);
    setAnalysisResult(result);
    setStep('results');
  };

  const handleFinalize = (addedRequirements: { id: string; name: string; description: string }[], addedAddOns: string[]) => {
    if (!formData || !analysisResult) return;

    const projectId = Math.random().toString(36).substring(2, 9);

    const newProject = {
      id: projectId,
      name: formData.name || 'Untitled Project',
      description: formData.description,
      status: 'ready_for_development' as const,
      progress: 0,
      targetUsers: formData.targetUsers,
      platform: formData.platform || 'web' as const,
      deadline: formData.deadline,
      coreRequirements: analysisResult.coreRequirements,
      addedRequirements: addedRequirements.map((req, i) => ({
        ...req,
        status: 'pending' as const,
        priority: (
          {
            's1': 'high',
            's2': 'high',
            's3': 'medium',
            's4': 'high',
          } as Record<string, any>
        )[req.id] || 'medium',
      })),
      optionalAddOns: analysisResult.optionalAddOns.map(ao =>
        addedAddOns.includes(ao.id) ? { ...ao, status: 'added' as const } : ao,
      ),
      suggestions: [],
      projectHealth: analysisResult.projectHealth,
      timeline: generateProjectTimeline(),
      summary: analysisResult.summary,
      createdAt: Date.now(),
    };

    createProject(newProject);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'form' && <ProjectFormStep onSubmit={handleSubmitForm} />}
      {step === 'analyzing' && <ProjectAnalyzingStep />}
      {step === 'results' && analysisResult && formData && (
        <ProjectResultsStep analysis={analysisResult} formData={formData} onFinalize={handleFinalize} />
      )}
    </div>
  );
}
