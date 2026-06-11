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
  const [logs, setLogs] = useState<MessageLog[]>([
    { timestamp: "23:51:02", topic: "telemetry.user_actions", content: 'user_login { user_id: "usr_8912", device: "MacBook Pro" }' },
    { timestamp: "23:51:04", topic: "agents.reasoning_steps", content: 'agent_thought { role: "SDR Swarm Analyst", thought: "Ingesting target contact lists" }' },
    { timestamp: "23:51:05", topic: "billing.transactions", content: 'invoice_paid { invoice_id: "inv_90a12", amount: "$4,200.00" }' },
    { timestamp: "23:51:08", topic: "system:Trigger", content: "Executed Rule: ARR Net Runway recalculation triggered.", colorClass: "text-tertiary font-bold" },
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

  // Simulate incoming logs when streaming is active
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
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 3000);
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
      colorClass: "text-primary font-bold",
    };
    setLogs(prev => [newLog, ...prev]);
    addAuditLog("fabric.manual_ping", "Sent manual event fabric telemetry ping", "SUCCESS");
  };

  return (
    <DashboardLayout>
      <div className="space-y-md">
        
        {/* Kafka Stream Visualizer */}
        <div className="glass-panel rounded-xl p-md flex flex-col h-[420px] relative overflow-hidden">
          <div className="stream-pulse"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-sm mb-md gap-sm">
            <div>
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                Kafka Pipeline Event Topology
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">
                REAL-TIME DATA STREAM FLOW AND KAFKA BROKER ROUTING
              </p>
            </div>
            <div className="flex gap-sm items-center shrink-0">
              <button
                onClick={triggerTestEvent}
                className="bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-[10px] font-mono px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                Inject Test Event
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="border border-white/10 text-on-surface-variant text-[10px] font-mono px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
              >
                {isPlaying ? "Pause Stream" : "Resume Stream"}
              </button>
              <span className="text-xs text-tertiary font-mono font-bold tracking-wider uppercase ml-1">
                {isPlaying ? "ACTIVE" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Event streams */}
          <div className="flex-grow bg-[#050505]/60 rounded-xl border border-white/5 relative flex flex-col justify-around p-md md:p-lg overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

            {/* Stream 1: Telemetry */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-primary font-bold">telemetry.user_actions</span>
              <div className="flex-grow h-[1px] bg-white/5 relative mx-md max-w-[50%]">
                {isPlaying && <div className="animated-dot absolute w-2.5 h-2.5 rounded-full bg-primary -top-1 shadow-[0_0_8px_rgba(0,219,231,0.6)]"></div>}
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant font-bold">
                {isPlaying ? "4,282 msg/s" : "0 msg/s"}
              </span>
            </div>

            {/* Stream 2: Billing */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-tertiary font-bold">billing.transactions</span>
              <div className="flex-grow h-[1px] bg-white/5 relative mx-md max-w-[50%]">
                {isPlaying && (
                  <div
                    className="animated-dot absolute w-2.5 h-2.5 rounded-full bg-tertiary -top-1 shadow-[0_0_8px_rgba(78,222,163,0.6)]"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                )}
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant font-bold">{isPlaying ? "148 msg/s" : "0 msg/s"}</span>
            </div>

            {/* Stream 3: Agents Reasoning */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-secondary font-bold">agents.reasoning_steps</span>
              <div className="flex-grow h-[1px] bg-white/5 relative mx-md max-w-[50%]">
                {isPlaying && (
                  <div
                    className="animated-dot absolute w-2.5 h-2.5 rounded-full bg-secondary -top-1 shadow-[0_0_8px_rgba(255,185,85,0.6)]"
                    style={{ animationDelay: "1s" }}
                  ></div>
                )}
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant font-bold">
                {isPlaying ? "10,412 msg/s" : "0 msg/s"}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Autonomous Trigger Console & Event Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md pb-8">
          {/* Autonomous Triggers */}
          <div className="lg:col-span-6 glass-panel rounded-xl p-md flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
                <div>
                  <h3 className="font-display text-headline-md text-on-surface text-[18px]">Autonomous Action Triggers</h3>
                  <p className="font-mono text-xs text-on-surface-variant mt-1.5 uppercase">
                    KAFKA-CONSUMER BASED n8n WORKFLOW TRIGGERS
                  </p>
                </div>
                <button
                  onClick={() => setShowAddRule(!showAddRule)}
                  className="text-primary hover:text-primary-container text-xs font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors"
                >
                  {showAddRule ? "Cancel" : "+ Add Rule"}
                </button>
              </div>

              <div className="space-y-sm my-md max-h-[180px] overflow-y-auto pr-xs">
                {showAddRule ? (
                  <form onSubmit={handleAddRuleSubmit} className="bg-[#050505]/40 p-md rounded-xl border border-white/10 space-y-md">
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-mono mb-1.5 uppercase font-bold tracking-wider">RULE NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Memory Leak Trigger"
                        value={newRuleName}
                        onChange={e => setNewRuleName(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-sm text-xs text-white focus:outline-none focus:border-primary font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant font-mono mb-1.5 uppercase font-bold tracking-wider">EXPRESSION</label>
                      <input
                        type="text"
                        required
                        placeholder="If RAM > 90% -> trigger worker restart"
                        value={newRuleExpr}
                        onChange={e => setNewRuleExpr(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-sm text-xs text-white focus:outline-none focus:border-primary font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary text-xs py-md rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-primary-container transition-colors"
                    >
                      Save Trigger Rule
                    </button>
                  </form>
                ) : (
                  rules.map(rule => (
                    <div
                      key={rule.id}
                      className="flex justify-between items-center bg-[#050505]/40 p-md rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">Rule: {rule.name}</span>
                        <p className="text-[10px] text-on-surface-variant font-light leading-relaxed">{rule.expression}</p>
                      </div>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors border ${
                          rule.status === "ACTIVE"
                            ? "text-tertiary bg-tertiary/10 border-tertiary/20"
                            : "text-on-surface-variant/75 bg-white/5 border-white/5"
                        }`}
                      >
                        {rule.status}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-md border-t border-outline-variant/30 text-[10px] text-on-surface-variant/70 font-mono mt-md">
              Broker Connections: <span className="text-tertiary font-semibold">ACTIVE</span> (Broker Localhost:9092)
            </div>
          </div>

          {/* Event logs */}
          <div className="lg:col-span-6 glass-panel rounded-xl p-md flex flex-col h-[300px] min-h-[300px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-md flex justify-between items-center">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Fabric Stream Console</h3>
              <span className="material-symbols-outlined text-outline text-sm">terminal</span>
            </div>
            <div className="flex-1 bg-[#050505]/60 border border-white/5 rounded-xl p-md font-mono text-xs overflow-y-auto text-on-surface-variant space-y-2 select-all h-[150px]">
              {logs.map((log, index) => (
                <div key={index} className={`${log.colorClass || ""} flex items-start gap-1.5 leading-relaxed font-light`}>
                  <span className="text-primary/45 shrink-0">&raquo;</span>
                  <div>
                    [{log.timestamp}] [TOPIC: <span className="text-white font-semibold">{log.topic}</span>] MSG: {log.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
