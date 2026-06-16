"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Scenario {
  id: string;
  title: string;
  question: string;
  category: string;
  accentColor: string;
  icon: string;
  results: {
    metrics: { label: string; current: string; simulated: string; direction: "up" | "down" | "neutral" }[];
    recommendation: string;
    confidence: number;
    timeHorizon: string;
  };
}

const scenarios: Scenario[] = [
  {
    id: "budget_reduction",
    title: "Budget Reduction",
    question: "What if we cut Q4 budget by 15%?",
    category: "Financial",
    accentColor: "#f59e0b",
    icon: "account_balance_wallet",
    results: {
      metrics: [
        { label: "Revenue Impact", current: "$50.2M", simulated: "$47.8M", direction: "down" },
        { label: "Margin Improvement", current: "68.4%", simulated: "72.1%", direction: "up" },
        { label: "Pipeline Coverage", current: "2.8x", simulated: "2.1x", direction: "down" },
        { label: "Runway Extension", current: "18 months", simulated: "22 months", direction: "up" },
      ],
      recommendation: "Selective cuts recommended: reduce display advertising (-$1.2M) and travel (-$400K) while protecting CSM and R&D budgets. This preserves 94% of pipeline while extending runway by 4 months.",
      confidence: 88,
      timeHorizon: "Next quarter",
    },
  },
  {
    id: "hiring_freeze",
    title: "Hiring Freeze",
    question: "Impact of 6-month hiring freeze",
    category: "Operations",
    accentColor: "#c4b5fd",
    icon: "group_off",
    results: {
      metrics: [
        { label: "Delivery Delay", current: "On track", simulated: "+45 days", direction: "down" },
        { label: "Cost Savings", current: "—", simulated: "$2.4M", direction: "up" },
        { label: "Competitive Risk", current: "Low", simulated: "Medium", direction: "down" },
        { label: "Employee Load", current: "82%", simulated: "96%", direction: "down" },
      ],
      recommendation: "A full freeze is not recommended. Instead, freeze non-critical hires and prioritize 3 engineering roles critical to the mid-market launch. Net savings: $1.6M with minimal delivery impact.",
      confidence: 91,
      timeHorizon: "6 months",
    },
  },
  {
    id: "price_increase",
    title: "Price Increase",
    question: "10% enterprise tier price hike",
    category: "Revenue",
    accentColor: "#4edea3",
    icon: "trending_up",
    results: {
      metrics: [
        { label: "Revenue Lift", current: "$50.2M", simulated: "$53.8M", direction: "up" },
        { label: "Churn Risk", current: "8%", simulated: "11.5%", direction: "down" },
        { label: "New Deal Velocity", current: "42 days", simulated: "48 days", direction: "down" },
        { label: "LTV:CAC Ratio", current: "3.2x", simulated: "3.6x", direction: "up" },
      ],
      recommendation: "Implement a grandfathered pricing strategy: existing customers retain current pricing for 12 months, new customers get the 10% increase. This yields $2.8M uplift with only 2% incremental churn risk.",
      confidence: 85,
      timeHorizon: "12 months",
    },
  },
  {
    id: "expansion",
    title: "Expansion Strategy",
    question: "Enter European market via DACH",
    category: "Growth",
    accentColor: "#8ab4f8",
    icon: "public",
    results: {
      metrics: [
        { label: "Investment Required", current: "—", simulated: "$800K", direction: "down" },
        { label: "Projected ROI", current: "—", simulated: "4.1x by Year 2", direction: "up" },
        { label: "Breakeven", current: "—", simulated: "Month 14", direction: "neutral" },
        { label: "Revenue Contribution", current: "0%", simulated: "8% of ARR", direction: "up" },
      ],
      recommendation: "Proceed with DACH-first entry. Hire a regional sales lead from the market, localize top 3 enterprise use cases, and partner with 2 regional system integrators. Projected $4.1M Year 1 revenue.",
      confidence: 86,
      timeHorizon: "18 months",
    },
  },
  {
    id: "marketing_shift",
    title: "Marketing Shift",
    question: "Move 40% budget from brand to performance",
    category: "Marketing",
    accentColor: "#f28b82",
    icon: "campaign",
    results: {
      metrics: [
        { label: "CAC Change", current: "$1,245", simulated: "$985", direction: "up" },
        { label: "Pipeline Impact", current: "$8.2M/qtr", simulated: "$9.1M/qtr", direction: "up" },
        { label: "Brand Awareness", current: "Top 5", simulated: "Top 8", direction: "down" },
        { label: "Payback Period", current: "14 months", simulated: "11 months", direction: "up" },
      ],
      recommendation: "Shift is viable for short-term gains but cap at 30% to protect brand equity. Recommend a phased approach: move 20% immediately, monitor for 60 days, then evaluate the final 10%.",
      confidence: 83,
      timeHorizon: "90 days",
    },
  },
  {
    id: "new_product",
    title: "New Product Launch",
    question: "Launch mid-market tier in Q2",
    category: "Product",
    accentColor: "#80deea",
    icon: "rocket_launch",
    results: {
      metrics: [
        { label: "TAM Expansion", current: "$180M", simulated: "$420M", direction: "up" },
        { label: "Cannibalization Risk", current: "—", simulated: "5-8% of SMB", direction: "down" },
        { label: "Revenue by Year 1", current: "—", simulated: "$6.2M", direction: "up" },
        { label: "Engineering Cost", current: "—", simulated: "$1.4M", direction: "down" },
      ],
      recommendation: "Launch is strategically sound. The mid-market tier expands TAM by 2.3x with acceptable cannibalization. Key requirement: ensure clear feature differentiation from Enterprise tier to protect ACV.",
      confidence: 79,
      timeHorizon: "12 months",
    },
  },
];

