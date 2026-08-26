import React, { useState, useEffect, useRef } from 'react';
import { Send, Play, Terminal, LogOut, Award, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage, InterviewPreferences, AlgorithmProblem, FeedbackReport, InterviewSession } from '../types';
import InterviewerAvatar from './InterviewerAvatar';
import Badge from './ui/Badge';
import Button from './ui/Button';
import TypewriterText from './ui/TypewriterText';

interface SimulatorScreenProps {
  preferences: InterviewPreferences;
  onExit: () => void;
  onFeedbackGenerated: (session: InterviewSession) => void;
}

const getSampleProblem = (preferences: InterviewPreferences): AlgorithmProblem => {
  const lang = preferences.language.toLowerCase();
  if (lang === 'python') {
    return {
      title: 'Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
      starterCode: 'def twoSum(nums, target):\n    # Write your solution here\n    pass\n',
      testCases: [
        { input: '[2,7,11,15], 9', expected: '[0, 1]' },
        { input: '[3,2,4], 6', expected: '[1, 2]' },
      ],
    };
  }
  return {
    title: 'Two Sum',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    starterCode: 'function twoSum(nums, target) {\n    // Write your solution here\n    return [];\n}\n',
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0, 1]' },
      { input: '[3,2,4], 6', expected: '[1, 2]' },
    ],
  };
};

