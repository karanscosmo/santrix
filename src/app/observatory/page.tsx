"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface TraceDetail {
  run: string;
  input: string;
  status: string;
  statusColor: string;
  latency: string;
  time: string;
  cot: Array<{ type: "thought" | "success" | "process"; label: string; text: string }>;
  memory: Array<{ key: string; val: string }>;
  tokens: string;
  id: string;
}

export default function AgentObservatoryPage() {
  const { addAuditLog } = useSecurity();
  const [selectedTraceId, setSelectedTraceId] = useState<string>("trace-1");

  const traces: Record<string, TraceDetail> = {
    "trace-1": {
      id: "trace_89a741f",
      run: "MarketingOptimization",
      input: '{ budget_realloc: "$150,000", shift_from: "display", shift_to: "search" }',
      status: "Success",
      statusColor: "text-tertiary",
      latency: "842ms",
      time: "Just now",
      cot: [
        {
          type: "thought",
          label: "Thought 1",
          text: "The executive user requested budget optimization. I need to calculate display ad conversion ratios.",
        },
        {
          type: "thought",
          label: "Thought 2",
          text: "Display ads yield 1.2% conversions; Search ads yield 4.8%. Wolfram optimization model suggested.",
        },
        {
          type: "thought",
          label: "Thought 3",
          text: "Initializing Wolfram cloud math kernels. Simulating runway shifts...",
        },
        {
          type: "success",
          label: "Success",
          text: "Model parameters verified. Runway extension of 2.2 months estimated.",
        },
      ],
      memory: [
        { key: "pinecone.embeddings.vector_key", val: "idx_mkt_arr_8912" },
        { key: "temporal.workflow.id", val: "wf_mkt_alloc_90a" },
        { key: "crewai.agent.role", val: "Strategic Allocations Analyst" },
      ],
      tokens: "Input: 4,096 | Output: 1,024",
    },
    "trace-2": {
      id: "trace_84a123a",
      run: "ChurnMonteCarlo",
      input: '{ run_samples: 50000, target_metric: "RunwayFactor", parameter_churn: "+20%" }',
      status: "Success",
      statusColor: "text-tertiary",
      latency: "14ms",
      time: "2m ago",
      cot: [
        { type: "thought", label: "Thought 1", text: "Received stress-test request for 20% Churn Spike." },
        {
          type: "thought",
          label: "Thought 2",
          text: "Building parameter matrices for Wolfram Kernel. Monte Carlo distribution model activated.",
        },
        {
          type: "success",
          label: "Success",
          text: "50,000 sample runs evaluated. Cumulative runway shift calculated.",
        },
      ],
      memory: [
        { key: "wolfram.kernel.id", val: "kernel_sub_891a" },
        { key: "montecarlo.samples.size", val: "50000" },
        { key: "confidence_intervals.alpha", val: "0.95" },
      ],
      tokens: "Input: 1,512 | Output: 512",
    },
    "trace-3": {
      id: "trace_78d90fa",
      run: "LeadGenerationSDR",
      input: '{ query: "SaaS Enterprise Prospects in EU", email_frequency: "daily" }',
      status: "Running",
      statusColor: "text-secondary",
      latency: "1.2s",
      time: "5m ago",
      cot: [
        {
          type: "thought",
          label: "Thought 1",
          text: "SDR Agent triggered. Querying internal memory banks for past converters.",
        },
        {
          type: "thought",
          label: "Thought 2",
          text: "Retrieving prospects matching sector filters. Scheduling email sequence workflows.",
        },
        {
          type: "process",
          label: "Processing",
          text: "n8n workflow active. Enqueueing email templates.",
        },
      ],
      memory: [
        { key: "pinecone.query", val: "SaaS decision makers EU" },
        { key: "n8n.webhook.url", val: "n8n_sdr_eu_webhook" },
        { key: "crewai.lead_evaluator", val: "Active" },
      ],
      tokens: "Input: 8,192 | Output: 2,048",
    },
  };

  const handleSelectTrace = (id: string) => {
    setSelectedTraceId(id);
    addAuditLog("observatory.select_trace", `Selected agent trace: ${id}`, "SUCCESS");
  };

  const activeTrace = traces[selectedTraceId] || traces["trace-1"];

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Observatory telemetry header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          <div className="glass-panel p-sm rounded-xl">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Total Agent Calls
            </span>
            <h3 className="font-mono text-xl text-primary font-bold mt-1">12,482</h3>
          </div>
          <div className="glass-panel p-sm rounded-xl">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Average Latency
            </span>
            <h3 className="font-mono text-xl text-tertiary font-bold mt-1">840ms</h3>
          </div>
          <div className="glass-panel p-sm rounded-xl">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              OpenAI Tokens Spent
            </span>
            <h3 className="font-mono text-xl text-secondary font-bold mt-1">4.2M</h3>
          </div>
          <div className="glass-panel p-sm rounded-xl">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Observatory Status
            </span>
            <h3 className="font-mono text-xl text-tertiary font-bold mt-1">Nominal</h3>
          </div>
        </div>

        {/* Row 2: Run traces (Left) & Agent Reasoner (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Run Traces Panel */}
          <div className="lg:col-span-5 glass-panel rounded-xl p-md flex flex-col h-[520px] justify-between">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">Agent Run Traces</h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">LANGSMITH PIPELINE LOGGER</p>
              </div>
              <span className="text-[10px] font-mono text-outline">LIVE LOGGER</span>
            </div>

            <div className="flex-grow overflow-y-auto space-y-xs my-md pr-xs">
              {Object.entries(traces).map(([key, t]) => {
                const isActive = selectedTraceId === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectTrace(key)}
                    className={`w-full text-left cursor-pointer border p-sm rounded flex flex-col gap-1 transition-all ${
                      isActive
                        ? "bg-primary-container/10 border-l-2 border-primary border-outline-variant"
                        : "hover:bg-surface-container border-l-2 border-outline border-outline-variant"
                    }`}
                  >
                    <div className="flex justify-between text-[11px] font-mono font-bold text-on-surface">
                      <span>run: {t.run}</span>
                      <span className={t.statusColor}>{t.latency}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant line-clamp-1">{t.input}</p>
                    <span className="text-[9px] text-outline">
                      ID: {t.id} • {t.time}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-mono">Filter: Runs with error (0)</span>
              <button
                onClick={() => alert("Redirecting to advanced logs link...")}
                className="text-primary hover:underline font-semibold uppercase text-[10px]"
              >
                Advanced Link
              </button>
            </div>
          </div>

          {/* Agent Reasoning & Memory traces */}
          <div className="lg:col-span-7 glass-panel rounded-xl p-md flex flex-col h-[520px] justify-between relative overflow-hidden">
            <div className="stream-pulse"></div>
            <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                  Chain-of-Thought & Memory Workspace
                </h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">INTERNAL AGENT LOGIC AND CONTEXT</p>
              </div>
              <span className="material-symbols-outlined text-outline">psychology</span>
            </div>

            <div className="flex-grow overflow-y-auto my-md space-y-md pr-xs font-mono text-xs">
              <div className="space-y-sm">
                <span className="font-sans text-xs text-primary block font-semibold uppercase tracking-wider">
                  RUN DETAILS: {activeTrace.run}
                </span>
                <div className="bg-surface-container p-sm rounded border border-outline-variant flex flex-col gap-1">
                  <span className="text-on-surface-variant font-bold uppercase text-[9px]">INPUT PRESET</span>
                  <span className="text-on-surface">{activeTrace.input}</span>
                </div>
              </div>

              <div className="space-y-xs">
                <span className="text-xs text-on-surface font-bold uppercase text-[9px]">REASONING CHAIN (CoT)</span>
                <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm space-y-2 text-on-surface-variant text-[11px]">
                  {activeTrace.cot.map((step, sIdx) => (
                    <div key={sIdx}>
                      <strong
                        className={
                          step.type === "success"
                            ? "text-tertiary"
                            : step.type === "process"
                            ? "text-secondary"
                            : "text-primary"
                        }
                      >
                        {step.label}:
                      </strong>{" "}
                      {step.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-xs">
                <span className="text-xs text-on-surface font-bold uppercase text-[9px]">
                  MEMORY VALUES (Short Term Cache)
                </span>
                <div className="bg-surface-container p-sm rounded border border-outline-variant text-[11px] text-on-surface-variant">
                  {activeTrace.memory.map((mem, mIdx) => (
                    <div key={mIdx}>
                      <strong>{mem.key}:</strong> {mem.val}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-mono">Tokens Used: {activeTrace.tokens}</span>
              <button
                onClick={() => alert("Displaying active flow visualization model...")}
                className="bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase px-sm py-sm rounded hover:bg-primary-container transition-all cursor-pointer"
              >
                View Flow Graph
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
