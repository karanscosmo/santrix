"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";
import { ExecutiveRecommendationPanel, RecommendationProps } from "@/components/ExecutiveRecommendationPanel";

interface Scenario {
  id: string;
  title: string;
  question: string;
  category: string;
  accentColor: string;
  icon: string;
  results: {
    metrics: { label: string; current: string; simulated: string; direction: "up" | "down" | "neutral" }[];
    recommendationData: RecommendationProps;
    bestCase: string;
    worstCase: string;
    expectedCase: string;
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
      recommendationData: {
        type: "RECOMMENDATION",
        title: "Selective Budget Cuts",
        context: "Broad 15% cuts damage revenue pipeline. Simulated optimal path preserves CSM and R&D.",
        action: "Reduce display advertising (-$1.2M) and travel (-$400K).",
        outcome: "Preserves 94% of pipeline while extending runway by 4 months.",
        confidence: 88,
        impact: "+4 Months Runway",
        horizon: "Next quarter"
      },
      bestCase: "24 months runway extension with no pipeline drop.",
      worstCase: "19 months runway with 12% pipeline drop.",
      expectedCase: "22 months runway with 6% pipeline drop."
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
      recommendationData: {
        type: "RISK",
        title: "Avoid Full Hiring Freeze",
        context: "A full freeze delays mid-market launch and spikes employee load to 96%.",
        action: "Freeze non-critical hires only. Prioritize 3 key engineering roles.",
        outcome: "Net savings of $1.6M with minimal delivery impact.",
        confidence: 91,
        impact: "$1.6M Savings",
        horizon: "6 months"
      },
      bestCase: "$1.8M savings with 0 day delay.",
      worstCase: "$1.2M savings with 60 day delay.",
      expectedCase: "$1.6M savings with 15 day delay."
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
      recommendationData: {
        type: "OPPORTUNITY",
        title: "Grandfathered Pricing Strategy",
        context: "A flat 10% hike risks 3.5% additional churn. Grandfathering mitigates this.",
        action: "Current customers retain pricing for 12 months. New customers see 10% increase.",
        outcome: "Yields $2.8M uplift with only 0.5% incremental churn risk.",
        confidence: 85,
        impact: "+$2.8M Uplift",
        horizon: "12 months"
      },
      bestCase: "+$3.4M uplift, 0% churn increase.",
      worstCase: "+$1.8M uplift, 2% churn increase.",
      expectedCase: "+$2.8M uplift, 0.5% churn increase."
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
      recommendationData: {
        type: "RECOMMENDATION",
        title: "Proceed with DACH Entry",
        context: "European TAM is ripe. Competitors are moving slowly in DACH region.",
        action: "Hire a regional sales lead and partner with 2 regional system integrators.",
        outcome: "Breakeven at Month 14. $4.1M Year 1 revenue.",
        confidence: 86,
        impact: "+$4.1M Rev Year 1",
        horizon: "18 months"
      },
      bestCase: "Breakeven Month 11, $5.2M Revenue.",
      worstCase: "Breakeven Month 20, $2.1M Revenue.",
      expectedCase: "Breakeven Month 14, $4.1M Revenue."
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Scenario Planning Lab
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Simulate business scenarios to understand expected outcomes before making executive decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
            4 scenarios available
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-4">Select a Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {isSimulating && (
        <div className="panel-layer p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-[#8ab4f8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Running Monte Carlo simulation (n=10,000) powered by Wolfram Kernel...</p>
        </div>
      )}

      {selectedScenario && !isSimulating && (
        <section className="mt-8 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Decision Outcome Summary</h2>
            <span className="text-[10px] text-gray-500 border border-gray-700 px-2 py-1 rounded-md uppercase tracking-wider">
              Powered by Wolfram Computational Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel-layer p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-6">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: selectedScenario.accentColor }}>
                      Scenario Simulated
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white mt-1">{selectedScenario.title}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{selectedScenario.question}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

                <div className="grid grid-cols-3 gap-4 border-t border-white/[0.04] pt-6">
                  <div>
                    <span className="text-[10px] text-[#4edea3] uppercase font-bold tracking-wider mb-1 block">Best Case</span>
                    <p className="text-xs text-gray-300">{selectedScenario.results.bestCase}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#f28b82] uppercase font-bold tracking-wider mb-1 block">Worst Case</span>
                    <p className="text-xs text-gray-300">{selectedScenario.results.worstCase}</p>
                  </div>
                  <div className="bg-[#8ab4f8]/5 p-3 rounded-lg border border-[#8ab4f8]/20">
                    <span className="text-[10px] text-[#8ab4f8] uppercase font-bold tracking-wider mb-1 block">Expected Case</span>
                    <p className="text-xs text-white font-medium">{selectedScenario.results.expectedCase}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
               <ExecutiveRecommendationPanel {...selectedScenario.results.recommendationData} />
            </div>
          </div>

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
