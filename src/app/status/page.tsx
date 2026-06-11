"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface MetricCard {
  name: string;
  status: "HEALTHY" | "STRESSED" | "CRITICAL";
  uptime: string;
  icon: string;
}

interface SpanLog {
  time: string;
  span: string;
  duration: number;
  status: "success" | "warning" | "error";
  meta: string;
}

export default function StatusPage() {
  const { addAuditLog, checkPermission, rateLimitCheck } = useSecurity();
  const [isStressed, setIsStressed] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(14.2);
  const [avgLatency, setAvgLatency] = useState(840);
  const [llmCost, setLlmCost] = useState(124.85);

  // Health check list state
  const [services, setServices] = useState<MetricCard[]>([
    { name: "n8n core", status: "HEALTHY", uptime: "99.9%", icon: "task_alt" },
    { name: "trigger.dev", status: "HEALTHY", uptime: "100%", icon: "task_alt" },
    { name: "temporal", status: "HEALTHY", uptime: "99.8%", icon: "task_alt" },
    { name: "pinecone vector", status: "HEALTHY", uptime: "100%", icon: "task_alt" },
    { name: "clickhouse", status: "HEALTHY", uptime: "99.9%", icon: "task_alt" },
    { name: "supabase", status: "HEALTHY", uptime: "99.9%", icon: "task_alt" },
  ]);

  // OpenTelemetry Span logs state
  const [spanLogs, setSpanLogs] = useState<SpanLog[]>([
    { time: "23:52:01", span: "wf_exec_marketing", duration: 520, status: "success", meta: "success" },
    { time: "23:52:02", span: "  child: agent_cot_reasoning", duration: 120, status: "success", meta: "success" },
    { time: "23:52:03", span: "  child: wolfram_kernel_eval", duration: 340, status: "success", meta: "success (ARR_RunwayFactor evaluated)" },
  ]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isStressed) {
        setCpuLoad(prev => Number((Math.max(10, Math.min(30, prev + (Math.random() - 0.5) * 2))).toFixed(1)));
        setAvgLatency(prev => Math.max(700, Math.min(1000, prev + Math.floor((Math.random() - 0.5) * 40))));
        setLlmCost(prev => Number((prev + 0.05).toFixed(2)));
      } else {
        setCpuLoad(prev => Number((Math.max(75, Math.min(96, prev + (Math.random() - 0.5) * 5))).toFixed(1)));
        setAvgLatency(prev => Math.max(2000, Math.min(3500, prev + Math.floor((Math.random() - 0.5) * 150))));
        setLlmCost(prev => Number((prev + 0.85).toFixed(2)));
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isStressed]);

  // OTEL span appending simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const parentSpans = [
        "wolfram_monte_carlo",
        "agent_observe_cot",
        "realtime_fabric_publish",
        "workflow_n8n_poll",
        "boardroom_ppt_generate"
      ];
      const childrenSpans = [
        "  child: pinecone_query",
        "  child: kernel_solve",
        "  child: api_llm_post",
        "  child: xss_sanitize_filter"
      ];

      const timeStr = new Date().toTimeString().split(" ")[0];
      const randomParent = parentSpans[Math.floor(Math.random() * parentSpans.length)];
      const randomChild = childrenSpans[Math.floor(Math.random() * childrenSpans.length)];

      const parentDuration = isStressed ? Math.floor(1500 + Math.random() * 2000) : Math.floor(300 + Math.random() * 400);
      const childDuration = isStressed ? Math.floor(800 + Math.random() * 1200) : Math.floor(80 + Math.random() * 150);

      const parentLog: SpanLog = {
        time: timeStr,
        span: randomParent,
        duration: parentDuration,
        status: isStressed ? "warning" : "success",
        meta: isStressed ? "high latency warning" : "success"
      };

      const childLog: SpanLog = {
        time: timeStr,
        span: randomChild,
        duration: childDuration,
        status: isStressed ? "error" : "success",
        meta: isStressed ? "context timeout threshold breached" : "success"
      };

      setSpanLogs(prev => {
        const next = [...prev, parentLog, childLog];
        return next.slice(-12); // limit log count in viewport
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isStressed]);

  // Run Stress Test Action
  const toggleStressTest = () => {
    if (!checkPermission("simulation:run")) {
      alert("Unauthorized: Analyst or higher privileges required to trigger systems diagnostic checks.");
      return;
    }

    if (!rateLimitCheck()) {
      alert("Rate limit violation. Operation throttled.");
      return;
    }

    if (!isStressed) {
      setIsStressed(true);
      setServices(prev =>
        prev.map(s => {
          if (s.name === "temporal" || s.name === "supabase") {
            return { ...s, status: "STRESSED", icon: "running_with_errors" };
          }
          return s;
        })
      );
      addAuditLog("status.stress_test", "Triggered system performance stress test. Latency spike simulated.", "SUCCESS");
    } else {
      setIsStressed(false);
      setServices(prev =>
        prev.map(s => ({ ...s, status: "HEALTHY", icon: "task_alt" }))
      );
      addAuditLog("status.cooldown", "Restored nominal status parameters to local infrastructure.", "SUCCESS");
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md mb-md">
        <div>
          <div className="flex items-center gap-sm">
            <h2 className="font-display text-4xl text-on-surface">System Status</h2>
            <span className="h-4 w-px bg-outline-variant mx-2 hidden md:inline"></span>
            <div className="flex items-center gap-2 text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary pulse-indicator"></span>
              <span className="font-mono text-xs text-on-surface-variant">
                Local Stack Status: <strong className={isStressed ? "text-error" : "text-tertiary"}>{isStressed ? "DEGRADED" : "NOMINAL"}</strong>
              </span>
            </div>
          </div>
          <p className="font-mono text-xs text-on-surface-variant mt-1">Real-time OpenTelemetry nodes, Docker clusters, and API metrics.</p>
        </div>

        <button
          onClick={toggleStressTest}
          className={`px-md py-sm rounded font-sans text-xs uppercase font-bold transition-all shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer ${
            isStressed
              ? "bg-error text-on-error hover:bg-error/80"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          {isStressed ? "Cool Down System" : "Simulate Stress Test"}
        </button>
      </div>

      <div className="space-y-md pb-8">
        {/* Grafana Check Grid */}
        <div className="glass-panel rounded-xl p-md relative overflow-hidden">
          {isStressed && <div className="stream-pulse bg-error"></div>}
          {!isStressed && <div className="stream-pulse"></div>}

          <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
            <div>
              <h3 className="font-display text-base text-on-surface">Grafana Services Monitor</h3>
              <p className="font-mono text-[9px] text-on-surface-variant mt-1">HEALTH CHECKS FOR KERNEL &amp; WORKFLOW DRIVERS</p>
            </div>
            <span className="text-[9px] font-mono text-on-surface-variant">POLLING RATE: 1000ms</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-sm text-center">
            {services.map((srv, idx) => {
              const statusColor =
                srv.status === "HEALTHY"
                  ? "text-tertiary"
                  : srv.status === "STRESSED"
                  ? "text-secondary"
                  : "text-error";

              return (
                <div key={idx} className="bg-surface-container p-sm rounded-lg border border-outline-variant/65">
                  <span className="font-mono text-[10px] text-on-surface-variant block uppercase truncate">{srv.name}</span>
                  <span className={`material-symbols-outlined mt-2 ${statusColor}`}>
                    {srv.status === "HEALTHY" ? "task_alt" : "warning"}
                  </span>
                  <span className={`font-mono text-xs block font-bold mt-1 ${statusColor}`}>{srv.status}</span>
                  <span className="font-mono text-[8px] text-on-surface-variant block mt-0.5">Uptime: {srv.uptime}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts & Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Cumulative API costs */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[300px] relative overflow-hidden">
            <div className="border-b border-outline-variant/30 pb-xs mb-sm">
              <span className="font-sans text-[10px] uppercase font-bold text-primary block">LLM API Cumulative Costs</span>
              <h4 className="font-mono text-2xl text-on-surface font-bold">
                ${llmCost.toFixed(2)}{" "}
                <span className="text-xs text-on-surface-variant font-normal font-sans">this month</span>
              </h4>
            </div>

            {/* Simulated bar chart representation */}
            <div className="flex items-end justify-between h-32 px-sm">
              <div className="w-12 bg-primary/40 rounded-t h-[40%] flex flex-col items-center justify-end pb-1 text-[8px] font-mono text-on-surface">
                <span>GPT-4o</span>
                <span className="font-bold">$49</span>
              </div>
              <div className="w-12 bg-primary/60 rounded-t h-[75%] flex flex-col items-center justify-end pb-1 text-[8px] font-mono text-on-surface">
                <span>Claude</span>
                <span className="font-bold">$92</span>
              </div>
              <div className="w-12 bg-primary/80 rounded-t h-[20%] flex flex-col items-center justify-end pb-1 text-[8px] font-mono text-on-surface">
                <span>Llama</span>
                <span className="font-bold">$22</span>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>Daily Limit: $500.00</span>
              <span className="text-tertiary">Safe Range</span>
            </div>
          </div>

          {/* Average response times sparkline */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[300px]">
            <div className="border-b border-outline-variant/30 pb-xs mb-sm">
              <span className="font-sans text-[10px] uppercase font-bold text-tertiary block">Agent Response Latency (TTFT)</span>
              <h4 className="font-mono text-2xl text-on-surface font-bold">
                {avgLatency}ms{" "}
                <span className="text-xs text-on-surface-variant font-normal font-sans">avg span</span>
              </h4>
            </div>

            {/* Sparkline SVG */}
            <div className="h-32 flex items-center justify-center p-xs relative">
              <svg className="w-full h-full text-tertiary" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d={
                    isStressed
                      ? "M 0 50 Q 20 10 40 70 T 80 15 T 120 75 T 160 5 T 200 68"
                      : "M 0 60 Q 20 40 40 50 T 80 20 T 120 45 T 160 10 T 200 30"
                  }
                  stroke={isStressed ? "#ffb4ab" : "#4edea3"}
                  strokeWidth="2"
                  fill="none"
                  className="transition-all duration-500"
                />
              </svg>
              {isStressed && (
                <div className="absolute top-2 right-2 bg-error/15 border border-error/30 text-error px-2 py-0.5 rounded text-[8px] font-mono uppercase">
                  Latent Spikes Detected
                </div>
              )}
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>P99 Limit: 2.5s</span>
              <span>P50 Target: 500ms</span>
            </div>
          </div>

          {/* Wolfram Core allocation Ring indicators */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[300px]">
            <div className="border-b border-outline-variant/30 pb-xs mb-sm">
              <span className="font-sans text-[10px] uppercase font-bold text-secondary block">Wolfram Kernel Allocation</span>
              <h4 className="font-mono text-2xl text-on-surface font-bold">
                {cpuLoad}%{" "}
                <span className="text-xs text-on-surface-variant font-normal font-sans">Active Compute</span>
              </h4>
            </div>

            <div className="h-32 flex items-center justify-around">
              <div
                className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-mono text-sm font-bold transition-all relative ${
                  isStressed
                    ? "border-error text-error shadow-[0_0_15px_rgba(255,180,171,0.2)] animate-pulse"
                    : "border-tertiary text-tertiary"
                }`}
              >
                <span>{isStressed ? "16 / 16" : "4 / 16"}</span>
                <span className="text-[7px] text-on-surface-variant font-sans uppercase font-bold mt-1">Kernels</span>
              </div>
              <div className="text-[10px] font-mono text-on-surface-variant space-y-1">
                <div>Memory: <span className="text-on-surface font-bold">{isStressed ? "24.2GB / 32GB" : "8.4GB / 32GB"}</span></div>
                <div>Status: <span className={isStressed ? "text-error font-bold" : "text-tertiary font-bold"}>{isStressed ? "HIGH LOAD" : "Nominal"}</span></div>
                <div>Compute: <span className="text-on-surface">Local MathLink</span></div>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>Engine Status: Synchronized</span>
              <span className="text-tertiary">Online</span>
            </div>
          </div>
        </div>

        {/* OTEL Span Trace logs */}
        <div className="glass-panel rounded-xl p-md flex flex-col h-[300px]">
          <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
            <h3 className="font-display text-base text-on-surface">OpenTelemetry Distributed Spans</h3>
            <span className="font-mono text-[9px] text-on-surface-variant">OUTPUT CHANNEL: /dev/stdout</span>
          </div>

          <div className="flex-1 bg-surface-container-lowest border border-outline-variant/60 rounded p-sm font-mono text-xs overflow-y-auto text-on-surface-variant space-y-1 select-all">
            {spanLogs.map((log, index) => {
              const statusColor =
                log.status === "error"
                  ? "text-error font-bold"
                  : log.status === "warning"
                  ? "text-secondary"
                  : "text-tertiary";

              return (
                <div key={index} className="leading-tight">
                  [{log.time}]{" "}
                  <span className="text-primary font-bold">SPAN</span> {"//"} parent: {log.span} [
                  {log.duration}ms] -{" "}
                  <span className={statusColor}>{log.meta}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
