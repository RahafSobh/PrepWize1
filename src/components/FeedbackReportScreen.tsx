/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Star, ArrowLeft, RefreshCw, Layers, ThumbsUp, AlertTriangle, MessageSquare, Briefcase, BookOpen, Clock } from 'lucide-react';
import { InterviewSession, FeedbackReport } from '../types';

interface FeedbackReportScreenProps {
  session: InterviewSession;
  onClose: () => void;
  onRetake: () => void;
}

// Simple custom inline Markdown parser to style headers, lists, code, and bold texts inside the summary
function CustomMarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div id="markdown-summary-render" className="space-y-3 text-xs leading-relaxed text-zinc-700">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // H3 headers
        if (trimmed.startsWith('###')) {
          return <h4 key={idx} className="text-sm font-bold text-zinc-900 mt-5 mb-2 border-b border-zinc-100 pb-1">{trimmed.replace('###', '').trim()}</h4>;
        }
        // H4 headers
        if (trimmed.startsWith('####')) {
          return <h5 key={idx} className="text-xs font-bold text-zinc-800 mt-3 mb-1">{trimmed.replace('####', '').trim()}</h5>;
        }
        // Bullet List Items
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.substring(1).trim();
          // check for bold text like **Title**: Content
          const boldMatch = content.match(/^\*\*(.*?)\*\*(.*)$/);
          if (boldMatch) {
            return (
              <li key={idx} className="list-disc ml-4 text-zinc-650">
                <strong className="text-zinc-800 font-semibold">{boldMatch[1]}</strong>
                {boldMatch[2]}
              </li>
            );
          }
          return <li key={idx} className="list-disc ml-4 text-zinc-650">{content}</li>;
        }
        // Code quotes block
        if (trimmed.startsWith('```')) {
          return null; // hide raw wrappers
        }
        // Bold checks
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return <p key={idx} className="font-semibold text-zinc-900 mt-2">{trimmed.replace(/\*\*/g, '')}</p>;
        }

        if (trimmed === '') return <div key={idx} className="h-2" />;

        return <p key={idx}>{trimmed}</p>;
      })}
    </div>
  );
}

export default function FeedbackReportScreen({ session, onClose, onRetake }: FeedbackReportScreenProps) {
  const report = session.feedback;
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-600 bg-emerald-50 border-emerald-150';
    if (score >= 3.5) return 'text-teal-600 bg-teal-50 border-teal-150';
    if (score >= 2.5) return 'text-amber-600 bg-amber-50 border-amber-150';
    return 'text-rose-600 bg-rose-50 border-rose-150';
  };

  return (
    <div id="feedback-report-screen" className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">AI Post-Interview Assessment</h2>
          <p className="text-xs text-zinc-400">
            Synthesized report for {session.preferences.role} &bull; {session.preferences.difficulty} level &bull; Track: {session.preferences.type}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake/Practice Track</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Assessment stats & notes (Take 2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main big rating metric card */}
          <div className="p-6 md:p-8 rounded-3xl bg-radial from-neutral-900 to-black text-white relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
              
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-mono tracking-wider font-bold bg-zinc-800 border border-zinc-700/50 text-emerald-400 px-2.5 py-1 rounded-full uppercase">
                  SIM REPORT SUCCESS COEFICIENT
                </span>
                <h3 className="text-2xl font-bold text-zinc-50 tracking-tight">Technical Assessment Matrix</h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Evaluated across code completion velocity, communication flow, and optimization depth guidelines.
                </p>
              </div>

              {/* Big score indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center bg-zinc-900 shadow-xl">
                  <span className="text-3xl font-normal text-amber-400 font-mono flex items-center">
                    {report.overallScore}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold font-mono">/ 5.0</span>
                </div>
                <div className="flex items-center gap-0.5 mt-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < report.overallScore ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} 
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sub Score Bars */}
          <div className="border border-zinc-200 rounded-3xl p-6 bg-white space-y-4">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">SUB-METRICS BREAKDOWN</h4>
            
            <div className="space-y-4">
              {[
                { label: 'Technical Accuracy & Correctness', val: report.technicalAccuracyScore, desc: 'Syntax correctness, memory/time constraints analysis, trade-off awareness.' },
                { label: 'Communication & Structural Thinking', val: report.communicationSkillsScore, desc: 'Thought explanation logs, active questioning, STAR structure alignment.' },
                { label: 'Answer Quality & Optimization Depth', val: report.answerQualityScore, desc: 'Edge cases validation, corner checks, scaling architecture patterns.' }
              ].map((subScore, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-800">{subScore.label}</span>
                    <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">{subScore.val} / 5</span>
                  </div>
                  {/* Dynamic SVG styled meter bar */}
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(subScore.val / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">{subScore.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Large dynamic Markdown Summary Details */}
          <div className="border border-zinc-200 rounded-3xl p-6 md:p-8 bg-white space-y-3 shadow-xs">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Detailed Coaching Summary writeup
            </h4>
            <CustomMarkdownRenderer text={report.detailedSummary} />
          </div>

        </div>

        {/* Actionable items checklists (Take 1/3 columns) */}
        <div className="space-y-6">
          
          {/* Strengths Container */}
          <div className="border border-emerald-150 bg-emerald-50/10 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 font-mono tracking-wider uppercase flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              Core Highlights
            </h4>
            
            <div className="space-y-2 text-xs">
              {report.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white rounded-xl border border-emerald-100/50 p-3 leading-normal text-zinc-700 shadow-2xs">
                  <span className="text-emerald-600 font-bold font-mono shrink-0 select-none mt-0.5">✓</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses Container */}
          <div className="border border-amber-150 bg-amber-50/10 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-800 font-mono tracking-wider uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Omissions / Blind Spots
            </h4>
            
            <div className="space-y-2 text-xs">
              {report.weaknesses.map((wk, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white rounded-xl border border-amber-100/50 p-3 leading-normal text-zinc-700 shadow-2xs">
                  <span className="text-amber-600 font-bold font-mono shrink-0 select-none mt-0.5">!</span>
                  <span>{wk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Concrete Tips recommendations */}
          <div className="border border-zinc-200 bg-white rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-800 font-mono tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-neutral-900" />
              Practice Directives
            </h4>
            
            <ul className="space-y-2 text-xs text-zinc-500">
              {report.improvementSuggestions.map((tip, idx) => (
                <li key={idx} className="flex gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100 leading-normal text-zinc-700">
                  <span className="font-mono text-[10px] font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded shrink-0 h-5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