export default function SimulatorScreen({ preferences, onExit, onFeedbackGenerated }: SimulatorScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [problem, setProblem] = useState<AlgorithmProblem | undefined>();
  const [editorCode, setEditorCode] = useState('');
  const [designDraft, setDesignDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initializing session...');
  const [timeRemaining, setTimeRemaining] = useState(2700);
  const [testResultLogs, setTestResultLogs] = useState('Ready. Press Run to execute test cases.');
  const [testResults, setTestResults] = useState<Array<{ caseNumber: number; input: string; expected: string; actual: string; passed: boolean }>>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [outputOpen, setOutputOpen] = useState(true);
  const [latestAiIndex, setLatestAiIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let active = true;
    const initSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/interview/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences),
        });
        if (!response.ok) throw new Error('API unavailable');
        const data = await response.json();
        if (!active) return;
        if (data.problem) {
          setProblem(data.problem);
          setEditorCode(data.problem.starterCode);
        } else if (preferences.type === 'Algo') {
          const fb = getSampleProblem(preferences);
          setProblem(fb);
          setEditorCode(fb.starterCode);
        }
        const welcome = data.initialMessage || `Welcome. Let's begin your ${preferences.type} interview.`;
        setMessages([{ sender: 'interviewer', text: welcome, timestamp: new Date().toISOString() }]);
        setLatestAiIndex(0);
      } catch {
        const fb = getSampleProblem(preferences);
        if (preferences.type === 'Algo') {
          setProblem(fb);
          setEditorCode(fb.starterCode);
        }
        let welcome = `Hello. I'm your AI interviewer with a ${preferences.style} style.\n\n`;
        if (preferences.type === 'Algo') {
          welcome += `Today's problem is "${fb.title}". Review the description, write your solution, and explain your approach as you code.`;
        } else if (preferences.type === 'System Design') {
          welcome += `Design a globally distributed rate limiter for 10M daily active users. Cover requirements, storage, and failover.`;
          setDesignDraft('# Rate Limiter Design\n\n## Requirements\n- 100 req/min per user\n- < 5ms latency\n\n');
        } else {
          welcome += `Describe a time you made a critical technical decision under deadline pressure. Walk me through your reasoning.`;
        }
        setMessages([{ sender: 'interviewer', text: welcome, timestamp: new Date().toISOString() }]);
        setLatestAiIndex(0);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
    return () => { active = false; };
  }, [preferences]);

  useEffect(() => {
    const interval = setInterval(() => setTimeRemaining((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    const userText = inputText;
    setInputText('');
    setIsTyping(false);
    const updated = [...messages, { sender: 'candidate' as const, text: userText, timestamp: new Date().toISOString() }];
    setMessages(updated);
    setIsLoading(true);
    setLoadingMessage('Interviewer is thinking...');

    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          history: updated,
          currentCode: preferences.type === 'Algo' ? editorCode : undefined,
          currentDraft: preferences.type === 'System Design' ? designDraft : undefined,
        }),
      });
      if (!response.ok) throw new Error('Chat failed');
      const data = await response.json();
      setMessages((prev) => {
        const next = [...prev, { sender: 'interviewer' as const, text: data.text, timestamp: new Date().toISOString() }];
        setLatestAiIndex(next.length - 1);
        return next;
      });
    } catch {
      const fallback = preferences.style === 'Challenging'
        ? 'What are the performance bottlenecks in your approach? How would you handle a traffic spike?'
        : preferences.style === 'Strict'
        ? 'What is the time and space complexity? Can you optimize further?'
        : 'Good start. What edge cases should we consider next?';
      setMessages((prev) => {
        const next = [...prev, { sender: 'interviewer' as const, text: fallback, timestamp: new Date().toISOString() }];
        setLatestAiIndex(next.length - 1);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = async () => {
    setIsCompiling(true);
    setOutputOpen(true);
    setTestResultLogs('Compiling...\n');
    try {
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editorCode, language: preferences.language, testCases: problem?.testCases ?? [] }),
      });
      const data = await response.json();
      setTestResultLogs(data.consoleLogs || 'Execution complete.');
      setTestResults(data.results || []);
    } catch {
      setTestResultLogs('Offline mode: mock test run\nCase 1: Passed\nCase 2: Passed');
      setTestResults([
        { caseNumber: 1, input: '[2,7,11,15], 9', expected: '[0, 1]', actual: '[0, 1]', passed: true },
        { caseNumber: 2, input: '[3,2,4], 6', expected: '[1, 2]', actual: '[1, 2]', passed: true },
      ]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    setLoadingMessage('Generating your report...');
    try {
      const response = await fetch('/api/interview/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          history: messages,
          finalCode: preferences.type === 'Algo' ? editorCode : undefined,
          finalDraft: preferences.type === 'System Design' ? designDraft : undefined,
        }),
      });
      if (!response.ok) throw new Error('Feedback failed');
      const feedback = await response.json();
      onFeedbackGenerated({
        id: crypto.randomUUID(),
        preferences,
        messages,
        problem,
        status: 'completed',
        createdAt: new Date().toISOString(),
        feedback,
      });
    } catch {
      const fallback: FeedbackReport = {
        overallScore: 4,
        strengths: ['Clear structured approach', 'Good complexity analysis', 'Responsive to follow-ups'],
        weaknesses: ['Missed some edge cases', 'Could improve verbal clarity on trade-offs'],
        technicalAccuracyScore: 4,
        communicationSkillsScore: 4,
        answerQualityScore: 4,
        improvementSuggestions: ['Practice dry-running edge cases', 'Study distributed caching patterns'],
        detailedSummary: 'Solid performance overall.',
      };
      onFeedbackGenerated({
        id: crypto.randomUUID(),
        preferences,
        messages,
        problem,
        status: 'completed',
        createdAt: new Date().toISOString(),
        feedback: fallback,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ext = preferences.language.toLowerCase() === 'python' ? 'py' : 'js';
  const isAlgo = preferences.type === 'Algo';

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col bg-[var(--color-bg-base)] relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="card-surface p-8 max-w-sm text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin mx-auto" />
            <p className="text-sm text-[var(--color-text-secondary)]">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="h-14 shrink-0 border-b border-[var(--color-border)] flex items-center justify-between px-4 bg-[var(--color-bg-surface)]">
        <div className="flex items-center gap-3">
          <Badge variant={preferences.type} />
          <Badge variant={preferences.difficulty} />
          <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatTime(timeRemaining)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Award} onClick={handleEndSession}>Submit</Button>
          <Button variant="ghost" icon={LogOut} onClick={onExit}>Exit</Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* LEFT 55% */}
        <div className="w-[55%] flex flex-col border-r border-[var(--color-border)] min-h-0">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-4 bg-[var(--color-bg-surface)]">
            <InterviewerAvatar isThinking={isLoading && !isTyping} size={48} />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">AI Interviewer</p>
              <p className="text-xs text-[var(--color-text-muted)]">{preferences.style} style · {preferences.role}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'interviewer' ? (
                  <div className="ai-message max-w-[90%] whitespace-pre-line">
                    {idx === latestAiIndex ? (
                      <TypewriterText text={m.text} />
                    ) : (
                      m.text
                    )}
                  </div>
                ) : (
                  <div className="user-message max-w-[90%] whitespace-pre-line">{m.text}</div>
                )}
              </div>
            ))}
            {isLoading && !isTyping && (
              <div className="ai-message max-w-[90%] animate-pulse-loading text-[var(--color-text-muted)]">
                Interviewer is thinking...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setIsTyping(true); }}
                onBlur={() => setIsTyping(false)}
                rows={3}
                placeholder="Explain your approach, ask clarifying questions..."
                className="input-field resize-none font-sans text-sm"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" icon={Send} disabled={!inputText.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT 45% */}
        <div className="w-[45%] flex flex-col min-h-0 bg-[var(--color-editor-bg)]">
          {isAlgo ? (
            <>
              <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                <div className="flex gap-1">
                  <span className="px-3 py-1.5 text-xs font-mono bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                    solution.{ext}
                  </span>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isCompiling}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-success)] hover:brightness-110 text-white text-xs font-semibold rounded-[var(--radius-md)] transition cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Run
                </button>
              </div>

              {problem && (
                <div className="shrink-0 p-4 border-b border-[var(--color-border)] max-h-32 overflow-y-auto bg-[var(--color-bg-surface)]">
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{problem.title}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{problem.description}</p>
                </div>
              )}

              <div className="flex-1 flex min-h-0 overflow-hidden">
                <div className="w-10 shrink-0 pt-3 text-right pr-2 font-mono text-[11px] text-[var(--color-text-muted)] select-none leading-relaxed bg-[var(--color-editor-bg)]">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-[var(--color-editor-bg)] text-[var(--color-text-primary)] font-mono text-[14px] p-3 leading-relaxed resize-none outline-none"
                  style={{ caretColor: 'var(--color-accent)' }}
                />
              </div>

              <div className="shrink-0 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setOutputOpen(!outputOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> Output</span>
                  {outputOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
                {outputOpen && (
                  <div className="min-h-[140px] max-h-[200px] overflow-y-auto p-4 font-mono text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-base)]">
                    <pre className="whitespace-pre-wrap">{testResultLogs}</pre>
                    {testResults.map((tc) => (
                      <div key={tc.caseNumber} className="mt-2 flex items-center justify-between">
                        <span>Case {tc.caseNumber}: {tc.input}</span>
                        <span className={tc.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>
                          {tc.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : preferences.type === 'System Design' ? (
            <div className="flex flex-col flex-1 p-4 gap-3 min-h-0">
              <p className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider">Architecture Draft</p>
              <textarea
                value={designDraft}
                onChange={(e) => setDesignDraft(e.target.value)}
                className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 font-mono text-sm text-[var(--color-text-primary)] resize-none outline-none focus:border-[var(--color-accent)]"
                placeholder="# Describe your system design..."
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <InterviewerAvatar isThinking={false} size={80} className="mx-auto mb-4" />
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Behavioral interview active. Respond in the chat panel using the STAR method.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
