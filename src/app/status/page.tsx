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
        return next.slice(-12);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isStressed]);

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
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            System Observability
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Grafana quality telemetry tracking API health, latency, and node clusters.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Uptime: 99.98%
          </div>
          {/* Action Contexts */}
          <button
            onClick={toggleStressTest}
            className={`btn-action py-2 ${
              isStressed
                ? "btn-danger text-[10px]"
                : "btn-primary text-[10px]"
            }`}
          >
            {isStressed ? "Cool Down System" : "Simulate Stress Test"}
          </button>
        </div>
      </header>

      {/* 2. Services Monitoring Grid */}
      <section className="panel-layer p-5 relative overflow-hidden flex flex-col">
        {isStressed && <div className="absolute top-0 left-0 w-full h-[2px] bg-red-400 stream-line"></div>}
        {!isStressed && <div className="absolute top-0 left-0 w-full h-[2px] bg-[#8ab4f8] stream-line"></div>}

        <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#8ab4f8] font-bold">query_stats</span>
              Services Registry Health Monitor
            </h3>
            <p className="font-mono text-[9px] text-gray-500 mt-1 uppercase">HEALTH CHECKS FOR KERNEL &amp; WORKFLOWS</p>
          </div>
          <span className="text-[9px] font-mono text-gray-500">POLLING RATE: 1000ms</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {services.map((srv, idx) => {
            let srvStatus = "text-[#4edea3] bg-[#4edea3]/5 border-[#4edea3]/20";
            let dotColor = "bg-[#4edea3]";

            if (srv.status === "STRESSED") {
              srvStatus = "text-amber-500 bg-amber-500/5 border-amber-500/20";
              dotColor = "bg-amber-500";
            } else if (srv.status === "CRITICAL") {
              srvStatus = "text-red-400 bg-red-400/5 border-red-400/20";
              dotColor = "bg-red-400";
            }

            return (
              <div key={idx} className={`p-4 rounded-[14px] border flex flex-col items-center justify-center space-y-2 hover:bg-white/5 transition-all ${srvStatus}`}>
                <span className="font-mono text-[9px] text-gray-400 block uppercase truncate w-full font-bold">{srv.name}</span>
                <span className={`w-2 h-2 rounded-full ${dotColor} ${srv.status !== "HEALTHY" ? "animate-pulse" : ""}`}></span>
                <span className="font-mono text-xs block font-bold uppercase">{srv.status}</span>
                <span className="font-mono text-[8px] text-gray-500 block">Uptime: {srv.uptime}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Three Columns telemetry charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cumulative API costs */}
        <section className="card-layer p-5 flex flex-col justify-between h-[320px] relative overflow-hidden">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <span className="font-mono text-[8px] uppercase font-bold text-gray-500 block tracking-widest">LLM API COST TRACKER</span>
            <h4 className="font-display text-2xl text-white font-bold mt-1 tracking-tight">
              ${llmCost.toFixed(2)}{" "}
              <span className="text-xs text-gray-400 font-normal font-sans font-light">this month</span>
            </h4>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="flex-grow flex items-end justify-around h-32 px-2 bg-[#050505]/40 rounded-xl border border-white/[0.03] p-3">
            {[
              { label: "GPT-4o", val: 49, height: "40%" },
              { label: "Claude", val: 92, height: "75%" },
              { label: "Llama", val: 22, height: "20%" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <span className="absolute -top-6 bg-[#0d0f14] border border-white/[0.1] px-1.5 py-0.5 rounded font-mono text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  ${bar.val}
                </span>
                <div 
                  className="w-8 bg-gradient-to-t from-[#8ab4f8]/10 to-[#8ab4f8]/50 border-t border-[#8ab4f8] rounded-t-[4px] transition-all"
                  style={{ height: bar.height }}
                ></div>
                <span className="font-mono text-[8px] text-gray-500">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.04] mt-3 flex justify-between text-[9px] font-mono text-gray-500">
            <span>Daily Budget Limit: $500</span>
            <span className="text-[#4edea3] font-bold">Safe Zone</span>
          </div>
        </section>

        {/* Latency curve TTFT */}
        <section className="card-layer p-5 flex flex-col justify-between h-[320px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <span className="font-mono text-[8px] uppercase font-bold text-gray-500 block tracking-widest">AGENT RESPONSE TIMES (TTFT)</span>
            <h4 className="font-display text-2xl text-white font-bold mt-1 tracking-tight">
              {avgLatency}ms{" "}
              <span className="text-xs text-gray-400 font-normal font-sans font-light">average TTFT</span>
            </h4>
          </div>

          {/* SVG Latency Graph */}
          <div className="flex-grow h-32 flex items-center justify-center relative bg-[#050505]/40 rounded-xl border border-white/[0.03]">
            <svg className="w-full h-full text-[#4edea3] px-2" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              
              <path
                d={
                  isStressed
                    ? "M 0 55 Q 20 15 40 75 T 80 20 T 120 78 T 160 10 T 200 70"
                    : "M 0 65 Q 20 45 40 55 T 80 25 T 120 48 T 160 15 T 200 35"
                }
                stroke={isStressed ? "#f28b82" : "#4edea3"}
                strokeWidth="2"
                fill="none"
                className="transition-all duration-500"
              />
            </svg>
            {isStressed && (
              <div className="absolute top-2 right-2 bg-red-400/10 border border-red-400/20 text-red-400 px-2 py-0.5 rounded text-[8px] font-mono font-bold animate-pulse">
                Latency Peak Warnings
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.04] mt-3 flex justify-between text-[9px] font-mono text-gray-500">
            <span>P99 Limit: 2.5s</span>
            <span>Target P50: 500ms</span>
          </div>
        </section>

        {/* Compute Allocations Ring */}
        <section className="card-layer p-5 flex flex-col justify-between h-[320px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <span className="font-mono text-[8px] uppercase font-bold text-gray-500 block tracking-widest">WOLFRAM COMPUTE CORES</span>
            <h4 className="font-display text-2xl text-white font-bold mt-1 tracking-tight">
              {cpuLoad}%{" "}
              <span className="text-xs text-gray-400 font-normal font-sans font-light">CPU load factor</span>
            </h4>
          </div>

          {/* Radial Core allocation */}
          <div className="flex-grow h-32 flex items-center justify-around bg-[#050505]/40 rounded-xl border border-white/[0.03] p-3">
            <div
              className={`w-18 h-18 rounded-full border-4 flex flex-col items-center justify-center font-mono text-[10px] font-bold transition-all relative ${
                isStressed
                  ? "border-red-400 text-red-400 shadow-[0_0_12px_rgba(242,139,130,0.2)]"
                  : "border-[#4edea3] text-[#4edea3]"
              }`}
            >
              <span className="text-white font-bold">{isStressed ? "16 / 16" : "4 / 16"}</span>
              <span className="text-[6px] text-gray-500 uppercase mt-0.5">Cores</span>
            </div>
            <div className="text-[9px] font-mono text-gray-500 space-y-1">
              <div>RAM Used: <span className="text-white font-bold">{isStressed ? "24.2GB" : "8.4GB"}</span></div>
              <div>State: <span className={isStressed ? "text-red-400 font-bold" : "text-[#4edea3] font-bold"}>{isStressed ? "HIGH LOAD" : "Nominal"}</span></div>
              <div>Link: <span className="text-white">Local Link</span></div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] mt-3 flex justify-between text-[9px] font-mono text-gray-500">
            <span>Kernel Sync: ACTIVE</span>
            <span className="text-[#4edea3] font-bold">Online</span>
          </div>
        </section>
      </div>

      {/* 4. OpenTelemetry Spans Console Terminal */}
      <section className="panel-layer p-5 flex flex-col h-[320px] pb-8">
        <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
          <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#8ab4f8]">terminal</span>
            OpenTelemetry Distributed Traces
          </h3>
          <span className="font-mono text-[9px] text-gray-500">OUTPUT: STDOUT CONSOLE</span>
        </div>

        <div className="flex-grow bg-[#050505]/60 border border-white/[0.03] rounded-xl p-3.5 font-mono text-[10px] overflow-y-auto text-gray-400 space-y-1.5 scrollbar-thin">
          {spanLogs.map((log, index) => {
            let statusColor = "text-[#4edea3]";
            if (log.status === "error") statusColor = "text-red-400 font-bold";
            else if (log.status === "warning") statusColor = "text-amber-500 font-bold";

            return (
              <div key={index} className="leading-relaxed flex items-start gap-1.5 font-light">
                <span className="text-[#8ab4f8]/50 shrink-0">&raquo;</span>
                <div className="min-w-0 flex-1 truncate">
                  [{log.time}] <span className="text-[#8ab4f8] font-bold">SPAN</span> {"//"} parent: <span className="text-white font-bold">{log.span}</span> [{log.duration}ms] -{" "}
                  <span className={statusColor}>{log.meta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
