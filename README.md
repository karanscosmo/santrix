# SANKTRIX

### Autonomous Computational Intelligence Platform for Enterprise Decision-Making

Sanktrix is a next-generation, high-performance computational operating system for enterprises. Built to bridge the gap between autonomous AI reasoning and rigorous, deterministic mathematical computation, Sanktrix fuses LangGraph-driven multi-agent swarms with the Wolfram Language computational intelligence engine.

---

## 🚀 Key Features & Route Architecture

Sanktrix features a comprehensive 19-route Single Page Application architecture built in Next.js App Router and TypeScript:

1. **`Landing Page` (`/`)**: High-fidelity landing portal featuring the login gate and authentication loading sequences.
2. **`Overview Command Center` (`/dashboard`)**: Central executive dashboard highlighting live revenue forecasts, productivity indicators, and live telemetry feeds.
3. **`Executive Copilot` (`/copilot`)**: Reasoning board query client delivering Chain-of-Thought logs and actionable metrics.
4. **`Wolfram Center` (`/wolfram`)**: Primary math computational suite integrating parametric scenario modeling, Monte Carlo runs, and a symbolic notebook console.
5. **`Strategy Center` (`/strategy`)**: Corporate priority registers, risk matrices, and decision-tree sensitivity testing.
6. **`Digital Twin` (`/twin`)**: Departmental SVG organizational node graph displaying real-time risk propagation.
7. **`Knowledge Graph` (`/graph`)**: Interactive node-relationship entity inspector and vector metadata filter lists.
8. **`Agent Observatory` (`/observatory`)**: LLM observability workspace exposing LangSmith traces, tokens, latency, and step-by-step reasoning steps.
9. **`Event Fabric` (`/fabric`)**: Real-time Kafka-style message stream visualizer with live telemetry markers.
10. **`Executive Boardroom` (`/boardroom`)**: Strategic sign-offs checklist and quarterly metrics table with one-click PPTX package compile-export flows.
11. **`Business Simulations` (`/simulations`)**: Sandbox environment displaying strategic wave probability distribution curves.
12. **`AI Agents Workforce` (`/agents`)**: Unified AI deployment panel for launching and managing task-specific agent swarms.
13. **`Intelligence Feed` (`/feed`)**: Severity-graded operation logs and active market data feeds.
14. **`Knowledge Hub` (`/knowledge`)**: Semantic index retriever linking vectors, entity graphs, and documents.
15. **`Workflow Orchestration` (`/workflows`)**: Draggable node-canvas orchestrator (n8n/Temporal style) mapping anomaly triggers, AI agents, and actions.
16. **`Reports & Sources` (`/reports`)**: Generated executive packages, sync status toggles for data connectors, and a secure file upload panel.
17. **`Alerts & Settings` (`/settings`)**: API keys generator, security governance policies, active session role changer, and live centralized audit logging.
18. **`System Status` (`/status`)**: OpenTelemetry observability dashboard graphing TTFT sparklines, LLM costs, and Docker service health checkers.
19. **`Demo Center` (`/demo`)**: One-click scenario loader (e.g. Burn Rate Crisis, Churn Spike) designed for hackathon pitches and walkthroughs.

---

## 🔒 7 Security Hardening Layers

Sanktrix is hardened with enterprise security layers implemented at the application level:

*   **Layer 1: Secrets Management**: All critical integration ports are abstracted via environment variables configured in `.env.local` and `.env.example`.
*   **Layer 2: Input Schema Validation**: Strictly structured query parsing utilizing Zod schemas for user requests.
*   **Layer 3: Secure File Ingestions**: Upload validations in `reports` and `knowledge` modules rejecting files larger than 10MB, filtering extensions (`.pdf`, `.csv`, `.xlsx`, `.json`, `.txt`), and sanitizing filenames to mitigate path traversals.
*   **Layer 4: XSS Mitigation**: Strict sanitization of dynamic text and Markdown strings before rendering using `dompurify`.
*   **Layer 5: Client-Side Rate Limiter**: Core computational requests are throttled at 10 requests per minute using a stateful token-bucket rate limiter.
*   **Layer 6: Role-Based Access Control (RBAC)**: Active session roles (Admin, Executive, Analyst, Viewer) gate write access. Users with the **Viewer** role are read-only and have action triggers disabled.
*   **Layer 7: Centralized Audit Logging**: Every critical mutation (e.g., API key generation, role change, scenario execution) is recorded in a unified audit log state, visible in real time on the `/settings` page.

---

## 🛠️ Tech Stack & Styling Design

*   **Core**: Next.js 16 (App Router), React 19, TypeScript, WebGL
*   **Styling**: Modern CSS variables tailwind-configured theme bindings representing a premium obsidian dark system, responsive bento grids, custom glowing canvas backdrops, and material design icons.
*   **Validation & Sanitization**: `zod`, `dompurify`

---

## 💻 Local Setup & Development

### 1. Installation

Clone the repository and install packages:

```bash
npm install
```

### 2. Configure Environment

Copy the example file to local configurations:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Sanktrix platform.

---

## 🐳 Docker Deployment

To build and launch the Sanktrix platform container:

```bash
# Build & start container
docker-compose up --build -d

# Check running status
docker-compose ps
```

The containerized app runs on port `3000` mapped to host machine port `3000`.

---

## 🧪 QA Testing Suites

Sanktrix is configured with unit tests (Vitest) and End-to-End browser tests (Playwright):

### Run Unit & Integration Tests

Tests security RBAC rule matrices and permission boundaries:

```bash
npm run test
```

### Run End-to-End Browser Tests

Executes user navigation flows, login validation, and page routing sanity:

```bash
# Install test browsers
npx playwright install chromium

# Run tests
npx playwright test
```
