"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface TraceDetail {
  id: string;
  run: string;
  input: string;
  status: "Success" | "Running" | "Idle" | "Blocked";
  latency: string;
  time: string;
  cot: Array<{ type: "thought" | "success" | "process"; label: string; text: string }>;
  memory: Array<{ key: string; val: string }>;
  tokens: string;
  cost: string;
  health: number;
  progress: number;
  reasoningDepth: number;
}

export default function AgentObservatoryPage() {
  const { addAuditLog } = useSecurity();
  const [selectedTraceId, setSelectedTraceId] = useState<string>("trace-1");

  const traces: Record<string, TraceDetail> = {
    "trace-1": {
      id: "trace_89a741f",
      run: "MarketingOptimizer Swarm",
      input: '{ budget_realloc: "$150,000", shift_from: "display", shift_to: "search" }',
      status: "Success",
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
      cost: "$12.42/hr",
      health: 98,
      progress: 100,
      reasoningDepth: 4,
    },
    "trace-2": {
      id: "trace_84a123a",
      run: "ChurnMonteCarlo Swarm",
      input: '{ run_samples: 50000, target_metric: "RunwayFactor", parameter_churn: "+20%" }',
      status: "Idle",
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
      cost: "$4.10/hr",
      health: 99,
      progress: 100,
      reasoningDepth: 3,
    },
    "trace-3": {
      id: "trace_78d90fa",
      run: "LeadGenerationSDR Swarm",
      input: '{ query: "SaaS Enterprise Prospects in EU", email_frequency: "daily" }',
      status: "Running",
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
      cost: "$18.50/hr",
      health: 95,
      progress: 68,
      reasoningDepth: 3,
    },
  };

  const handleSelectTrace = (id: string) => {
    setSelectedTraceId(id);
    addAuditLog("observatory.select_trace", `Selected agent trace: ${id}`, "SUCCESS");
  };

  const activeTrace = traces[selectedTraceId] || traces["trace-1"];

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Agent Observatory
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Agent Operations Center | Active agent status, memory, and reasoning traces.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Active Swarms: 18 Swarms
          </div>
          <button
            onClick={() => alert("Diagnostic Swarm check launched successfully.")}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Diagnostic Swarm
          </button>
        </div>
      </header>

      {/* 2. Top Overview Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Agent Calls", val: "12,482", color: "text-[#8ab4f8]" },
          { label: "Average Latency", val: "840ms", color: "text-[#4edea3]" },
          { label: "OpenAI Tokens Spent", val: "4.2M", color: "text-[#8ab4f8]" },
          { label: "Observatory Status", val: "NOMINAL", color: "text-[#4edea3]" },
        ].map((item, idx) => (
          <div key={idx} className="card-layer p-4">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block">{item.label}</span>
            <span className={`font-display text-lg font-bold block mt-2 ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </section>

      {/* 3. Main Split View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* Left: Agent Swarm Cards (Col 5) */}
        <section className="lg:col-span-5 panel-layer p-5 flex flex-col h-[560px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">Agent swarm metrics</h3>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">LANGSMITH TELEMETRY REGISTRY</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {Object.entries(traces).map(([key, t]) => {
              const isActive = selectedTraceId === key;
              const isRunning = t.status === "Running";
              return (
                <button
                  key={key}
                  onClick={() => handleSelectTrace(key)}
                  className={`w-full text-left cursor-pointer border p-4 rounded-[18px] flex flex-col gap-3 transition-all ${
                    isActive
                      ? "bg-[#8ab4f8]/5 border-[#8ab4f8]/30 shadow-[0_0_15px_rgba(138,180,248,0.1)] text-white"
                      : "bg-[#050505]/40 border-white/[0.04] hover:border-white/[0.15] text-gray-400"
                  }`}
                >
                  {/* Top line: Status, Name, Pulse animation */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white font-mono">{t.run}</span>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-[#4edea3] animate-pulse" : "bg-gray-500"}`}></span>
                      <span className={isRunning ? "text-[#4edea3]" : "text-gray-500"}>{t.status.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Task progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-gray-500">
                      <span>TASK PROGRESS</span>
                      <span>{t.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8ab4f8] rounded-full" style={{ width: `${t.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Bottom metrics grid: tokens, health, cost, reasoning depth */}
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-gray-400 pt-2 border-t border-white/[0.03]">
                    <div>
                      <span className="text-gray-500 text-[8px] block">HEALTH / COST</span>
                      <span className="text-white font-bold">{t.health}% • {t.cost}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[8px] block">REASONING DEPTH</span>
                      <span className="text-[#8ab4f8] font-bold">Thought {t.reasoningDepth}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right: Agent Reasoning Workspace (Col 7) */}
        <section className="lg:col-span-7 panel-layer p-5 flex flex-col h-[560px] justify-between relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8ab4f8]/30 to-transparent"></div>
          
          <div>
            <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-display text-sm font-bold text-white tracking-wide">
                  Chain-of-Thought Logic Workspace
                </h3>
                <p className="font-mono text-[9px] text-gray-500 mt-0.5">INTERNAL TRACES AND LOCAL VECTOR CACHE</p>
              </div>
              <span className="material-symbols-outlined text-[#8ab4f8]">psychology</span>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 font-mono text-[10px] max-h-[390px] scrollbar-thin">
              {/* input preset */}
              <div className="space-y-1">
                <span className="text-gray-500 text-[8px] font-bold uppercase tracking-wider block">INPUT PARAMS</span>
                <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03] text-white font-light">
                  {activeTrace.input}
                </div>
              </div>

              {/* CoT steps */}
              <div className="space-y-1">
                <span className="text-gray-500 text-[8px] font-bold uppercase tracking-wider block">REASONING CHAIN</span>
                <div className="bg-[#050505]/60 border border-white/[0.03] rounded-[12px] p-3.5 space-y-2.5 text-[10px] text-gray-300">
                  {activeTrace.cot.map((step, sIdx) => {
                    let labelColor = "text-[#8ab4f8]";
                    if (step.type === "success") labelColor = "text-[#4edea3]";
                    if (step.type === "process") labelColor = "text-amber-400";
                    return (
                      <div key={sIdx} className="leading-relaxed flex items-start gap-1 font-light">
                        <span className="text-gray-600 shrink-0">&raquo;</span>
                        <div>
                          <strong className={`${labelColor} font-bold`}>{step.label}:</strong>{" "}
                          <span>{step.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cache Memory */}
              <div className="space-y-1">
                <span className="text-gray-500 text-[8px] font-bold uppercase tracking-wider block">
                  VECTOR EMBEDDINGS CACHE
                </span>
                <div className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03] space-y-1.5 text-[10px] text-gray-400">
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

          {/* Bottom trace actions */}
          <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center text-[10px] font-mono">
            <span className="text-gray-500">TOKENS: {activeTrace.tokens}</span>
            <button
              onClick={() => alert("Displaying SVG schema visualization model...")}
              className="btn-action btn-primary text-[10px] py-2"
            >
              Visualize Flow Path
            </button>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
