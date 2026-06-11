"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface LogFeedItem {
  id: string;
  time: string;
  icon: string;
  text: string;
  color: string;
}

export default function Dashboard() {
  const [liveLogs, setLiveLogs] = useState<LogFeedItem[]>([
    { id: "log_1", time: "Just now", icon: "smart_toy", text: "Forecasting Agent running on Q3 Projections", color: "text-primary" },
    { id: "log_2", time: "2m ago", icon: "verified", text: "Risk Simulation completed - Variance minimal", color: "text-tertiary" },
    { id: "log_3", time: "15m ago", icon: "error", text: "Burn Rate anomaly detected in Marketing", color: "text-[#ffb4ab]" },
    { id: "log_4", time: "1h ago", icon: "sync", text: "Data Lake sync complete - 2.4TB processed", color: "text-primary" },
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
      const colors = ["text-tertiary", "text-primary", "text-secondary", "text-primary", "text-tertiary"];

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
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      {/* Top Title Section */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Executive Command Center</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">Platform Status: Active | 16 Compute Kernels Syncing</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
          Powered by Wolfram Computational Intelligence
        </div>
      </div>

      {/* AI-Generated Executive Summary Panel */}
      <div className="glass-panel rounded-2xl p-5 border border-primary/20 bg-[#0A0F1E]/30 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
            <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest">AI Strategic Briefing</span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed max-w-4xl">
            Sanktrix telemetry has detected a minor marketing CAC deviation. Wolfram Engine projection shows a **94.2% probability** of achieving targets if **15% budget is shifted to search campaigns**. All other metrics remain within nominal bands.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-primary hover:bg-[#c2d6ff] text-[#001945] font-mono text-[9px] uppercase font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(176,198,255,0.15)]">
            Acknowledge &amp; Optimize
          </button>
        </div>
      </div>

      {/* KPI Row (4 Animated Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "Annual Recurring Revenue", val: "$24.8M", change: "+14.2%", positive: true, icon: "payments" },
          { name: "Net Cash Burn Rate", val: "$110K/mo", change: "-8.4%", positive: true, icon: "trending_down" },
          { name: "Active Agent Workforce", val: "18 Swarms", change: "+2 active", positive: true, icon: "support_agent" },
          { name: "Wolfram Compute Load", val: "14.2 GigaFLOPs", change: "Latency: 14ms", positive: true, icon: "functions" },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">{kpi.name}</span>
              <span className="material-symbols-outlined text-primary text-lg">{kpi.icon}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-display text-2xl font-bold text-white">{kpi.val}</span>
              <span className={`font-mono text-[10px] font-bold ${kpi.positive ? "text-tertiary" : "text-[#ffb4ab]"}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Revenue Forecast Card (Col Span 8) */}
        <div className="glass-panel col-span-1 md:col-span-8 rounded-2xl p-6 relative overflow-hidden flex flex-col h-[400px]">
          <div className="stream-pulse"></div>
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-3">
            <div>
              <h2 className="font-display text-lg text-white font-bold">Revenue Forecast</h2>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">PROBABILITY BANDS OVER 12 MONTHS</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                Confidence: 94.2%
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#050505]/40 rounded-xl border border-white/5 flex items-end justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Chart Bars with gradients */}
            <div className="w-full h-full flex items-end px-6 gap-2 pt-12">
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 h-[30%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 h-[45%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 h-[35%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 h-[50%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 h-[65%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/70 h-[80%] rounded-t border-t border-primary/85 relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1c1f28] border border-white/10 px-2 py-1 rounded font-mono text-[10px] text-white whitespace-nowrap shadow-md">
                  $4.2M Peak
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score & Heatmap Card (Col Span 4) */}
        <div className="glass-panel col-span-1 md:col-span-4 rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-3">
            <h2 className="font-display text-lg text-white font-bold">Risk Matrix</h2>
            <span className="material-symbols-outlined text-[#ffb955]">warning</span>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center relative">
            {/* Heat Gauge */}
            <div className="w-40 h-40 rounded-full border-8 border-[#1c1f28] relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-8 border-[#ffb955] border-t-transparent border-r-transparent rotate-45 animate-pulse-slow"
                style={{ filter: "drop-shadow(0 0 10px rgba(255, 185, 85, 0.4))" }}
              ></div>
              <div className="text-center">
                <span className="font-display text-4xl font-bold text-[#ffb955] block">68</span>
                <span className="font-mono text-[9px] text-[#ffb955] bg-[#ffb955]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold block mt-1">ELEVATED</span>
              </div>
            </div>
            
            {/* Heatmap Mini Table */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between font-mono text-xs items-center">
                <span className="text-on-surface-variant">Market Volatility</span>
                <span className="text-[#ffb4ab] font-bold">High</span>
              </div>
              <div className="flex justify-between font-mono text-xs items-center">
                <span className="text-on-surface-variant">Supply Chain</span>
                <span className="text-[#ffb955] font-bold">Med</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Health & Productivity (Col Span 8) */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
          {/* Operational Health Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-3">
              <h2 className="font-display text-lg text-white font-bold">Op Health</h2>
              <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">98.2%</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Node Cluster Alpha</span>
                  <div className="w-24 h-1 bg-[#1c1f28] rounded overflow-hidden">
                    <div className="w-[95%] h-full bg-[#4edea3]"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Node Cluster Beta</span>
                  <div className="w-24 h-1 bg-[#1c1f28] rounded overflow-hidden">
                    <div className="w-[88%] h-full bg-[#4edea3]"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Database Shard 1</span>
                  <div className="w-24 h-1 bg-[#1c1f28] rounded overflow-hidden">
                    <div className="w-[99%] h-full bg-[#4edea3]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-2 bg-[#050505]/40 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-sm">check_circle</span>
                <span className="font-mono text-[10px] text-on-surface">All systems operating within nominal parameters.</span>
              </div>
            </div>
          </div>

          {/* Productivity Index Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-3">
              <h2 className="font-display text-lg text-white font-bold">Productivity</h2>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                <span className="font-display text-4xl font-bold text-primary block">1.42</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">INDEX MULTIPLIER</span>
              </div>
              <div className="w-full flex justify-between px-4">
                <div className="text-center">
                  <span className="block font-mono text-[9px] text-on-surface-variant">AGENTS</span>
                  <span className="block font-sans text-xs font-bold text-white">+12%</span>
                </div>
                <div className="text-center border-l border-r border-white/5 px-4">
                  <span className="block font-mono text-[9px] text-on-surface-variant">HUMANS</span>
                  <span className="block font-sans text-xs font-bold text-white">+4%</span>
                </div>
                <div className="text-center">
                  <span className="block font-mono text-[9px] text-on-surface-variant">HYBRID</span>
                  <span className="block font-sans text-xs font-bold text-[#4edea3]">+28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Intelligence (Col Span 4) */}
        <div className="glass-panel col-span-1 md:col-span-4 rounded-2xl flex flex-col h-[300px] border border-white/5">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#10131b]/30 rounded-t-2xl">
            <h2 className="font-display text-xs text-white uppercase tracking-wider flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Telemetry Feed
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2 pr-1">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#050505]/40 p-2.5 rounded-lg border border-white/5 flex gap-2.5 items-start"
              >
                <span className={`material-symbols-outlined ${log.color} text-sm mt-0.5`}>
                  {log.icon}
                </span>
                <div>
                  <p className="font-mono text-[11px] text-white leading-tight">{log.text}</p>
                  <p className="font-mono text-[9px] text-on-surface-variant mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
