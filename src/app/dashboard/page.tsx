"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface LogFeedItem {
  id: string;
  time: string;
  icon: string;
  text: string;
  color: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [liveLogs, setLiveLogs] = useState<LogFeedItem[]>([
    { id: "log_1", time: "Just now", icon: "support_agent", text: "Forecasting Agent running on Q3 Projections", color: "text-[#8ab4f8]" },
    { id: "log_2", time: "2m ago", icon: "model_training", text: "Risk Simulation completed - Variance minimal", color: "text-amber-500" },
    { id: "log_3", time: "15m ago", icon: "error", text: "Burn Rate anomaly detected in Marketing", color: "text-red-400" },
    { id: "log_4", time: "1h ago", icon: "sync", text: "Data Lake sync complete - 2.4TB processed", color: "text-[#8ab4f8]" },
  ]);

  // Simulate incoming real-time telemetry events
  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        "Wolfram Kernel computed Monte Carlo optimization pipeline",
        "n8n Workflow triggered for SDR agent task assignment",
        "Realtime Event Fabric processed 1,200 events/sec",
        "Pinecone vector space indexing completed successfully",
        "Executive Copilot compiled quarterly briefing report",
      ];
      const icons = ["functions", "account_tree", "stream", "database", "smart_toy"];
      const colors = ["text-amber-500", "text-[#8ab4f8]", "text-[#4edea3]", "text-[#8ab4f8]", "text-amber-500"];

      const randomIdx = Math.floor(Math.random() * logs.length);
      const newLog: LogFeedItem = {
        id: `log_${Date.now()}`,
        time: "Just now",
        icon: icons[randomIdx],
        text: logs[randomIdx],
        color: colors[randomIdx],
      };

      setLiveLogs(prev => {
        const updated = [newLog, ...prev.map(l => l.time === "Just now" ? { ...l, time: "1m ago" } : l)];
        return updated.slice(0, 5);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Command Center
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Enterprise Model: Active Twin | 16 Compute Kernels Syncing
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            Health: 98.2%
          </div>
          {/* Context Actions */}
          <button 
            onClick={() => router.push("/simulations")}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Run Scenario Lab
          </button>
          <button 
            onClick={() => router.push("/copilot")}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            Ask Copilot
          </button>
        </div>
      </header>

      {/* 2. Hero KPI Row: 5 Premium Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { name: "Revenue Impact", val: "$24.8M", change: "+14.2% QoQ", positive: true, icon: "payments" },
          { name: "Agent Activity", val: "18 Swarms", change: "42 Processes Active", positive: true, icon: "support_agent" },
          { name: "Risk Score", val: "68 / 100", change: "Elevated Target", positive: false, icon: "warning" },
          { name: "Forecast Confidence", val: "94.2%", change: "Wolfram Validated", positive: true, icon: "functions" },
          { name: "System Health", val: "99.98%", change: "Nominal latency", positive: true, icon: "analytics" },
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="card-layer p-4 flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{kpi.name}</span>
              <span className={`material-symbols-outlined text-[16px] ${kpi.positive ? "text-[#8ab4f8]" : "text-amber-500"}`}>
                {kpi.icon}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-0.5">
              <span className="font-display text-xl font-bold text-white tracking-tight">{kpi.val}</span>
              <span className={`font-mono text-[9px] font-bold ${kpi.positive ? "text-[#4edea3]" : "text-amber-400"}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Strategic Insights & AI Generated Summaries */}
      <section className="panel-layer p-5 relative overflow-hidden flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8ab4f8] text-sm">smart_toy</span>
            <span className="font-mono text-[9px] text-[#8ab4f8] uppercase font-bold tracking-widest">
              AI Strategic Intelligence Briefing
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed max-w-5xl">
            Sanktrix telemetry has detected a minor marketing CAC deviation. Wolfram Engine projection shows a <strong className="text-white font-semibold">94.2% probability</strong> of achieving targets if <strong className="text-[#8ab4f8] font-semibold">15% budget is shifted to search campaigns</strong>. Action recommended.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => router.push("/twin")}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Acknowledge &amp; Optimize
          </button>
        </div>
      </section>

      {/* 4. Bento Grid Charts & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Revenue Forecast (Col 8) */}
        <div className="card-layer col-span-1 lg:col-span-8 p-5 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-6 border-b border-white/[0.04] pb-3">
            <div>
              <h2 className="font-display text-sm text-white font-bold tracking-wide">Revenue Forecast</h2>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">MONTE CARLO TARGET BOUNDS // 12-MONTH OUTLOOK</p>
            </div>
            <span className="text-[9px] bg-[#8ab4f8]/15 border border-[#8ab4f8]/30 text-[#8ab4f8] px-2 py-0.5 rounded font-mono font-bold">
              Confidence: 94.2%
            </span>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="flex-1 w-full bg-[#050505]/40 rounded-xl border border-white/[0.03] flex items-end justify-center relative overflow-hidden p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
            
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8ab4f8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8ab4f8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="5%" y1="20%" x2="95%" y2="20%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="5%" y1="80%" x2="95%" y2="80%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Area Path */}
              <path
                d="M 50 220 Q 150 180 250 190 T 450 120 T 650 60 L 650 250 L 50 250 Z"
                fill="url(#chartGlow)"
              />
              {/* Line Path */}
              <path
                d="M 50 220 Q 150 180 250 190 T 450 120 T 650 60"
                fill="none"
                stroke="#8ab4f8"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_10px_rgba(138,180,248,0.4)]"
              />
              
              {/* Highlight Nodes */}
              <circle cx="250" cy="190" r="4" fill="#8ab4f8" stroke="#0a0b0e" strokeWidth="2" />
              <circle cx="450" cy="120" r="4" fill="#8ab4f8" stroke="#0a0b0e" strokeWidth="2" />
              <circle cx="650" cy="60" r="5" fill="#4edea3" stroke="#0a0b0e" strokeWidth="2.5" />
            </svg>

            {/* Custom Tooltip */}
            <div className="absolute top-10 right-10 bg-[#0d0f14] border border-white/[0.08] px-3 py-1.5 rounded-[8px] font-mono text-[9px] text-white flex flex-col gap-0.5 shadow-lg">
              <span className="text-gray-400">PROJECTED PEAK</span>
              <span className="font-bold text-[#4edea3]">$4.2M // M12</span>
            </div>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 font-mono text-[9px] text-gray-500">
              <span>M1</span>
              <span>M3</span>
              <span>M6</span>
              <span>M9</span>
              <span>M12</span>
            </div>
          </div>
        </div>

        {/* Right Card: Risk Score & Matrix (Col 4) */}
        <div className="card-layer col-span-1 lg:col-span-4 p-5 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-6 border-b border-white/[0.04] pb-3">
            <h2 className="font-display text-sm text-white font-bold tracking-wide">Risk Assessment Matrix</h2>
            <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Animated Donut Gauge */}
            <div className="w-36 h-36 rounded-full border-4 border-white/[0.02] relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="rgba(245,158,11,0.1)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="402"
                  strokeDashoffset="130"
                  className="drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                />
              </svg>
              <div className="text-center z-10">
                <span className="font-display text-3xl font-extrabold text-white block">68</span>
                <span className="font-mono text-[8px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold block mt-1">
                  ELEVATED
                </span>
              </div>
            </div>

            {/* Risk details */}
            <div className="w-full mt-6 space-y-2 bg-[#050505]/30 p-3 rounded-xl border border-white/[0.03]">
              <div className="flex justify-between font-mono text-[10px] items-center">
                <span className="text-gray-400">Market Volatility</span>
                <span className="text-red-400 font-bold">High</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] items-center">
                <span className="text-gray-400">Supply Chain Latency</span>
                <span className="text-amber-400 font-bold">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Health & Logs Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Operational Health & Swarms (Col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Health Details */}
          <div className="card-layer p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4 border-b border-white/[0.04] pb-2">
              <h2 className="font-display text-xs text-white uppercase tracking-wider font-bold">Cluster Node Health</h2>
              <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded font-bold">98.2%</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Node Cluster Alpha", pct: 95 },
                { name: "Node Cluster Beta", pct: 88 },
                { name: "Database Shard 1", pct: 99 },
              ].map((node, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-400">{node.name}</span>
                    <span className="font-bold text-white">{node.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4edea3] rounded-full" 
                      style={{ width: `${node.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Multiplier */}
          <div className="card-layer p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4 border-b border-white/[0.04] pb-2">
              <h2 className="font-display text-xs text-white uppercase tracking-wider font-bold">Productivity Index</h2>
              <span className="material-symbols-outlined text-[#8ab4f8] text-sm">trending_up</span>
            </div>
            <div className="flex flex-col items-center justify-center my-2">
              <span className="font-display text-3xl font-extrabold text-[#8ab4f8] block">1.42</span>
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">INDEX MULTIPLIER</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-white/[0.04] pt-3 font-mono text-[9px]">
              <div>
                <span className="block text-gray-500">AGENTS</span>
                <span className="block font-sans text-xs font-bold text-white">+12%</span>
              </div>
              <div className="border-l border-r border-white/[0.04] px-1">
                <span className="block text-gray-500">HUMANS</span>
                <span className="block font-sans text-xs font-bold text-white">+4%</span>
              </div>
              <div>
                <span className="block text-gray-500">HYBRID</span>
                <span className="block font-sans text-xs font-bold text-[#4edea3]">+28%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Event Feed (Col 4) */}
        <div className="card-layer lg:col-span-4 flex flex-col h-[240px]">
          <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-[#07080c]/50">
            <h2 className="font-display text-[10px] text-white uppercase tracking-wider flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
              Live Telemetry Streams
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 pr-1 scrollbar-thin">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#050505]/40 p-2 rounded-[10px] border border-white/[0.03] flex gap-2.5 items-start transition-all hover:bg-white/[0.01]"
              >
                <span className={`material-symbols-outlined ${log.color} text-[14px] mt-0.5`}>
                  {log.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] text-white leading-tight truncate">{log.text}</p>
                  <p className="font-mono text-[8px] text-gray-500 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
