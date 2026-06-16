"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { ExecutiveRecommendationPanel, RecommendationProps } from "@/components/ExecutiveRecommendationPanel";

const metrics = [
  { name: "Enterprise Health Score", value: "94.2", unit: "", change: "+2.1% this quarter", positive: true, icon: "monitoring" },
  { name: "Forecast Confidence", value: "91.8", unit: "%", change: "Validated across 12 models", positive: true, icon: "verified" },
  { name: "Revenue Risk", value: "-8.4", unit: "%", change: "APAC churn trending up", positive: false, icon: "trending_down" },
  { name: "Operational Efficiency", value: "1.42", unit: "x", change: "+12% vs last quarter", positive: true, icon: "speed" },
  { name: "Active AI Agents", value: "5", unit: "", change: "All nominal", positive: true, icon: "smart_toy" },
  { name: "Decision Accuracy", value: "96.1", unit: "%", change: "Last 30 days", positive: true, icon: "target" },
];

const priorities: RecommendationProps[] = [
  {
    type: "RECOMMENDATION",
    title: "Strategic Pricing Adjustment",
    context: "Enterprise segment NRR declining. Competitors are increasing base pricing.",
    action: "Increase enterprise base pricing by 15% and offer a 5% annual discount.",
    outcome: "+$3.2M ARR",
    confidence: 91,
    impact: "High",
    horizon: "30 days"
  },
  {
    type: "RISK",
    title: "APAC Churn Warning",
    context: "APAC churn rising 8% — $2.3M ARR at risk from Tier-1 enterprise accounts.",
    action: "Deploy targeted retention campaign and increase CSM coverage in APAC.",
    outcome: "Prevent -$1.8M Churn",
    confidence: 89,
    impact: "Critical",
    horizon: "90 days"
  },
  {
    type: "OPPORTUNITY",
    title: "DACH Market Expansion",
    context: "European TAM growing 23% YoY — competitors entering DACH region.",
    action: "Establish DACH beachhead with localized product and 3-person sales team.",
    outcome: "+$4.1M Revenue Stream",
    confidence: 86,
    impact: "Medium",
    horizon: "180 days"
  }
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardLayout>
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6 mb-8">
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

      {/* EXECUTIVE PRIORITIES - Front and Center */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#8ab4f8] text-2xl">local_fire_department</span>
          <h2 className="font-display text-2xl font-bold text-white">EXECUTIVE PRIORITIES</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {priorities.map((item, idx) => (
            <ExecutiveRecommendationPanel key={idx} {...item} />
          ))}
        </div>
      </section>

      {/* Top Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
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

      {/* Project Overview & Demo Sandbox */}
      <section className="pt-4 mb-12">
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
              <button onClick={() => router.push("/dashboard?tour=1")} className="btn-action btn-primary text-[11px] py-2">
                <span className="material-symbols-outlined text-[14px]">menu_book</span>
                Start Guided Tour
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
    </DashboardLayout>
  );
}
