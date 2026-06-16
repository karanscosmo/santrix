"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface HealthItem {
  name: string;
  status: "Operational" | "Degraded" | "Issue";
  metric: string;
  description: string;
  icon: string;
}

const platformHealth: HealthItem[] = [
  { name: "Platform Uptime", status: "Operational", metric: "99.98%", description: "No unplanned downtime in the last 30 days", icon: "cloud_done" },
  { name: "AI Agent Health", status: "Operational", metric: "5/5 active", description: "All autonomous agents operating within normal parameters", icon: "smart_toy" },
  { name: "Forecast Accuracy", status: "Operational", metric: "94.2%", description: "Decision models performing above 90% target threshold", icon: "verified" },
  { name: "Decision Quality", status: "Operational", metric: "96.1%", description: "AI recommendations accepted and validated by outcomes", icon: "thumb_up" },
  { name: "Data Freshness", status: "Operational", metric: "< 5 min", description: "All data feeds processing within latency targets", icon: "update" },
  { name: "Operational Readiness", status: "Operational", metric: "Ready", description: "All systems operational and accepting requests", icon: "check_circle" },
];

interface TimelineEvent {
  time: string;
  status: "up" | "degraded" | "down";
}

const uptimeTimeline: TimelineEvent[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(23 - i).padStart(2, "0")}:00`,
  status: "up" as const,
}));

interface InfraService {
  name: string;
  status: "Healthy" | "Degraded" | "Critical";
  uptime: string;
  latency: string;
  description: string;
}

const infraServices: InfraService[] = [
  { name: "Application Server", status: "Healthy", uptime: "99.99%", latency: "42ms", description: "Primary application and API layer" },
  { name: "AI Processing Engine", status: "Healthy", uptime: "99.98%", latency: "840ms", description: "Model inference and decision computation" },
  { name: "Database Cluster", status: "Healthy", uptime: "99.99%", latency: "8ms", description: "Primary data storage and retrieval" },
  { name: "Analytics Pipeline", status: "Healthy", uptime: "99.95%", latency: "120ms", description: "Data transformation and reporting" },
  { name: "Vector Store", status: "Healthy", uptime: "100%", latency: "15ms", description: "Knowledge graph and semantic search" },
  { name: "Event Processing", status: "Healthy", uptime: "99.97%", latency: "24ms", description: "Real-time business event handling" },
];

export default function StatusPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const allOperational = platformHealth.every(h => h.status === "Operational");

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Platform Health
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            System status, operational readiness, and platform performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 bg-[#0d0f14] border rounded-[10px] px-3.5 py-1.5 text-[11px] font-bold ${
            allOperational ? "border-[#4edea3]/20 text-[#4edea3]" : "border-[#f59e0b]/20 text-[#f59e0b]"
          }`}>
            <span className={`w-2 h-2 rounded-full ${allOperational ? "bg-[#4edea3]" : "bg-[#f59e0b] animate-pulse"}`}></span>
            {allOperational ? "All Systems Operational" : "Issues Detected"}
          </div>
        </div>
      </header>

      {/* Executive Health Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {platformHealth.map((h, idx) => (
          <div key={idx} className="metric-card text-center !p-5">
            <div className="flex justify-center mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                h.status === "Operational" ? "bg-[#4edea3]/10" : h.status === "Degraded" ? "bg-[#f59e0b]/10" : "bg-[#f28b82]/10"
              }`}>
                <span className={`material-symbols-outlined text-[20px] ${
                  h.status === "Operational" ? "text-[#4edea3]" : h.status === "Degraded" ? "text-[#f59e0b]" : "text-[#f28b82]"
                }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {h.icon}
                </span>
              </div>
            </div>
            <span className="font-display text-lg font-bold text-white block">{h.metric}</span>
            <span className="text-[11px] text-gray-400 block mt-0.5">{h.name}</span>
            <div className="mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                h.status === "Operational" ? "text-[#4edea3] bg-[#4edea3]/8" : h.status === "Degraded" ? "text-[#f59e0b] bg-[#f59e0b]/8" : "text-[#f28b82] bg-[#f28b82]/8"
              }`}>
                {h.status}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{h.description}</p>
          </div>
        ))}
      </div>

      {/* 24-Hour Uptime Timeline */}
      <section className="panel-layer p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">24-Hour Uptime</h2>
            <span className="text-[11px] text-gray-500">No incidents detected in the last 24 hours</span>
          </div>
          <span className="text-[11px] text-[#4edea3] font-bold">100% uptime</span>
        </div>
        <div className="flex gap-1 items-end h-8">
          {uptimeTimeline.map((event, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full rounded-[3px] transition-all group relative cursor-default ${
                event.status === "up" ? "bg-[#4edea3]/25 hover:bg-[#4edea3]/40" :
                event.status === "degraded" ? "bg-[#f59e0b]/40" : "bg-[#f28b82]/40"
              }`}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0d0f14] border border-white/[0.1] px-1.5 py-0.5 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {event.time} — Operational
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-gray-600">
          <span>24 hours ago</span>
          <span>Now</span>
        </div>
      </section>

      {/* Advanced Infrastructure Toggle */}
      <div className="border-t border-white/[0.04] pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">
            {showAdvanced ? "expand_less" : "expand_more"}
          </span>
          {showAdvanced ? "Hide" : "Show"} Advanced Infrastructure Details
        </button>
      </div>

      {/* Advanced Section (Collapsed by default) */}
      {showAdvanced && (
        <section className="panel-layer p-6 space-y-4 animate-fade-in-up">
          <div className="border-b border-white/[0.04] pb-3">
            <h3 className="text-sm font-bold text-white">Infrastructure Services</h3>
            <span className="text-[11px] text-gray-500">Detailed service-level health monitoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {infraServices.map((srv, idx) => (
              <div key={idx} className="bg-[#050505]/40 border border-white/[0.03] rounded-[14px] p-4 space-y-3 hover:border-white/[0.08] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{srv.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    srv.status === "Healthy" ? "text-[#4edea3] bg-[#4edea3]/8" :
                    srv.status === "Degraded" ? "text-[#f59e0b] bg-[#f59e0b]/8" :
                    "text-[#f28b82] bg-[#f28b82]/8"
                  }`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                      srv.status === "Healthy" ? "bg-[#4edea3]" :
                      srv.status === "Degraded" ? "bg-[#f59e0b]" : "bg-[#f28b82]"
                    }`}></span>
                    {srv.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{srv.description}</p>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-gray-500">Uptime: <span className="text-white font-bold">{srv.uptime}</span></span>
                  <span className="text-gray-500">Latency: <span className="text-white font-bold">{srv.latency}</span></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
