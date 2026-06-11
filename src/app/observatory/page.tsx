"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

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
          <div className="glass-panel p-md rounded-xl hover:border-white/10 transition-colors">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Total Agent Calls
            </span>
            <h3 className="font-mono text-2xl text-primary font-bold mt-1.5">12,482</h3>
          </div>
          <div className="glass-panel p-md rounded-xl hover:border-white/10 transition-colors">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Average Latency
            </span>
            <h3 className="font-mono text-2xl text-tertiary font-bold mt-1.5">840ms</h3>
          </div>
          <div className="glass-panel p-md rounded-xl hover:border-white/10 transition-colors">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              OpenAI Tokens Spent
            </span>
            <h3 className="font-mono text-2xl text-secondary-fixed-dim font-bold mt-1.5">4.2M</h3>
          </div>
          <div className="glass-panel p-md rounded-xl hover:border-white/10 transition-colors">
            <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
              Observatory Status
            </span>
            <h3 className="font-mono text-2xl text-tertiary font-bold mt-1.5 uppercase">Nominal</h3>
          </div>
        </div>

        {/* Row 2: Run traces (Left) & Agent Reasoner (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md pb-8">
          
          {/* Run Traces Panel */}
          <div className="lg:col-span-5 glass-panel rounded-xl p-md flex flex-col h-[540px] justify-between">
            <div>
              <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
                <div>
                  <h3 className="font-display text-headline-md text-on-surface text-[18px]">Agent Run Traces</h3>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">LANGSMITH PIPELINE LOGGER</p>
                </div>
                <span className="text-[10px] font-mono text-outline font-bold tracking-wider uppercase">LIVE LOGGER</span>
              </div>

              <div className="overflow-y-auto space-y-sm my-md pr-xs max-h-[380px]">
                {Object.entries(traces).map(([key, t]) => {
                  const isActive = selectedTraceId === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTrace(key)}
                      className={`w-full text-left cursor-pointer border p-md rounded-xl flex flex-col gap-1.5 transition-all ${
                        isActive
                          ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(0,219,231,0.05)] text-white"
                          : "bg-[#050505]/40 border-white/5 hover:border-white/15 text-on-surface-variant"
                      }`}
                    >
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span className="text-white">run: {t.run}</span>
                        <span className={t.statusColor}>{t.latency}</span>
                      </div>
                      <p className="text-[10px] font-light font-sans truncate">{t.input}</p>
                      <span className="text-[9px] font-mono text-on-surface-variant/75 uppercase tracking-wider mt-0.5 block">
                        ID: {t.id} • {t.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-md border-t border-outline-variant/30 flex justify-between items-center text-xs mt-md">
              <span className="text-on-surface-variant/75 font-mono">Filter: Runs with error (0)</span>
              <button
                onClick={() => alert("Redirecting to advanced logs link...")}
                className="text-primary hover:text-primary-container font-semibold uppercase text-[10px] cursor-pointer transition-colors"
              >
                Advanced Link
              </button>
            </div>
          </div>

          {/* Agent Reasoning & Memory traces */}
          <div className="lg:col-span-7 glass-panel rounded-xl p-md flex flex-col h-[540px] justify-between relative overflow-hidden">
            <div className="stream-pulse"></div>
            <div>
              <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
                <div>
                  <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                    Chain-of-Thought &amp; Memory Workspace
                  </h3>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">INTERNAL AGENT LOGIC AND CONTEXT</p>
                </div>
                <span className="material-symbols-outlined text-outline">psychology</span>
              </div>

              <div className="overflow-y-auto space-y-md pr-xs font-mono text-xs max-h-[380px]">
                <div className="space-y-sm">
                  <span className="font-sans text-[10px] text-primary block font-bold uppercase tracking-wider">
                    RUN DETAILS: {activeTrace.run}
                  </span>
                  <div className="bg-[#050505]/40 p-md rounded-xl border border-white/5 flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold uppercase text-[9px] tracking-wider">INPUT PRESET</span>
                    <span className="text-white font-light">{activeTrace.input}</span>
                  </div>
                </div>

                <div className="space-y-xs">
                  <span className="text-xs text-on-surface-variant font-bold uppercase text-[9px] tracking-wider block mb-1">REASONING CHAIN (CoT)</span>
                  <div className="bg-[#050505]/60 border border-white/5 rounded-xl p-md space-y-2.5 text-[11px]">
                    {activeTrace.cot.map((step, sIdx) => {
                      const labelColor =
                        step.type === "success"
                          ? "text-tertiary"
                          : step.type === "process"
                          ? "text-secondary"
                          : "text-primary";

                      return (
                        <div key={sIdx} className="leading-relaxed flex items-start gap-1 font-light">
                          <span className="text-primary/45 shrink-0">&raquo;</span>
                          <div>
                            <strong className={`${labelColor} font-bold`}>{step.label}:</strong>{" "}
                            <span className="text-on-surface-variant">{step.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-xs">
                  <span className="text-xs text-on-surface-variant font-bold uppercase text-[9px] tracking-wider block mb-1">
                    MEMORY VALUES (Short Term Cache)
                  </span>
                  <div className="bg-[#050505]/40 p-md rounded-xl border border-white/5 text-[11px] text-on-surface-variant/80 space-y-1.5 font-light leading-relaxed">
                    {activeTrace.memory.map((mem, mIdx) => (
                      <div key={mIdx} className="flex gap-2">
                        <strong className="text-white shrink-0">{mem.key}:</strong> 
                        <span className="truncate">{mem.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-md border-t border-outline-variant/30 flex justify-between items-center text-xs mt-md">
              <span className="text-on-surface-variant font-mono">Tokens Used: {activeTrace.tokens}</span>
              <button
                onClick={() => alert("Displaying active flow visualization model...")}
                className="bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-lg hover:bg-primary-container transition-all cursor-pointer glow-button"
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
