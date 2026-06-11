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
    { id: "log_3", time: "15m ago", icon: "error", text: "Burn Rate anomaly detected in Marketing", color: "text-error" },
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
        return updated.slice(0, 6);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md h-full pb-8">
        {/* Revenue Forecast Card (Col Span 8) */}
        <div className="glass-panel col-span-1 md:col-span-8 rounded-xl p-md relative overflow-hidden flex flex-col h-[400px]">
          <div className="stream-pulse"></div>
          <div className="flex justify-between items-start mb-md border-b border-outline-variant/50 pb-sm">
            <div>
              <h2 className="font-display text-lg text-on-surface">Revenue Forecast</h2>
              <p className="font-mono text-[10px] text-on-surface-variant mt-1">PROBABILITY BANDS OVER 12 MONTHS</p>
            </div>
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] uppercase font-bold text-primary">LIVE MODEL</span>
            </div>
          </div>
          <div className="flex-1 w-full bg-surface-container-low/30 rounded border border-outline-variant/30 flex items-end justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Chart Bars with gradients */}
            <div className="w-full h-full flex items-end px-md gap-2 pt-12">
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 h-[30%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/40 h-[45%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 h-[35%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/60 h-[50%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/50 h-[65%] rounded-t border-t border-primary/50"></div>
              <div className="flex-1 bg-gradient-to-t from-primary/10 to-primary/70 h-[80%] rounded-t border-t border-primary/85 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant px-2 py-1 rounded font-mono text-[10px] text-on-surface whitespace-nowrap">
                  $4.2M
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Card (Col Span 4) */}
        <div className="glass-panel col-span-1 md:col-span-4 rounded-xl p-md flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-md border-b border-outline-variant/50 pb-sm">
            <h2 className="font-display text-lg text-on-surface">Risk Score</h2>
            <span className="material-symbols-outlined text-secondary">warning</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Heat Gauge */}
            <div className="w-48 h-48 rounded-full border-8 border-surface-container-high relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-8 border-secondary border-t-transparent border-r-transparent rotate-45"
                style={{ filter: "drop-shadow(0 0 10px rgba(255, 185, 85, 0.4))" }}
              ></div>
              <div className="text-center">
                <span className="font-display text-4xl font-bold text-secondary block">68</span>
                <span className="font-mono text-[10px] text-on-surface-variant">ELEVATED</span>
              </div>
            </div>
            <div className="w-full mt-lg space-y-sm">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-on-surface-variant">Market Volatility</span>
                <span className="text-error font-bold">High</span>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-on-surface-variant">Supply Chain</span>
                <span className="text-secondary font-bold">Med</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Health & Productivity (Col Span 8) */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-md h-[300px]">
          {/* Operational Health Card */}
          <div className="glass-panel rounded-xl p-md flex flex-col">
            <div className="flex justify-between items-start mb-md border-b border-outline-variant/50 pb-sm">
              <h2 className="font-display text-lg text-on-surface">Op Health</h2>
              <span className="font-mono text-[10px] text-tertiary bg-tertiary/10 px-2 py-1 rounded">98.2%</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Node Cluster Alpha</span>
                  <div className="w-24 h-1 bg-surface-container-high rounded overflow-hidden">
                    <div className="w-[95%] h-full bg-tertiary"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Node Cluster Beta</span>
                  <div className="w-24 h-1 bg-surface-container-high rounded overflow-hidden">
                    <div className="w-[88%] h-full bg-tertiary"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-on-surface-variant">Database Shard 1</span>
                  <div className="w-24 h-1 bg-surface-container-high rounded overflow-hidden">
                    <div className="w-[99%] h-full bg-tertiary"></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-2 bg-surface-container rounded border border-outline-variant/50 flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                <span className="font-mono text-[10px] text-on-surface">All systems operating within nominal parameters.</span>
              </div>
            </div>
          </div>

          {/* Productivity Index Card */}
          <div className="glass-panel rounded-xl p-md flex flex-col">
            <div className="flex justify-between items-start mb-md border-b border-outline-variant/50 pb-sm">
              <h2 className="font-display text-lg text-on-surface">Productivity</h2>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-md">
                <span className="font-display text-4xl font-bold text-primary block">1.42</span>
                <span className="font-mono text-[10px] text-on-surface-variant">INDEX MULTIPLIER</span>
              </div>
              <div className="w-full flex justify-between px-md">
                <div className="text-center">
                  <span className="block font-mono text-[10px] text-on-surface-variant">AGENTS</span>
                  <span className="block font-sans text-xs font-bold text-on-surface">+12%</span>
                </div>
                <div className="text-center border-l border-r border-outline-variant/50 px-md">
                  <span className="block font-mono text-[10px] text-on-surface-variant">HUMANS</span>
                  <span className="block font-sans text-xs font-bold text-on-surface">+4%</span>
                </div>
                <div className="text-center">
                  <span className="block font-mono text-[10px] text-on-surface-variant">HYBRID</span>
                  <span className="block font-sans text-xs font-bold text-tertiary">+28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Intelligence (Col Span 4) */}
        <div className="glass-panel col-span-1 md:col-span-4 rounded-xl flex flex-col h-[300px]">
          <div className="p-md border-b border-outline-variant/50 flex justify-between items-center bg-[#0A0F1E]/50 rounded-t-xl">
            <h2 className="font-display text-sm text-on-surface flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Intelligence
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto p-md space-y-sm">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className="bg-surface-container p-sm rounded border border-outline-variant/50 flex gap-sm items-start"
              >
                <span className={`material-symbols-outlined ${log.color} text-sm mt-0.5`}>
                  {log.icon}
                </span>
                <div>
                  <p className="font-mono text-xs text-on-surface">{log.text}</p>
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
