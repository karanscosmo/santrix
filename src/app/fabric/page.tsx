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
    { timestamp: "23:51:08", topic: "system:Trigger", content: "Executed Rule: ARR Net Runway recalculation triggered.", colorClass: "text-tertiary" },
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
            <div className="flex gap-sm items-center">
              <button
                onClick={triggerTestEvent}
                className="bg-primary/20 hover:bg-primary/30 border border-primary text-primary text-[10px] font-mono px-2 py-1 rounded cursor-pointer transition-colors"
              >
                Inject Test Event
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="border border-outline text-on-surface-variant text-[10px] font-mono px-2 py-1 rounded cursor-pointer hover:bg-surface-container-highest transition-all"
              >
                {isPlaying ? "Pause Stream" : "Resume Stream"}
              </button>
              <span className="text-xs text-tertiary font-mono">
                STATUS: {isPlaying ? "NOMINAL (LAG: 0ms)" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Event streams */}
          <div className="flex-grow bg-surface-container-lowest/30 rounded border border-outline-variant/30 relative flex flex-col justify-around p-lg overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

            {/* Stream 1: Telemetry */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-primary">telemetry.user_actions</span>
              <div className="flex-grow h-0.5 bg-outline-variant relative mx-md max-w-[50%]">
                {isPlaying && <div className="animated-dot absolute w-2 h-2 rounded-full bg-primary -top-1"></div>}
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {isPlaying ? "4,282 msg/s" : "0 msg/s"}
              </span>
            </div>

            {/* Stream 2: Billing */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-tertiary">billing.transactions</span>
              <div className="flex-grow h-0.5 bg-outline-variant relative mx-md max-w-[50%]">
                {isPlaying && (
                  <div
                    className="animated-dot absolute w-2 h-2 rounded-full bg-tertiary -top-1"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                )}
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">{isPlaying ? "148 msg/s" : "0 msg/s"}</span>
            </div>

            {/* Stream 3: Agents Reasoning */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs w-44 text-secondary">agents.reasoning_steps</span>
              <div className="flex-grow h-0.5 bg-outline-variant relative mx-md max-w-[50%]">
                {isPlaying && (
                  <div
                    className="animated-dot absolute w-2 h-2 rounded-full bg-secondary -top-1"
                    style={{ animationDelay: "1s" }}
                  ></div>
                )}
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">
                {isPlaying ? "10,412 msg/s" : "0 msg/s"}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Autonomous Trigger Console & Event Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Autonomous Triggers */}
          <div className="lg:col-span-6 glass-panel rounded-xl p-md flex flex-col justify-between">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">Autonomous Action Triggers</h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">
                  KAFKA-CONSUMER BASED n8n WORKFLOW TRIGGERS
                </p>
              </div>
              <button
                onClick={() => setShowAddRule(!showAddRule)}
                className="text-primary hover:underline text-xs font-semibold uppercase tracking-wider text-[10px]"
              >
                {showAddRule ? "Cancel" : "Add Rule"}
              </button>
            </div>

            <div className="space-y-sm my-md max-h-[180px] overflow-y-auto pr-xs">
              {showAddRule ? (
                <form onSubmit={handleAddRuleSubmit} className="bg-surface-container p-sm rounded border border-primary/40 space-y-sm">
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-mono mb-1">RULE NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Memory Leak Trigger"
                      value={newRuleName}
                      onChange={e => setNewRuleName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline rounded p-xs text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant font-mono mb-1">EXPRESSION</label>
                    <input
                      type="text"
                      required
                      placeholder="If RAM > 90% -> trigger worker restart"
                      value={newRuleExpr}
                      onChange={e => setNewRuleExpr(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline rounded p-xs text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary text-xs py-1 rounded font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    Save Rule
                  </button>
                </form>
              ) : (
                rules.map(rule => (
                  <div
                    key={rule.id}
                    className="flex justify-between items-center bg-surface-container p-sm rounded border border-outline-variant"
                  >
                    <div>
                      <span className="text-xs font-bold text-on-surface block">Rule: {rule.name}</span>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{rule.expression}</p>
                    </div>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        rule.status === "ACTIVE" ? "text-tertiary bg-tertiary/10" : "text-outline bg-outline/10"
                      }`}
                    >
                      {rule.status}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-sm border-t border-outline-variant/30 text-[10px] text-on-surface-variant font-mono">
              Broker Connections: Active (Broker Localhost:9092)
            </div>
          </div>

          {/* Event logs */}
          <div className="lg:col-span-6 glass-panel rounded-xl p-md flex flex-col h-[280px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Fabric Stream Console</h3>
              <span className="material-symbols-outlined text-outline text-sm">terminal</span>
            </div>
            <div className="flex-grow bg-surface-container-lowest border border-outline-variant/60 rounded p-sm font-mono text-xs overflow-y-auto text-on-surface-variant space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={log.colorClass || ""}>
                  [{log.timestamp}] [TOPIC: {log.topic}] MSG: {log.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
