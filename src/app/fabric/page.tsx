"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Rule {
  id: string;
  name: string;
  expression: string;
  status: "ACTIVE" | "INACTIVE";
}

interface MessageLog {
  timestamp: string;
  topic: string;
  content: string;
  colorClass?: string;
}

export default function EventFabricPage() {
  const { addAuditLog, checkPermission } = useSecurity();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [throughput, setThroughput] = useState<number>(14842);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([12, 14, 11, 15, 13, 12, 14, 13, 12, 11]);

  const [logs, setLogs] = useState<MessageLog[]>([
    { timestamp: "23:51:02", topic: "telemetry.user_actions", content: 'user_login { user_id: "usr_8912", device: "MacBook Pro" }' },
    { timestamp: "23:51:04", topic: "agents.reasoning_steps", content: 'agent_thought { role: "SDR Swarm Analyst", thought: "Ingesting target contact lists" }' },
    { timestamp: "23:51:05", topic: "billing.transactions", content: 'invoice_paid { invoice_id: "inv_90a12", amount: "$4,200.00" }' },
    { timestamp: "23:51:08", topic: "system:Trigger", content: "Executed Rule: ARR Net Runway recalculation triggered.", colorClass: "text-[#4edea3] font-bold" },
  ]);

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "rule_1",
      name: "Churn Warning Trigger",
      expression: "If Churn > 15% in telemetry stream -> Run Monte Carlo -> alert CEO",
      status: "ACTIVE",
    },
    {
      id: "rule_2",
      name: "Runout Optimizer",
      expression: "If cash burn exceeds runway thresholds -> run budget optimization",
      status: "ACTIVE",
    },
  ]);

  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleExpr, setNewRuleExpr] = useState("");
  const [showAddRule, setShowAddRule] = useState(false);

  // Simulate incoming logs and variable throughput
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const topics = ["telemetry.user_actions", "billing.transactions", "agents.reasoning_steps", "wolfram.math_jobs"];
      const messages = [
        'api_request { method: "POST", path: "/api/v1/simulate", status: 200 }',
        'trade_execution { symbol: "USD/EUR", volume: 1500000, arbitrage_delta: 0.0024 }',
        'agent_thought { agent: "Executive Copilot", state: "Analyzing ARR projections" }',
        'calculation_complete { job_id: "job_98a72", engine: "Wolfram Kernel 3" }',
      ];
      const randomIdx = Math.floor(Math.random() * topics.length);
      const now = new Date().toLocaleTimeString();
      const newLog: MessageLog = {
        timestamp: now,
        topic: topics[randomIdx],
        content: messages[randomIdx],
      };
      setLogs(prev => [newLog, ...prev.slice(0, 15)]);

      // Adjust metrics slightly
      setThroughput(prev => Math.round(prev + (Math.random() * 200 - 100)));
      setLatencyHistory(prev => {
        const nextVal = Math.max(8, Math.min(22, Math.round(prev[prev.length - 1] + (Math.random() * 4 - 2))));
        return [...prev.slice(1), nextVal];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleRule = (id: string) => {
    if (!checkPermission("config:write")) {
      alert("Access Denied: Your role does not have permission to modify event rules.");
      return;
    }
    setRules(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextStatus = r.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          addAuditLog("fabric.toggle_rule", `Toggled rule ${r.name} to ${nextStatus}`, "SUCCESS");
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission("config:write")) {
      alert("Access Denied: Your role does not have permission to add trigger rules.");
      return;
    }
    if (!newRuleName || !newRuleExpr) return;

    const newRule: Rule = {
      id: `rule_${Date.now()}`,
      name: newRuleName,
      expression: newRuleExpr,
      status: "ACTIVE",
    };

    setRules(prev => [...prev, newRule]);
    addAuditLog("fabric.add_rule", `Created event trigger rule: ${newRuleName}`, "SUCCESS");
    setNewRuleName("");
    setNewRuleExpr("");
    setShowAddRule(false);
  };

  const triggerTestEvent = () => {
    const now = new Date().toLocaleTimeString();
    const newLog: MessageLog = {
      timestamp: now,
      topic: "user.triggered_test",
      content: 'telemetry_ping { client: "Karan Sharma", action: "forced_fabric_ping" }',
      colorClass: "text-[#8ab4f8] font-bold",
    };
    setLogs(prev => [newLog, ...prev]);
    addAuditLog("fabric.manual_ping", "Sent manual event fabric telemetry ping", "SUCCESS");
  };

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Realtime Event Fabric
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Enterprise event monitoring system and real-time Kafka cluster broker routing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicators */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Broker status: ONLINE
          </div>
          <button
            onClick={triggerTestEvent}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Inject Test Event
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            {isPlaying ? "Pause Stream" : "Resume Stream"}
          </button>
        </div>
      </header>

      {/* 2. Throughput & Latency Hero Telemetry Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Throughput (Events/sec)", val: `${isPlaying ? throughput : 0} eps`, color: "text-[#8ab4f8]" },
          { label: "Broker Mean Latency", val: `${isPlaying ? latencyHistory[latencyHistory.length - 1] : 0}ms`, color: "text-[#4edea3]" },
          { label: "Pipeline Load Factor", val: "22.4%", color: "text-[#8ab4f8]" },
          { label: "Active Trigger Rules", val: `${rules.filter(r => r.status === "ACTIVE").length} Rules`, color: "text-amber-500" },
        ].map((item, idx) => (
          <div key={idx} className="card-layer p-4">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block">{item.label}</span>
            <span className={`font-display text-lg font-bold block mt-2 ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </section>

      {/* 3. Event stream pipelines & custom charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stream Pipeline Canvas (Col 7) */}
        <section className="lg:col-span-7 panel-layer p-5 flex flex-col h-[400px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              Kafka Pipeline Event Topology
            </h3>
            <p className="font-mono text-[9px] text-gray-500 mt-0.5">
              REAL-TIME DATA STREAM FLOW AND BROKER ROUTING PIPES
            </p>
          </div>

          <div className="flex-1 bg-[#050505]/60 rounded-xl border border-white/[0.03] relative flex flex-col justify-around p-4 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {/* Stream Pipe 1: Telemetry */}
            <div className="flex items-center justify-between relative z-10 font-mono text-[10px]">
              <span className="w-36 text-[#8ab4f8] font-bold">telemetry.user_actions</span>
              <div className="flex-1 h-[2px] bg-white/[0.04] relative mx-4">
                {isPlaying && (
                  <div className="absolute w-2 h-2 rounded-full bg-[#8ab4f8] -top-[3px] shadow-[0_0_8px_#8ab4f8] animate-ping" style={{ left: "30%" }}></div>
                )}
              </div>
              <span className="text-gray-400">{isPlaying ? "4,282 msg/s" : "0 msg/s"}</span>
            </div>

            {/* Stream Pipe 2: Billing */}
            <div className="flex items-center justify-between relative z-10 font-mono text-[10px]">
              <span className="w-36 text-[#4edea3] font-bold">billing.transactions</span>
              <div className="flex-1 h-[2px] bg-white/[0.04] relative mx-4">
                {isPlaying && (
                  <div className="absolute w-2 h-2 rounded-full bg-[#4edea3] -top-[3px] shadow-[0_0_8px_#4edea3] animate-ping" style={{ left: "60%" }}></div>
                )}
              </div>
              <span className="text-gray-400">{isPlaying ? "148 msg/s" : "0 msg/s"}</span>
            </div>

            {/* Stream Pipe 3: Agent reasoning */}
            <div className="flex items-center justify-between relative z-10 font-mono text-[10px]">
              <span className="w-36 text-amber-500 font-bold">agents.reasoning_steps</span>
              <div className="flex-1 h-[2px] bg-white/[0.04] relative mx-4">
                {isPlaying && (
                  <div className="absolute w-2 h-2 rounded-full bg-amber-500 -top-[3px] shadow-[0_0_8px_#f59e0b] animate-ping" style={{ left: "80%" }}></div>
                )}
              </div>
              <span className="text-gray-400">{isPlaying ? "10,412 msg/s" : "0 msg/s"}</span>
            </div>
          </div>
        </section>

        {/* Latency History Graph (Col 5) */}
        <section className="lg:col-span-5 panel-layer p-5 flex flex-col h-[400px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">Mean latency index</h3>
            <p className="font-mono text-[9px] text-gray-500 mt-0.5">REALTIME TELEMETRY SHIFT // SECONDS</p>
          </div>

          <div className="flex-1 bg-[#050505]/40 rounded-xl border border-white/[0.03] flex items-end justify-center relative p-3">
            <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>

            {/* Custom Latency Sparklines */}
            <div className="w-full h-full flex items-end justify-between px-2 pt-8 gap-1.5">
              {latencyHistory.map((val, idx) => {
                const heightPct = Math.round((val / 25) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Hover tooltip */}
                    <span className="absolute -top-6 bg-[#0d0f14] border border-white/[0.1] px-1.5 py-0.5 rounded font-mono text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}ms
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-[#8ab4f8]/10 to-[#8ab4f8]/50 rounded-t border-t border-[#8ab4f8]/70"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    <span className="font-mono text-[7px] text-gray-600">t-{10 - idx}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* 4. Trigger rules & Stream Console console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* Trigger rules (Col 6) */}
        <section className="lg:col-span-6 card-layer p-5 flex flex-col min-h-[300px] justify-between">
          <div>
            <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-display text-sm font-bold text-white tracking-wide font-sans">Autonomous Action Triggers</h3>
                <p className="font-mono text-[9px] text-gray-500 mt-0.5">n8n KAFKA WEBHOOK TRIGGERS</p>
              </div>
              <button
                onClick={() => setShowAddRule(!showAddRule)}
                className="font-mono text-[9px] text-[#8ab4f8] hover:underline cursor-pointer"
              >
                {showAddRule ? "Cancel" : "+ Add Rule"}
              </button>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
              {showAddRule ? (
                <form onSubmit={handleAddRuleSubmit} className="bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.04] space-y-3">
                  <div>
                    <label className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-wider font-bold">Rule Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pipeline Spill trigger"
                      value={newRuleName}
                      onChange={e => setNewRuleName(e.target.value)}
                      className="w-full bg-[#050505]/80 border border-white/[0.06] rounded-[8px] p-2 text-xs text-white focus:outline-none focus:border-[#8ab4f8] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-wider font-bold">Trigger Rule Expression</label>
                    <input
                      type="text"
                      required
                      placeholder="If latency > 100ms -> restart consumer swarms"
                      value={newRuleExpr}
                      onChange={e => setNewRuleExpr(e.target.value)}
                      className="w-full bg-[#050505]/80 border border-white/[0.06] rounded-[8px] p-2 text-xs text-white focus:outline-none focus:border-[#8ab4f8] font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-action btn-primary text-[10px] py-2"
                  >
                    Save Trigger Rule
                  </button>
                </form>
              ) : (
                rules.map(rule => (
                  <div
                    key={rule.id}
                    className="flex justify-between items-center bg-[#050505]/40 p-3 rounded-[12px] border border-white/[0.03] hover:border-white/[0.1] transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-3">
                      <span className="text-xs font-bold text-white block font-mono">{rule.name}</span>
                      <p className="text-[10px] text-gray-400 font-light leading-normal">{rule.expression}</p>
                    </div>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`text-[8px] font-mono font-bold px-2 py-1 rounded-[6px] border shrink-0 cursor-pointer ${
                        rule.status === "ACTIVE"
                          ? "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/20"
                          : "text-gray-500 bg-white/5 border-transparent"
                      }`}
                    >
                      {rule.status}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.04] text-[8px] font-mono text-gray-500 mt-3 flex justify-between items-center">
            <span>Broker Connections: LOCALHOST:9092</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          </div>
        </section>

        {/* Fabric Stream Console (Col 6) */}
        <section className="lg:col-span-6 card-layer p-5 flex flex-col h-[300px]">
          <div className="border-b border-white/[0.04] pb-3 mb-4 flex justify-between items-center">
            <h3 className="font-display text-sm font-bold text-white tracking-wide">Fabric Stream Console</h3>
            <span className="material-symbols-outlined text-gray-500 text-sm">terminal</span>
          </div>

          <div className="flex-1 bg-[#050505]/60 border border-white/[0.03] rounded-xl p-3.5 font-mono text-[10px] overflow-y-auto text-gray-400 space-y-1.5 scrollbar-thin">
            {logs.map((log, index) => (
              <div key={index} className={`${log.colorClass || ""} flex items-start gap-1.5 leading-relaxed font-light`}>
                <span className="text-[#8ab4f8]/50 shrink-0">&raquo;</span>
                <div className="min-w-0 flex-1 truncate">
                  [{log.timestamp}] [TOPIC: <span className="text-white font-bold">{log.topic}</span>] MSG: {log.content}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
