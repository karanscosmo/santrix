"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

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
      <div className="space-y-md">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant pb-md mb-xl">
          <div>
            <div className="flex items-center gap-sm">
              <h2 className="font-display text-3xl text-on-surface font-bold">System Status</h2>
              <span className="h-4 w-px bg-white/10 mx-2 hidden md:inline"></span>
              <div className="flex items-center gap-2 text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary pulse-indicator"></span>
                <span className="font-mono text-xs text-on-surface-variant">
                  Local Stack Status: <strong className={isStressed ? "text-error" : "text-tertiary"}>{isStressed ? "DEGRADED" : "NOMINAL"}</strong>
                </span>
              </div>
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-xs">Real-time OpenTelemetry nodes, Docker clusters, and API metrics.</p>
          </div>

          <button
            onClick={toggleStressTest}
            className={`px-lg py-md rounded-lg font-sans text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(176,198,255,0.15)] cursor-pointer hover:scale-[1.01] shrink-0 ${
              isStressed
                ? "bg-error text-on-error hover:bg-error/85"
                : "bg-primary text-on-primary hover:bg-primary-container"
            }`}
          >
            {isStressed ? "Cool Down System" : "Simulate Stress Test"}
          </button>
        </div>

        <div className="space-y-md pb-8">
          
          {/* Grafana Check Grid */}
          <div className="glass-panel rounded-xl p-md relative overflow-hidden flex flex-col">
            {isStressed && <div className="stream-pulse bg-error"></div>}
            {!isStressed && <div className="stream-pulse"></div>}

            <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
              <div>
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary font-bold">query_stats</span>
                  Grafana Services Monitor
                </h3>
                <p className="font-mono text-[9px] text-on-surface-variant mt-1.5 uppercase">HEALTH CHECKS FOR KERNEL &amp; WORKFLOW DRIVERS</p>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant">POLLING RATE: 1000ms</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-sm text-center">
              {services.map((srv, idx) => {
                const srvStatus =
                  srv.status === "HEALTHY"
                    ? "text-tertiary bg-tertiary/5 border-tertiary/20"
                    : srv.status === "STRESSED"
                    ? "text-secondary bg-secondary/5 border-secondary/20"
                    : "text-error bg-error/5 border-error/20";
                
                const dotColor =
                  srv.status === "HEALTHY"
                    ? "bg-tertiary"
                    : srv.status === "STRESSED"
                    ? "bg-secondary"
                    : "bg-error";

                return (
                  <div key={idx} className={`p-md rounded-xl border flex flex-col items-center justify-center space-y-2 hover:bg-white/5 transition-all ${srvStatus}`}>
                    <span className="font-mono text-[10px] text-on-surface-variant block uppercase truncate w-full font-semibold">{srv.name}</span>
                    <span className={`w-2 h-2 rounded-full ${dotColor} ${srv.status === "STRESSED" || srv.status === "CRITICAL" ? "animate-pulse" : ""}`}></span>
                    <span className="font-mono text-xs block font-bold uppercase">{srv.status}</span>
                    <span className="font-mono text-[8px] text-on-surface-variant/85 block">Uptime: {srv.uptime}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts & Gauges */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
            
            {/* Cumulative API costs */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[320px] relative overflow-hidden">
              <div className="border-b border-outline-variant/30 pb-sm mb-md">
                <span className="font-sans text-[10px] uppercase font-bold text-primary block tracking-wider">LLM API Cumulative Costs</span>
                <h4 className="font-mono text-3xl text-white font-bold mt-1">
                  ${llmCost.toFixed(2)}{" "}
                  <span className="text-xs text-on-surface-variant font-normal font-sans tracking-normal font-light">this month</span>
                </h4>
              </div>

              {/* Simulated bar chart representation */}
              <div className="flex items-end justify-between h-32 px-md mt-sm bg-[#050505]/40 rounded-xl border border-white/5 p-sm">
                <div className="w-12 bg-primary/20 hover:bg-primary/30 border border-primary/20 rounded-t-lg h-[40%] flex flex-col items-center justify-end pb-2 text-[8px] font-mono text-on-surface-variant transition-all cursor-pointer">
                  <span>GPT-4o</span>
                  <span className="font-bold text-white mt-0.5">$49</span>
                </div>
                <div className="w-12 bg-primary/40 hover:bg-primary/50 border border-primary/30 rounded-t-lg h-[75%] flex flex-col items-center justify-end pb-2 text-[8px] font-mono text-on-surface-variant transition-all cursor-pointer">
                  <span>Claude</span>
                  <span className="font-bold text-white mt-0.5">$92</span>
                </div>
                <div className="w-12 bg-primary/60 hover:bg-primary/70 border border-primary/45 rounded-t-lg h-[20%] flex flex-col items-center justify-end pb-2 text-[8px] font-mono text-on-surface-variant transition-all cursor-pointer">
                  <span>Llama</span>
                  <span className="font-bold text-white mt-0.5">$22</span>
                </div>
              </div>

              <div className="pt-md border-t border-outline-variant/30 mt-md flex justify-between text-[10px] font-mono text-on-surface-variant">
                <span>Daily Limit: $500.00</span>
                <span className="text-tertiary font-bold uppercase">Safe Range</span>
              </div>
            </div>

            {/* Average response times sparkline */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[320px]">
              <div className="border-b border-outline-variant/30 pb-sm mb-md">
                <span className="font-sans text-[10px] uppercase font-bold text-tertiary block tracking-wider">Agent Response Latency (TTFT)</span>
                <h4 className="font-mono text-3xl text-white font-bold mt-1">
                  {avgLatency}ms{" "}
                  <span className="text-xs text-on-surface-variant font-normal font-sans tracking-normal font-light">avg span</span>
                </h4>
              </div>

              {/* Sparkline SVG */}
              <div className="h-32 flex items-center justify-center p-xs relative bg-[#050505]/40 rounded-xl border border-white/5">
                <svg className="w-full h-full text-tertiary px-sm" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines inside chart */}
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                  
                  <path
                    d={
                      isStressed
                        ? "M 0 50 Q 20 10 40 70 T 80 15 T 120 75 T 160 5 T 200 68"
                        : "M 0 60 Q 20 40 40 50 T 80 20 T 120 45 T 160 10 T 200 30"
                    }
                    stroke={isStressed ? "#ffb4ab" : "#4edea3"}
                    strokeWidth="2.5"
                    fill="none"
                    className="transition-all duration-500"
                  />
                </svg>
                {isStressed && (
                  <div className="absolute top-2 right-2 bg-error/15 border border-error/30 text-error px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold animate-pulse">
                    Latent Spikes Detected
                  </div>
                )}
              </div>

              <div className="pt-md border-t border-outline-variant/30 mt-md flex justify-between text-[10px] font-mono text-on-surface-variant">
                <span>P99 Limit: 2.5s</span>
                <span>P50 Target: 500ms</span>
              </div>
            </div>

            {/* Wolfram Core allocation Ring indicators */}
            <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[320px]">
              <div className="border-b border-outline-variant/30 pb-sm mb-md">
                <span className="font-sans text-[10px] uppercase font-bold text-secondary block tracking-wider">Wolfram Kernel Allocation</span>
                <h4 className="font-mono text-3xl text-white font-bold mt-1">
                  {cpuLoad}%{" "}
                  <span className="text-xs text-on-surface-variant font-normal font-sans tracking-normal font-light">Active Compute</span>
                </h4>
              </div>

              <div className="h-32 flex items-center justify-around bg-[#050505]/40 rounded-xl border border-white/5 p-sm">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-mono text-xs font-bold transition-all relative ${
                    isStressed
                      ? "border-error text-error shadow-[0_0_15px_rgba(255,180,171,0.2)]"
                      : "border-tertiary text-tertiary"
                  }`}
                >
                  <span className="text-white font-bold">{isStressed ? "16 / 16" : "4 / 16"}</span>
                  <span className="text-[7px] text-on-surface-variant font-sans uppercase font-bold mt-1">Kernels</span>
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant space-y-1">
                  <div>Memory: <span className="text-white font-bold">{isStressed ? "24.2GB / 32GB" : "8.4GB / 32GB"}</span></div>
                  <div>Status: <span className={isStressed ? "text-error font-bold" : "text-tertiary font-bold"}>{isStressed ? "HIGH LOAD" : "Nominal"}</span></div>
                  <div>Compute: <span className="text-white font-semibold">Local MathLink</span></div>
                </div>
              </div>

              <div className="pt-md border-t border-outline-variant/30 mt-md flex justify-between text-[10px] font-mono text-on-surface-variant">
                <span>Engine Status: Synchronized</span>
                <span className="text-tertiary font-bold uppercase">Online</span>
              </div>
            </div>
          </div>

          {/* OTEL Span Trace logs */}
          <div className="glass-panel rounded-xl p-md flex flex-col h-[320px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
              <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                OpenTelemetry Distributed Spans
              </h3>
              <span className="font-mono text-[9px] text-on-surface-variant">OUTPUT CHANNEL: /dev/stdout</span>
            </div>

            <div className="flex-1 bg-[#050505]/60 border border-white/5 rounded-xl p-md font-mono text-xs overflow-y-auto text-on-surface-variant space-y-2 select-all h-[150px]">
              {spanLogs.map((log, index) => {
                const statusColor =
                  log.status === "error"
                    ? "text-error font-bold"
                    : log.status === "warning"
                    ? "text-secondary font-bold"
                    : "text-tertiary";

                return (
                  <div key={index} className="leading-relaxed flex items-start gap-1 font-light">
                    <span className="text-primary/45 shrink-0">&raquo;</span>
                    <div>
                      [{log.time}]{" "}
                      <span className="text-primary font-semibold">SPAN</span> {"//"} parent: <span className="text-white font-semibold">{log.span}</span> [{log.duration}ms] -{" "}
                      <span className={statusColor}>{log.meta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
