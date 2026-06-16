"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Scenario {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  targetUrl: string;
  loadingTitle: string;
  loadingSubtitle: string;
}

export default function DemoPage() {
  const router = useRouter();
  const { addAuditLog, checkPermission, rateLimitCheck } = useSecurity();
  const [runningScenario, setRunningScenario] = useState<Scenario | null>(null);

  const scenarios: Scenario[] = [
    {
      id: "burn",
      name: "Burn Rate Crisis",
      desc: "Simulate cash runway dropping to 6 months. Activates Wolfram Runway Optimizer.",
      icon: "trending_down",
      color: "hover:border-error text-error",
      targetUrl: "/wolfram?action=forecast",
      loadingTitle: "Simulating Runway Collapse (Burn Rate Crisis)...",
      loadingSubtitle: "Wolfram kernel invoking Monte Carlo risk factors..."
    },
    {
      id: "churn",
      name: "Churn Spike",
      desc: "Simulate a sudden 20% churn increase. Highlights risk propagation across departments.",
      icon: "warning",
      color: "hover:border-secondary text-secondary",
      targetUrl: "/twin?scenario=churn",
      loadingTitle: "Simulating Sudden 20% Churn Spike...",
      loadingSubtitle: "Propagating risk signals through department networks..."
    },
    {
      id: "market",
      name: "Market Expansion",
      desc: "Simulate EU expansion scenario. Prompts tax optimization calculations.",
      icon: "language",
      color: "hover:border-primary text-primary",
      targetUrl: "/strategy?scenario=eu",
      loadingTitle: "Simulating EU Market Expansion Math...",
      loadingSubtitle: "Running multi-country tax optimization variables..."
    },
    {
      id: "hiring",
      name: "Hiring Forecast",
      desc: "Simulate double-speed headcount growth. Tracks cash runout variance.",
      icon: "group_add",
      color: "hover:border-primary text-primary",
      targetUrl: "/wolfram?action=forecast",
      loadingTitle: "Simulating Double-Speed Hiring Plan...",
      loadingSubtitle: "Evaluating capital burn versus sprint velocity yield..."
    },
    {
      id: "revenue",
      name: "Revenue Targets",
      desc: "Simulate hitting target revenue 3 months ahead of schedule.",
      icon: "trending_up",
      color: "hover:border-tertiary text-tertiary",
      targetUrl: "/strategy?scenario=revenue",
      loadingTitle: "Recalculating Target ARR Milestones...",
      loadingSubtitle: "Generating executive briefing for presentation..."
    }
  ];

  const runScenario = (scenario: Scenario) => {
    if (!checkPermission("simulation:run")) {
      alert("Unauthorized: Viewer credentials cannot trigger demo simulations.");
      return;
    }

    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again shortly.");
      return;
    }

    setRunningScenario(scenario);
    addAuditLog("demo.run_scenario", `Started demo scenario: ${scenario.name}`, "SUCCESS");

    setTimeout(() => {
      setRunningScenario(null);
      router.push(scenario.targetUrl);
    }, 2000);
  };

  return (
    <DashboardLayout>
      {/* Fullscreen Loader Overlay */}
      {runningScenario && (
        <div className="fixed inset-0 bg-surface-lowest/90 backdrop-blur-xl z-[150] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-primary"></div>
          <h3 className="font-display text-2xl text-on-surface mt-8">{runningScenario.loadingTitle}</h3>
          <p className="font-mono text-on-surface-variant text-xs mt-4 animate-pulse">{runningScenario.loadingSubtitle}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant pb-6 mb-md">
        <div>
          <h2 className="font-display text-4xl text-on-surface">Demo Control Center</h2>
          <p className="font-mono text-xs text-on-surface-variant">One-click scenarios for hackathon pitch validation and user flow stress tests.</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-tertiary font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary pulse-indicator"></span>
            <span>5 Prebuilt Contexts Loaded</span>
          </div>
          <button 
            onClick={() => router.push("/dashboard?tour=1&auto=true")}
            className="bg-[#8ab4f8] text-[#050505] font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 hover:bg-[#a8c7fa] transition-colors shadow-[0_0_15px_rgba(138,180,248,0.2)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">videocam</span>
            Run Automated Video Demo
          </button>
        </div>
      </div>

      <div className="space-y-6 pb-8">
        {/* Scenarios Grid */}
        <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
          <div className="stream-pulse"></div>
          <div className="border-b border-outline-variant/30 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-display text-base text-on-surface">Interactive Hackathon Pitch Scenarios</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">SELECT A SCENARIO TO AUTO-LOAD TELEMETRY AND COMPUTE CONSTRAINTS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 my-4">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => runScenario(sc)}
                className={`bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-all p-6 rounded-xl flex flex-col justify-between text-left h-[190px] cursor-pointer group ${sc.color}`}
              >
                <div>
                  <span className="material-symbols-outlined text-2xl">{sc.icon}</span>
                  <h4 className="font-display text-sm font-semibold text-on-surface mt-4">{sc.name}</h4>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed mt-2 group-hover:text-on-surface transition-colors">
                    {sc.desc}
                  </p>
                </div>
                <span className="text-[9px] font-mono mt-auto uppercase tracking-wider group-hover:underline flex items-center gap-1">
                  Trigger Flow <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stack explanations & Walkthrough guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Architecture Block */}
          <div className="lg:col-span-7 glass-panel rounded-xl p-6">
            <div className="border-b border-outline-variant/30 pb-4 mb-sm">
              <h3 className="font-display text-base text-on-surface">Sanktrix Platform Stack Integration</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">THE COMPUTATIONAL OS DEPLOYMENT TOPOLOGY</p>
            </div>

            <div className="space-y-4 my-6 text-xs text-on-surface-variant leading-relaxed">
              <div className="flex gap-6 items-start">
                <span className="bg-primary-container/10 text-primary border border-primary/25 px-2 py-1 rounded font-mono text-[9px] uppercase w-28 text-center shrink-0">AI Layer</span>
                <p>
                  <strong className="text-on-surface">LangGraph + CrewAI Workforce Swarm:</strong> Generates self-correcting logic chains and handles multi-agent task brokerage (visualized on Agent Observatory).
                </p>
              </div>
              <div className="flex gap-6 items-start">
                <span className="bg-primary-container/10 text-primary border border-primary/25 px-2 py-1 rounded font-mono text-[9px] uppercase w-28 text-center shrink-0">Compute Core</span>
                <p>
                  <strong className="text-on-surface">Wolfram Computational Kernel:</strong> Executes parametric equations, Monte Carlo trials (n=50,000), and symbolic notebook inputs in under 20ms.
                </p>
              </div>
              <div className="flex gap-6 items-start">
                <span className="bg-primary-container/10 text-primary border border-primary/25 px-2 py-1 rounded font-mono text-[9px] uppercase w-28 text-center shrink-0">Automation</span>
                <p>
                  <strong className="text-on-surface">n8n / Temporal Orchestrations:</strong> Executes real-time event-driven tasks and hooks directly to Slack webhooks, Stripe events, and data lakes.
                </p>
              </div>
              <div className="flex gap-6 items-start">
                <span className="bg-primary-container/10 text-primary border border-primary/25 px-2 py-1 rounded font-mono text-[9px] uppercase w-28 text-center shrink-0">Data Fabrics</span>
                <p>
                  <strong className="text-on-surface">Supabase + PostgreSQL + Pinecone + ClickHouse:</strong> Hybrid semantic vector indexer and analytical store for fast twin synchronization.
                </p>
              </div>
            </div>
          </div>

          {/* Pitch Deck guide */}
          <div className="lg:col-span-5 glass-panel rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-outline-variant/30 pb-4 mb-2">
                <h3 className="font-display text-base text-on-surface">Pitch Deck &amp; Judge Walkthrough</h3>
                <p className="font-mono text-[9px] text-on-surface-variant mt-1">STRATEGIC PRESENTATION SEQUENCING</p>
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed space-y-4 my-6 pr-2 overflow-y-auto">
                <p>
                  1. <strong className="text-on-surface">The Paradigm Shift:</strong> Pitch Sanktrix as the first real &apos;Computational OS&apos; that connects corporate strategic execution to a deterministic mathematical core.
                </p>
                <p>
                  2. <strong className="text-on-surface">The Crisis Walkthrough:</strong> Fire the <em>Burn Rate Crisis</em>. Present the Wolfram curve shifted downstream. evaluatively command `/forecast Runway` on the CMD+K bar.
                </p>
                <p>
                  3. <strong className="text-on-surface">The Governance Close:</strong> Toggle roles in <em>Settings</em>. Demonstrate that Viewer permissions prevent system config write actions.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-outline-variant/30 text-[9px] font-mono text-on-surface-variant">
              Pitch deck sync profile: Hackathon Pitch Deck V2
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
