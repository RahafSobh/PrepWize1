/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, HelpCircle, Laptop, Shield, Award, Terminal, Play, Star, BookOpen, Layers } from 'lucide-react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: 'Pick Your Track & Vibe 🎯',
    subtitle: 'Step 1: Calibration & Persona Setup',
    description: 'PrepWise AI fully personalizes the simulation to your target role (e.g. Frontend, Backend, Architect) and difficulty level. Set your interviewer style from "Zen Master" to "Strict" or "Production Down" mode!',
    icon: Laptop,
    badge: 'WORKSPACE CONFIG',
    highlight: 'Interviewer calibration adjusts feedback strictness and code compilation rules.'
  },
  {
    title: 'Interactive Sandbox Environment ⚙️',
    subtitle: 'Step 2: Dual Screen Coding & Whiteboarding',
    description: 'Write solutions in Python or JavaScript in our live editor, compile on-the-fly, or draft a full system design sketch with custom node boxes. Use real-time voice recognition to capture your thought process.',
    icon: Terminal,
    badge: 'INTEGRATED SANDBOX',
    highlight: 'The terminal parser evaluates test cases and simulates an actual FAANG interview IDE.'
  },
  {
    title: 'Gemini-3.5-Flash Evaluation Handshake 🧠',
    subtitle: 'Step 3: Submit for Real-time Review',
    description: 'Our synchronous backend proxies the Google GenAI SDK to assess your answers. The review compiles scores across Technical Accuracy, Communication verbal clarity, and Edge-Case mitigation.',
    icon: Sparkles,
    badge: 'LLM EVALUATION',
    highlight: 'Always explain trade-offs to score double in systemic and architectural structures.'
  },
  {
    title: 'SLA-Backed Performance Dashboard 📈',
    subtitle: 'Step 4: Track Progress & Historical Trends',
    description: 'Check your performance charts, read comprehensive constructive reports, and unlock recommended study paths from global metrics. Test your limits with our simulated pricing tier access controls.',
    icon: Award,
    badge: 'PROGRESS ANALYTICS',
    highlight: 'Progress trends auto-unlock after completing two or more target assessments.'
  }
];

export default function OnboardingGuide({ isOpen, onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepInfo = ONBOARDING_STEPS[currentStep];
  const StepIcon = stepInfo.icon;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('prepwise_onboarded', 'true');
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('prepwise_onboarded', 'true');
    onClose();
  };

  return (
    <div id="onboarding-guide-overlay" className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
      
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between max-h-[92vh]">
        
        {/* Abstract Background Accents */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-850">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-950 tracking-tight font-display">PrepWise AI Onboarding Playbook</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Frictionless Interactive Sandbox Guide</p>
            </div>
          </div>
          <button 
            id="onboarding-skip-top-btn"
            onClick={handleSkip}
            className="text-[10px] font-bold font-mono text-zinc-400 hover:text-zinc-800 transition px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 cursor-pointer"
          >
            SKIP TOUR
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-6 flex-1 relative z-10">
          
          {/* Step Progress Tracker Bars */}
          <div className="flex gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div 
                key={index} 
                className="flex-1 h-1.5 rounded-full transition-all duration-300 relative"
              >
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-emerald-500 w-full' : 'bg-zinc-100 w-0'
                  }`} 
                />
              </div>
            ))}
          </div>

          {/* Graphical Step Display Card */}
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 flex justify-center">
              <div className="w-24 h-24 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white shadow-lg animate-pulse relative">
                <StepIcon className="w-10 h-10 text-emerald-400" />
                <span className="absolute -bottom-2 -right-2 bg-amber-400 text-zinc-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Step {currentStep + 1}
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-2">
              <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {stepInfo.badge}
              </span>
              <p className="text-[11px] font-semibold font-mono text-zinc-400 tracking-wider">
                {stepInfo.subtitle}
              </p>
              <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">
                {stepInfo.title}
              </h4>
              <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                {stepInfo.description}
              </p>
            </div>

          </div>

          {/* Quick Highlight Info banner */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100/80 rounded-xl flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div className="text-xs text-zinc-700 font-sans">
              <span className="font-bold text-emerald-800">Pro tip: </span>
              {stepInfo.highlight}
            </div>
          </div>

        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between border-t border-zinc-150 pt-5 mt-6 relative z-10">
          
          <button
            id="onboarding-back-btn"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-200 transition select-none ${
              currentStep === 0 ? 'opacity-30 pointer-events-none text-zinc-300' : 'text-zinc-600 hover:bg-zinc-50 bg-white cursor-pointer active:scale-95'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="text-xs font-mono font-bold text-zinc-400">
            {currentStep + 1} / {ONBOARDING_STEPS.length}
          </div>

          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-950 hover:bg-zinc-900 text-white transition cursor-pointer active:scale-95 shadow-sm"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                Let's Code! <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              </>
            ) : (
              <>
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
