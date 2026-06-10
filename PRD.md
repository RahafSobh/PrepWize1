# PrepWise AI — Product Requirement Document (PRD)

## 1. Executive Summary & Vision
**PrepWise AI** is an AI-powered interactive interview simulation suite designed for software engineering candidates. The platform acts as a high-fidelity simulator for technical, system-architectural, and behavioral interviews. By aligning state-of-the-art LLM evaluations, sandboxed compiler mockups, gamified progress milestones, and structured analytics, PrepWise AI provides candidates with a realistic preparation playground.

---

## 2. Core Functional Modules

### 2.1. Dual-Screen Sandbox & Workspace
- **Algorithmic Coding (Algo Track)**: 
  - Integrated text and code editors supporting Python, JavaScript, and C++.
  - Real-time compiler simulation with automatic output streams and basic syntax highlighting.
  - Test-case evaluation parser testing code robustness against technical limits.
- **System Design Workspace**:
  - Interactive diagramming board where users can draw, modify, and connect server, cache, database, and load-balancer boxes to sketch complex distributed blueprints.
  - Interactive voice-transcription feature mimicking a candidate verbalizing their architecture under examination conditions.
- **Behavioral Arena**:
  - Rich chat and text interfaces designed for situational prompts.
  - Guides users to articulate responses following the **STAR (Situation, Task, Action, Result)** methodology.

### 2.2. Smarter Evaluator & AI Persona Configurator
- **Interviewer Style Matrix**:
  - Sets the examiner voice to presets like **Zen Master**, **Strict/Literal**, **Challenging**, or **Production Down/Incident** mode.
- **LLM Handshake Engine**:
  - Automatically submits completed sessions to the synchronous backend configured with the official Google GenAI SDK (`gemini-3.5-flash`).
  - Evaluates results across three core parameters: **Technical Accuracy**, **Communication Skills**, and **Answer Quality** (graded on a scale of `1.0` to `5.0`).

### 2.3. Analytics, SLA-Backed Scorecards, & Feedback View
- Detailed historical dashboards tracking performance metrics.
- Visual, custom SVG area graphs representing recent scoring trends.
- Specific recommendations and checklist items suggesting code refinement strategies.

---

## 3. Recently Added Custom Engagement & Gamification Features

### 3.1. Interactive Playbook & Onboarding Guide (`/src/components/OnboardingGuide.tsx`)
- **First-Time Visitors Overlay**:
  - A beautiful, sliding carousel onboarding flow featuring step-by-step guidance on how to optimize PrepWise features.
  - Automatically triggers on initial entry post-authentication and persists using a local key (`prepwise_onboarded`).
  - Fully responsive design accented with animated icons and actionable "Skip" and "Let's Code" triggers.

### 3.2. Achievements & Milestones Board (`/src/components/AchievementsSection.tsx`)
- **Tally Registry & SVG Tracker**:
  - Automatically checks completed interview sessions and tallies progress toward **six distinct, highly-polished credential badges**.
  - Interactive badges include:
    - **First Coding Session**: Awarded for completing an Algorithmic (Algo) interview challenge.
    - **STAR Expert**: Awarded for completing a Behavioral interview challenge.
    - **System Design Master**: Awarded for completing a System Design whiteboard challenge.
    - **Adrenaline Conqueror**: Awarded for completing a session under *Strict* or *Challenging* difficulty presets.
    - **FAANG Contender**: Granted once a user completes at least three total simulation rounds.
    - **Elite Score 5.0**: Reserved for candidates who achieve a perfect scoring report.
  - **Engagement Popups**: Clicking on any credential badge brings up a detailed, modern overlay explaining specific evaluation criteria, detailed insight, and qualification requirements.

### 3.3. Daily Coding Streak Tracker
- **Progressive Counter UI**:
  - Dynamic fire icon indicator (`Flame`) permanently nested in the primary dashboard utility header.
  - Interactive "Quick Log" simulation permitting users to register a persistent practice session on-demand.
  - Smooth animation, contextual hover states, and visually delightful, non-intrusive toast alerts to encourage daily habits.
  - Securely saved and persisted as a physical state value within the core `UserProfile` configuration.

### 3.4. Interview Tip of the Day Notification (`/src/components/TipOfTheDay.tsx`)
- **Snack-sized Strategic Advice**:
  - Micro-toast viewport overlay offering insights categorized by *Coding*, *Behavioral*, *System Design*, or *Mindset*.
  - **Dynamic Countdown Progress Bar**:
    - Custom dual-color timer animating line progress over a 10-second automatic fadeout path.
    - Gracefully halts countdown timers under active candidate interaction to guarantee legibility.
  - **Shuffle/Recall Controls**:
    - Explicit controls allow on-demand shuffle through an extensible advice database.
    - An unobtrusive fallback floating widget (`Lightbulb`) persists in the bottom corner of the dashboard to trigger tip review whenever needed.

---

## 4. User Profile & Subscription Matrix
- Fully isolated subscriber profiles supporting custom name customization, avatar selection, and dynamic targets.
- Simulated payment tier controls permitting preview testing of features locked under advanced tiers:
  - **Free Plan**: Allows basic entry levels.
  - **Starter, Pro, Career+ Plans**: Seamlessly unlocks special advanced mocks.

---

## 5. Technical Stack & Deployment Constraints
- **Framework**: React 18, Vite, and TypeScript.
- **Component Styling**: Clean, high-contrast Tailwind CSS utility layers.
- **Component Utilities & Icons**: Fully integrated `lucide-react` library assets.
- **Port Constraints**: Standardized development container routed exclusively via port `3000`.
- **Packaging Rules**: Unified development execution and standalone server distribution with Node type-stripping bundles.
