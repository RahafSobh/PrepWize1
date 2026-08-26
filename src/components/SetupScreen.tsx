/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Play, Settings, Shield, Laptop, HelpCircle, Flame, MessageSquare, Info } from 'lucide-react';
import { InterviewPreferences, InterviewType, DifficultyLevel, JobRole, InterviewerStyle } from '../types';

interface SetupScreenProps {
  onBack: () => void;
  onLaunch: (preferences: InterviewPreferences) => void;
  userPlan: string;
}

export default function SetupScreen({ onBack, onLaunch, userPlan }: SetupScreenProps) {
  const [type, setType] = useState<InterviewType>('Algo');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Mid-Level');
  const [role, setRole] = useState<JobRole>('Full Stack');
  const [language, setLanguage] = useState<string>('Javascript');
  const [style, setStyle] = useState<InterviewerStyle>('Neutral');
  const [topic, setTopic] = useState<string>('');
  
  // Custom list of topics for helper selection
  const quickTopics = type === 'Algo' 
    ? ['Dynamic Programming', 'Graph DFS/BFS', 'Binary Search', 'Sliding Window', 'Two Pointers']
    : type === 'System Design'
    ? ['High-scale Notification System', 'Rate Limiter', 'TinyURL Redirect Engine', 'Distributed Cache']
    : ['Handling Conflict', 'Delivering Under Pressure', 'Overcoming Failure', 'Leading Technical Shift'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch({
      type,
      difficulty,
      role,
      language: type === 'Algo' ? language : 'English',
      style,
      topic: topic.trim() || undefined
    });
  };

  return (
    <div id="setup-screen-container" className="max-w-4xl mx-auto">
      
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition text-zinc-600 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Configure Simulation Workspace</h2>
          <p className="text-xs text-zinc-500">Tailor the AI personality, track focus, and experience tailored interview cases.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main form (takes 2/3 space) */}
        <div className="md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Track Type Choice */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">1. Practice Track</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <button
                  type="button"
                  onClick={() => setType('Algo')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-28 ${
                    type === 'Algo' 
                      ? 'border-emerald-500 bg-zinc-950 text-white ring-2 ring-emerald-500/10 shadow-md' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <Laptop className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold">Algorithm</h4>
                    <p className="text-[10px] opacity-80 mt-0.5">Coding sandbox with unit tests</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('Behavioral')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-28 ${
                    type === 'Behavioral' 
                      ? 'border-emerald-500 bg-zinc-950 text-white ring-2 ring-emerald-500/10 shadow-md' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold">Behavioral</h4>
                    <p className="text-[10px] opacity-80 mt-0.5">STAR-method evaluation</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('System Design')}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-28 ${
                    type === 'System Design' 
                      ? 'border-emerald-500 bg-zinc-950 text-white ring-2 ring-emerald-500/10 shadow-md' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold">System Design</h4>
                    <p className="text-[10px] opacity-80 mt-0.5">High-scale box architectures</p>
                  </div>
                </button>

              </div>
            </div>

            <hr className="border-zinc-100" />

            {/* 2. Core Profile Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-bold text-zinc-700 font-mono">Job Role Profile</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as JobRole)}
                  className="w-full text-sm bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-hidden"
                >
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Backend">Backend Developer</option>
                  <option value="Full Stack">Full Stack Engineer</option>
                  <option value="Mobile">Mobile App Engineer</option>
                  <option value="DevOps">DevOps & Cloud Engineer</option>
                  <option value="System Architect">Principal Architect</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-bold text-zinc-700 font-mono">Seniority Expectation</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full text-sm bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-hidden"
                >
                  <option value="Junior">Junior (0-2 YOE)</option>
                  <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
                  <option value="Senior">Senior (5-8 YOE)</option>
                  <option value="Staff">Staff / Tech Lead (8+ YOE)</option>
                </select>
              </div>

            </div>

            {/* 3. Language Selection (Conditional) */}
            {type === 'Algo' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 font-mono">Programming Environment</label>
                <div className="flex flex-wrap gap-2">
                  {['Javascript', 'Typescript', 'Python', 'Java', 'C++'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                        language === lang 
                          ? 'border-emerald-500 bg-zinc-950 text-white ring-2 ring-emerald-500/10 shadow-xs' 
                          : 'border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Interviewer Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 font-mono">Interviewer Behavioral Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Friendly', desc: 'Slight hints & encouragement' },
                  { id: 'Neutral', desc: 'Standard professional SWE standard' },
                  { id: 'Strict', desc: 'Demands optimization & speed' },
                  { id: 'Challenging', desc: 'Pushes concurrency & deep scale' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id as InterviewerStyle)}
                    className={`p-3 text-left border rounded-xl transition cursor-pointer flex flex-col justify-between ${
                      style === item.id 
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-850 ring-2 ring-emerald-500/10' 
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-900">{item.id}</span>
                    <span className="text-[9px] text-zinc-400 mt-1 line-clamp-2 leading-tight">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Topic Alignment */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-700 font-mono">Focused Topic Study (Optional)</label>
                <span className="text-[10px] text-zinc-400">Specifies question focus</span>
              </div>
              
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Dynamic Programming, Consistent Hashing, Leadership struggles..."
                className="w-full text-sm bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-hidden"
              />

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-zinc-400 font-medium select-none mr-1">Quick select:</span>
                {quickTopics.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => setTopic(qt)}
                    className="text-[10px] text-zinc-650 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 px-2 py-0.5 rounded-sm font-mono transition cursor-pointer"
                  >
                    +{qt}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4.5 rounded-2xl bg-neutral-950 hover:bg-zinc-800 text-white font-medium transition duration-200 hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-white stroke-white" />
                <span className="text-sm font-semibold">Generate Simulated Session</span>
              </button>
            </div>

          </form>
        </div>

        {/* Informative Side Card (takes 1/3 space) */}
        <div className="space-y-6">
          
          <div className="bg-zinc-50 border border-zinc-150 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-800 font-mono tracking-wider uppercase flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Environment Specs & SLA
            </h4>
            
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every session compiles conversational data using Google GenAI with high-speed delivery guidelines.
            </p>

            <div className="divide-y divide-zinc-200/80 text-xs text-zinc-700">
              <div className="py-2 flex items-center justify-between">
                <span>Model Engine</span>
                <span className="font-mono text-[11px] font-bold text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded">gemini-3.5-flash</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span>Run Scope</span>
                <span className="font-mono text-[11px] text-zinc-600">Simulated IDE + speech</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span>Memory Target</span>
                <span className="font-mono text-[11px] text-zinc-600">Adaptive history</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 flex gap-3 text-amber-900">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="text-xs font-bold">Speech Transcription Enabled</p>
              <p className="text-[10px] text-amber-700/90 leading-relaxed mt-1">
                While active, click the voice mic to transcript your answers directly via Chrome Speech API. Practice explanation aloud!
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 text-white rounded-2xl p-4 text-xs space-y-2 border border-zinc-800">
            <Flame className="w-5 h-5 text-amber-400" />
            <p className="font-semibold text-zinc-200">Simulate FAANG Standards</p>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Select <span className="text-zinc-100 font-bold">Challenging</span> and <span className="text-zinc-100 font-bold">Staff level</span> to simulate a multi-round Google or Meta architectural committee.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
