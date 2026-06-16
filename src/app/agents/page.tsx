"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface Agent {
  name: string;
  role: string;
  objective: string;
  confidence: number;
  cost: string;
  impact: string;
  recentDecision: string;
  status: "Active" | "Analyzing" | "Idle";
  icon: string;
  accentColor: string;
}

const agents: Agent[] = [
  {
    name: "Market Analyst",
    role: "Market Intelligence",
    objective: "Analyzing European expansion opportunity and DACH region market dynamics",
    confidence: 91.2,
    cost: "$0.42/decision",
    impact: "+$2.1M revenue identified",
    recentDecision: "Recommended DACH-first entry strategy based on TAM analysis of 23% YoY growth",
    status: "Active",
    icon: "public",
    accentColor: "#8ab4f8",
  },
  {
    name: "Risk Forecaster",
    role: "Risk Assessment",
    objective: "Monitoring APAC supply chain disruption and enterprise churn signals",
    confidence: 94.8,
    cost: "$0.38/decision",
    impact: "3 risks mitigated this quarter",
    recentDecision: "Flagged 14 enterprise accounts with high churn probability — triggered CSM intervention",
    status: "Active",
    icon: "shield",
    accentColor: "#f28b82",
  },
  {
    name: "Strategy Planner",
    role: "Strategic Planning",
    objective: "Evaluating Q4 budget reallocation across Sales, Marketing, and Customer Success",
    confidence: 88.5,
    cost: "$0.55/decision",
    impact: "$1.8M savings identified",
    recentDecision: "Proposed shifting 8% of marketing budget to Customer Success for churn prevention",
    status: "Analyzing",
    icon: "strategy",
    accentColor: "#c4b5fd",
  },
  {
    name: "Finance Optimizer",
    role: "Financial Operations",
    objective: "Optimizing vendor payment terms and cash flow management",
    confidence: 96.1,
    cost: "$0.29/decision",
    impact: "$420K cash flow improvement",
    recentDecision: "Negotiated net-60 terms with 3 tier-2 vendors, improving quarterly cash position",
    status: "Active",
    icon: "account_balance",
    accentColor: "#4edea3",
  },
  {
    name: "Operations Analyst",
    role: "Operational Efficiency",
    objective: "Reducing enterprise customer delivery cycle time and onboarding friction",
    confidence: 93.4,
    cost: "$0.31/decision",
    impact: "14% efficiency gain this quarter",
    recentDecision: "Identified 3 onboarding bottlenecks reducing time-to-value by 8 days on average",
    status: "Active",
    icon: "speed",
    accentColor: "#f59e0b",
  },
];

export default function AgentsPage() {
  const activeCount = agents.filter(a => a.status !== "Idle").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            AI Workforce
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Autonomous AI agents working on strategic objectives across your enterprise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            {activeCount} of {agents.length} agents active
          </div>
        </div>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card !p-4">
          <span className="text-[11px] text-gray-400">Total Agents</span>
          <span className="font-display text-2xl font-bold text-white block mt-1">{agents.length}</span>
        </div>
        <div className="metric-card !p-4">
          <span className="text-[11px] text-gray-400">Avg. Confidence</span>
          <span className="font-display text-2xl font-bold text-[#4edea3] block mt-1">
            {(agents.reduce((acc, a) => acc + a.confidence, 0) / agents.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric-card !p-4">
          <span className="text-[11px] text-gray-400">Total Impact</span>
          <span className="font-display text-2xl font-bold text-[#8ab4f8] block mt-1">$4.3M+</span>
        </div>
        <div className="metric-card !p-4">
          <span className="text-[11px] text-gray-400">Avg. Cost</span>
          <span className="font-display text-2xl font-bold text-white block mt-1">$0.39/decision</span>
        </div>
      </div>

      {/* Agent Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent, idx) => (
          <div key={idx} className="agent-card space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${agent.accentColor}12`, border: `1px solid ${agent.accentColor}25` }}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ color: agent.accentColor }}>
                    {agent.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <span className="text-[11px] text-gray-500">{agent.role}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                agent.status === "Active"
                  ? "text-[#4edea3] bg-[#4edea3]/8 border-[#4edea3]/20"
                  : agent.status === "Analyzing"
                  ? "text-[#f59e0b] bg-[#f59e0b]/8 border-[#f59e0b]/20"
                  : "text-gray-500 bg-white/5 border-white/[0.06]"
              }`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                  agent.status === "Active" ? "bg-[#4edea3] animate-pulse" :
                  agent.status === "Analyzing" ? "bg-[#f59e0b] animate-pulse" : "bg-gray-500"
                }`}></span>
                {agent.status}
              </span>
            </div>

            {/* Objective */}
            <div className="bg-[#050505]/40 border border-white/[0.03] rounded-[12px] p-3.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">Current Objective</span>
              <p className="text-xs text-gray-200 leading-relaxed">{agent.objective}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-500 block mb-0.5">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="confidence-bar flex-1">
                    <div className="fill" style={{ width: `${agent.confidence}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-white">{agent.confidence}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block mb-0.5">Cost per Decision</span>
                <span className="text-xs font-bold text-white">{agent.cost}</span>
              </div>
            </div>

            {/* Impact */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-[#4edea3]">trending_up</span>
              <span className="text-[#4edea3] font-bold">{agent.impact}</span>
            </div>

            {/* Recent Decision */}
            <div className="border-t border-white/[0.04] pt-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">Latest Decision</span>
              <p className="text-[11px] text-gray-400 leading-relaxed">{agent.recentDecision}</p>
            </div>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}
