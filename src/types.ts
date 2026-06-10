/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InterviewType = 'Algo' | 'Behavioral' | 'System Design';

export type DifficultyLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Staff';

export type JobRole = 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'System Architect';

export type InterviewerStyle = 'Friendly' | 'Neutral' | 'Strict' | 'Challenging';

export interface InterviewPreferences {
  type: InterviewType;
  difficulty: DifficultyLevel;
  role: JobRole;
  language: string; // python, javascript, typescript, java, cpp, etc.
  style: InterviewerStyle;
  topic?: string;
}

export interface ChatMessage {
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  codeSnapshot?: string; // used for technical context
}

export interface AlgorithmProblem {
  title: string;
  description: string;
  starterCode: string;
  testCases: Array<{
    input: string;
    expected: string;
  }>;
}

export interface FeedbackReport {
  overallScore: number; // 1-5 scale
  strengths: string[];
  weaknesses: string[];
  technicalAccuracyScore: number; // 1-5
  communicationSkillsScore: number; // 1-5
  answerQualityScore: number; // 1-5
  improvementSuggestions: string[];
  detailedSummary: string; // Markdown format
}

export interface InterviewSession {
  id: string;
  preferences: InterviewPreferences;
  messages: ChatMessage[];
  problem?: AlgorithmProblem;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  feedback?: FeedbackReport;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Free' | 'Starter' | 'Pro' | 'Career+';
  simulationsCompleted: number;
  role: JobRole;
  streakCount: number;
}