export default function SimulationsPage() {
  const { addAuditLog, checkPermission } = useSecurity();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunScenario = (scenario: Scenario) => {
    if (!checkPermission("simulation:run")) {
      alert("Access Denied: Your current role does not have permission to execute simulations.");
      return;
    }

    setIsSimulating(true);
    addAuditLog("simulation.run", `Running scenario: ${scenario.title}`, "SUCCESS");

    setTimeout(() => {
      setSelectedScenario(scenario);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Scenario Planning Lab
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Simulate business scenarios to understand impact before making decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
            6 scenarios available
          </div>
        </div>
      </header>

      {/* Scenario Cards Grid */}
      <section>
        <h2 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-4">Select a Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => handleRunScenario(s)}
              disabled={isSimulating}
              className={`scenario-card text-left ${selectedScenario?.id === s.id ? "border-[#8ab4f8]/30" : ""}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.accentColor}15`, border: `1px solid ${s.accentColor}30` }}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ color: s.accentColor }}>
                    {s.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: s.accentColor }}>{s.category}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{s.question}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {isSimulating && (
        <div className="panel-layer p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-[#8ab4f8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Running scenario simulation...</p>
        </div>
      )}

      {/* Results Panel */}
      {selectedScenario && !isSimulating && (
        <section className="panel-layer p-6 md:p-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: selectedScenario.accentColor }}>
                Simulation Results
              </span>
              <h2 className="font-display text-xl font-bold text-white mt-1">{selectedScenario.title}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{selectedScenario.question}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="confidence-bar w-20">
                <div className="fill" style={{ width: `${selectedScenario.results.confidence}%` }}></div>
              </div>
              <span className="text-sm font-bold text-white">{selectedScenario.results.confidence}%</span>
              <span className="text-[11px] text-gray-500">confidence</span>
            </div>
          </div>

          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedScenario.results.metrics.map((m, idx) => (
              <div key={idx} className="metric-card !p-4">
                <span className="text-[11px] text-gray-400 block mb-2">{m.label}</span>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-500 block">Current</span>
                    <span className="text-sm text-gray-300 font-medium">{m.current}</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-gray-600">arrow_forward</span>
                  <div className="text-center">
                    <span className="text-[10px] text-gray-500 block">Simulated</span>
                    <span className={`text-sm font-bold ${m.direction === "up" ? "text-[#4edea3]" : m.direction === "down" ? "text-[#f28b82]" : "text-white"}`}>
                      {m.simulated}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="insight-panel p-5 pl-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">lightbulb</span>
              <span className="text-[11px] text-[#4edea3] uppercase tracking-wider font-bold">AI Recommendation</span>
              <span className="ml-auto text-[11px] text-gray-500">{selectedScenario.results.timeHorizon} horizon</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{selectedScenario.results.recommendation}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setSelectedScenario(null)}
              className="btn-action btn-secondary text-[11px] py-2.5"
            >
              Try Another Scenario
            </button>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
