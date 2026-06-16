"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

const metrics = [
  { name: "Enterprise Health Score", value: "94.2", unit: "", change: "+2.1% this quarter", positive: true, icon: "monitoring" },
  { name: "Forecast Confidence", value: "91.8", unit: "%", change: "Validated across 12 models", positive: true, icon: "verified" },
  { name: "Revenue Risk", value: "-8.4", unit: "%", change: "APAC churn trending up", positive: false, icon: "trending_down" },
  { name: "Operational Efficiency", value: "1.42", unit: "x", change: "+12% vs last quarter", positive: true, icon: "speed" },
  { name: "Active AI Agents", value: "5", unit: "", change: "All nominal", positive: true, icon: "smart_toy" },
  { name: "Decision Accuracy", value: "96.1", unit: "%", change: "Last 30 days", positive: true, icon: "target" },
];

const recommendations = [
  {
    problem: "APAC churn rising 8% — $2.3M ARR at risk from Tier-1 enterprise accounts",
    action: "Deploy targeted retention campaign and increase CSM coverage in APAC",
    confidence: 94.2,
    outcome: "+$2.3M ARR recovery",
    horizon: "90 days",
    category: "Revenue Forecasting",
    accentColor: "#f28b82",
  },
  {
    problem: "Q3 Marketing spend exceeding budget by 18% with declining ROAS",
    action: "Reallocate 25% of display budget to high-performing search campaigns",
    confidence: 89.1,
    outcome: "$1.8M savings with maintained pipeline",
    horizon: "60 days",
    category: "Budget Optimization",
    accentColor: "#f59e0b",
  },
  {
    problem: "European TAM growing 23% YoY — competitors entering DACH region",
    action: "Establish DACH beachhead with localized product and 3-person sales team",
    confidence: 86.4,
    outcome: "+$4.1M new revenue stream",
    horizon: "180 days",
    category: "Market Expansion",
    accentColor: "#4edea3",
  },
  {
    problem: "Enterprise segment NRR declining from 118% to 109% over 2 quarters",
    action: "Increase CSM-to-account ratio from 1:15 to 1:10 in enterprise segment",
    confidence: 91.7,
    outcome: "+340bps NRR improvement",
    horizon: "120 days",
    category: "Customer Churn",
    accentColor: "#8ab4f8",
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Command Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time strategic overview of enterprise performance and AI-driven recommendations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/simulations")}
            className="btn-action btn-primary text-[11px] py-2.5"
          >
            <span className="material-symbols-outlined text-[14px]">science</span>
            Run Scenario
          </button>
          <button
            onClick={() => router.push("/copilot")}
            className="btn-action btn-secondary text-[11px] py-2.5"
          >
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            Ask Decision AI
          </button>
        </div>
      </header>

      {/* Top Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-card flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] text-gray-400 font-medium leading-tight max-w-[80%]">{m.name}</span>
              <span className={`material-symbols-outlined text-[18px] ${m.positive ? "text-[#8ab4f8]" : "text-[#f28b82]"}`}>
                {m.icon}
              </span>
            </div>
            <div className="mt-auto pt-3">
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                {m.value}<span className="text-lg text-gray-400 font-normal">{m.unit}</span>
              </span>
              <span className={`block text-[11px] font-medium mt-1 ${m.positive ? "text-[#4edea3]" : "text-[#f28b82]"}`}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Executive Insights Panel */}
      <section className="insight-panel p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px] text-[#8ab4f8]" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
          </div>
          <span className="text-[11px] text-[#8ab4f8] uppercase font-bold tracking-widest">
            AI Strategic Intelligence Briefing
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Situation</h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              Revenue risk increased 8% due to APAC churn trends. Customer retention in Tier-1 enterprise accounts declining — 14 accounts flagged for potential churn in Q3.
            </p>
          </div>

          {/* Recommended Action */}
          <div className="space-y-2">
            <h3 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Recommended Action</h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              Increase retention budget by 12% and deploy targeted win-back campaign across APAC enterprise accounts. Assign dedicated CSMs to top 14 at-risk accounts.
            </p>
          </div>

          {/* Projected Impact */}
          <div className="space-y-3">
            <h3 className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">Projected Impact</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-[#4edea3]">+$2.3M</span>
              <span className="text-sm text-gray-400">ARR recovery</span>
            </div>
            <div className="confidence-bar">
              <div className="fill" style={{ width: "94%" }}></div>
            </div>
            <span className="text-[11px] text-gray-500">94% confidence · 90-day horizon</span>
          </div>
        </div>
      </section>

      {/* Top Recommendations Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-white">Top Recommendations</h2>
          <span className="text-[11px] text-gray-500">AI-generated · Updated 12 min ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="scenario-card group">
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    color: rec.accentColor,
                    backgroundColor: `${rec.accentColor}10`,
                    borderColor: `${rec.accentColor}25`,
                  }}
                >
                  {rec.category}
                </span>
                <span className="text-[11px] text-gray-500">{rec.horizon}</span>
              </div>

              {/* Problem */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{rec.problem}</p>

              {/* Suggested Action */}
              <div className="bg-[#050505]/40 border border-white/[0.03] rounded-[12px] p-3.5 mb-4">
                <span className="text-[10px] text-[#8ab4f8] uppercase tracking-wider font-bold block mb-1">Suggested Action</span>
                <p className="text-xs text-white leading-relaxed">{rec.action}</p>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Confidence */}
                  <div className="flex items-center gap-2">
                    <div className="confidence-bar w-16">
                      <div className="fill" style={{ width: `${rec.confidence}%` }}></div>
                    </div>
                    <span className="text-[11px] text-white font-bold">{rec.confidence}%</span>
                  </div>
                  {/* Outcome */}
                  <span className="text-[11px] text-[#4edea3] font-bold">{rec.outcome}</span>
                </div>

                <button
                  onClick={() => router.push("/simulations")}
                  className="btn-simulate text-[10px]"
                >
                  <span className="material-symbols-outlined text-[12px]">play_arrow</span>
                  Simulate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Project Overview & Demo Sandbox */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-white">Project Overview &amp; Demo Sandbox</h2>
          <span className="text-[11px] text-[#4edea3] font-bold border border-[#4edea3]/30 bg-[#4edea3]/10 px-2.5 py-1 rounded-full">Interactive Demo Mode</span>
        </div>
        
        <div className="card-layer p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-sm">Sanktrix Decision Intelligence OS</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              You are currently viewing a live interactive demo populated with enterprise sample data. Sanktrix connects directly to your ERP, CRM, and financial systems to build a continuous digital twin of your business. It runs thousands of Monte Carlo simulations to forecast outcomes and recommend strategic executive actions.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => router.push("/simulations")} className="btn-action btn-primary text-[11px] py-2">
                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                Run Live Scenarios
              </button>
              <button className="btn-action btn-secondary text-[11px] py-2 text-gray-300">
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                Reset Sandbox Data
              </button>
            </div>
          </div>
          
          <div className="bg-[#050505]/60 border border-white/[0.05] rounded-[14px] p-5 flex flex-col justify-center items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#8ab4f8]">cable</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Ready for Production?</h4>
              <p className="text-[11px] text-gray-500 mt-1 mb-3">Connect your actual data sources securely.</p>
              <button className="w-full btn-action bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] py-1.5 transition-colors">
                Connect Integrations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Sanktrix Advantage Comparison */}
      <section className="pt-4 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-white">Platform Comparison</h2>
          <span className="text-[11px] text-gray-500">Competitive Landscape</span>
        </div>
        
        <div className="panel-layer overflow-hidden border border-white/[0.05] rounded-[16px]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0d0f14] border-b border-white/[0.05]">
                <th className="p-5 font-bold text-gray-400">Capability</th>
                <th className="p-5 font-bold text-[#8ab4f8]">Sanktrix OS</th>
                <th className="p-5 font-bold text-gray-500">Legacy BI Tools</th>
                <th className="p-5 font-bold text-gray-500">Generic LLMs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-5 font-medium text-white">Autonomous Actions</td>
                <td className="p-5"><span className="material-symbols-outlined text-[#4edea3]">check_circle</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-5 font-medium text-white">Continuous Simulation</td>
                <td className="p-5"><span className="material-symbols-outlined text-[#4edea3]">check_circle</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-[#f59e0b]">circle</span></td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-5 font-medium text-white">Wolfram Mathematical Rigor</td>
                <td className="p-5"><span className="material-symbols-outlined text-[#4edea3]">check_circle</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
              </tr>
              <tr className="hover:bg-white/[0.01] transition-colors">
                <td className="p-5 font-medium text-white">Live Digital Twin</td>
                <td className="p-5"><span className="material-symbols-outlined text-[#4edea3]">check_circle</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-[#f59e0b]">circle</span></td>
                <td className="p-5"><span className="material-symbols-outlined text-gray-600">cancel</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
