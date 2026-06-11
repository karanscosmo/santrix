# Sanktrix OS

### Autonomous Computational Intelligence Platform for Enterprise Decision-Making

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://santrix-two.vercel.app/)
[![Build Status](https://img.shields.io/badge/Build-Passing-blue)](https://santrix-two.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![Wolfram Language](https://img.shields.io/badge/Wolfram-Computational-red)](https://www.wolfram.com/language/)

Sanktrix is an enterprise-grade Operating System designed to orchestrate autonomous AI agent workflows, perform high-fidelity symbolic computations, and execute real-time business simulations. By integrating enterprise data streams with LangGraph coordination swarms and the Wolfram Language, Sanktrix replaces static BI dashboards with active, audited strategic intelligence.

**Live Platform Staging:** [https://santrix-two.vercel.app/](https://santrix-two.vercel.app/)

---

## 1. Overview
Sanktrix transforms how enterprise executive suites interact with computational analytics. The platform serves as a centralized decision intelligence layer, exposing real-time business trajectories, scenario simulation workspaces, and autonomous agent swarms through a hardened, low-latency glassmorphic command center.

---

## 2. Problem Statement
Traditional Business Intelligence (BI) tools are historically retrospective. They render static data dashboards representing what happened in the past but fail to explain *why* it happened or *how* to optimize future trajectories. 

Furthermore, modern Large Language Models (LLMs) used for decision-making suffer from non-deterministic reasoning, hallucinations, and a lack of computational precision. An enterprise cannot base its supply chain routing, capital allocation, or risk profiling on speculative next-token predictions.

---

## 3. The Solution
Sanktrix bridges the gap between **neural reasoning** (AI agents) and **symbolic computation** (Wolfram Language).

* **Deterministic Computation:** AI agents reason about strategy, but delegate all math, forecasts, optimizations, and simulations to the Wolfram Language.
* **Continuous Simulation:** Sanktrix constantly stress-tests operations by running parallel Monte Carlo simulations to calculate risk distributions.
* **Active Execution:** Instead of waiting for human intervention, Sanktrix models recommendations, gates them via a granular RBAC approval chain, and triggers automated integrations.
* **Hardened Security:** Built-in rate limiting, XSS input purification, and structured audit logging verify that all programmatic actions are fully authorized and logged.

---

## 4. Architecture & System Flow

The Sanktrix platform utilizes a fluid-fixed computational loop:

```mermaid
graph TD
    A[Enterprise Data Sources] -->|Kafka / Ingestion| B[n8n / trigger.dev Pipelines]
    B -->|Ingested Payload| C[LangGraph Orchestrator Node]
    C -->|Reasoning Chains| D{Computational Task?}
    D -->|Yes| E[Wolfram symbolic Core]
    D -->|No| F[Strategic Policy Engine]
    E -->|Exact Formula Outcomes| G[Simulation Sandbox Engine]
    F -->|Operational Guardrails| G
    G -->|Parallel Projections| H[Digital Twin Graph UI]
    H -->|Secure RBAC Gate| I[Autonomous Actions / Executive Decisions]
    I -->|Log Action| J[Centralized Layer 7 Audit Log]
```

---

## 5. Wolfram Language Integration

Sanktrix queries the Wolfram Kernel to compute deterministic solutions for operations research:

* **Monte Carlo Simulations:** Evaluates probability spreads on business runways and customer churn.
* **Non-Linear Optimization:** Computes optimal resource scheduling and logistics routes.
* **Symbolic Logic Verification:** Validates that agent reasoning steps adhere to mathematical proofs.

Example expression evaluated by the Sanktrix-Wolfram compiler:
```mathematica
NIntegrate[Runway[v], {v, 0, ChurnVariance}]
```

---

## 6. AI Agent System

Sanktrix deploys a multi-agent swarm to partition operational concerns:

1. **Finance Agent:** Tracks real-time cash flow, burn rate, and optimizes departmental spend allocations.
2. **Forecasting Agent:** Predicts demand curves and automates inventory buffer sizes.
3. **Strategy Agent:** Generates competitive SWOT models and outlines market expansion scenarios.
4. **Risk Agent:** Audits compliance nodes and triggers alert flags when risk thresholds exceed boundaries.
5. **Operations Agent:** Reroutes freight logistics and schedules warehouse shifts.
6. **Wolfram Agent:** Coordinates API compile cycles and acts as the gatekeeper to the symbolic kernel.

---

## 7. Tech Stack

* **Framework:** Next.js 16 (App Router, Turbopack)
* **Frontend:** React 19, TypeScript, Vanilla CSS (PostCSS), TailwindCSS
* **Graphics:** WebGL (Custom fragment shader backgrounds), SVG Graphing
* **Testing:** Playwright (E2E), Vitest (Unit / Component)
* **Security:** Cryptographic JWT Session Management, RBAC Gating, DOMPurify
* **Deployment:** Vercel Staging Pipelines, Docker Orchestration

---

## 8. Folder Structure

The repository maintains a clean, decoupled production layout:

```
.
├── src/
│   ├── app/               # Next.js App Router (pages & layouts)
│   ├── components/        # Reusable UI components (Sidebar, Header, WebGLBackground, Watermark)
│   ├── features/          # Feature-specific components
│   │   ├── agents/        # Agent coordination components
│   │   ├── wolfram/       # Wolfram visual rendering assets
│   │   └── simulations/   # Simulation visualizer layouts
│   ├── services/          # External API layer definitions
│   ├── lib/               # Shared libraries (contains SecurityContext.tsx)
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript declaration files (contains index.ts)
│   ├── utils/             # Helper utilities
│   └── app/globals.css    # Core PostCSS tokens
├── public/
│   └── branding/          # Sanktrix transparent logo PNG asset
├── tests/                 # Unified test suite directory
│   ├── unit/              # Vitest unit test cases
│   ├── e2e/               # Playwright E2E integration tests
│   └── setup.ts           # Vitest setup file
├── docs/                  # API, specifications, and presentation deck (SANKTRIX.pptx)
└── workflows/             # n8n pipeline json templates
```

---

## 9. Installation & Setup

### Prerequisites
* Node.js v20.x or higher
* npm v10.x or higher

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karanscosmo/santrix.git
   cd santrix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 10. Environment Variables

Configure the following variables in `.env.local`:

```ini
# Core API Gateways
NEXT_PUBLIC_API_URL=http://localhost:3000

# Wolfram Symbolic Core API
WOLFRAM_APP_ID=your_wolfram_app_id
WOLFRAM_KERNEL_URL=https://api.wolframalpha.com/v1/result

# n8n / Workflow Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/sanktrix
```

---

## 11. Running Test Pass

### Unit Tests
Execute unit assertions with Vitest:
```bash
npm run test
```

### E2E Tests
Run E2E route navigation tests with Playwright:
```bash
npm run test:e2e
```

---

## 12. Deployment

Sanktrix is configured to deploy instantly on Vercel:

1. Connect your repository to Vercel.
2. Configure environment variables in the Vercel dashboard.
3. Vercel automatically runs the build optimization:
   ```bash
   npm run build
   ```

---

## 13. Screenshots

The platform utilizes a customized Obsidian dark theme featuring:
* A centerpiece high-resolution transparent logo on the homepage and onboarding overlays.
* Interactive real-time probability curve vectors.
* Granular live telemetry event streams.
* Live role override switches to evaluate RBAC permissions immediately.

---

## 14. Future Scope
* **Live Wolfram Kernel Integration:** Establish persistent WebSockets to remote Wolfram Engines.
* **On-Premise Private LLM Support:** Add configurations to swap commercial endpoints with private Llama-3 nodes.
* **Tamper-Proof Ledger Logging:** Sync audit logs to private database chains for unalterable operations records.

---

## 15. Team
* **Karan Sharma** — Principal System Architect & Lead Engineer (karanscosmo)
