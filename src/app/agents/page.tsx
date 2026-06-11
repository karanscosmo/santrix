"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "IDLE";
  task: string;
  progress: number;
  memory: string;
  cpu: string;
  icon: string;
  colorClass: string;
  logs: string[];
}

export default function AgentsPage() {
  const { addAuditLog, checkPermission } = useSecurity();
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [newAgentName, setNewAgentName] = useState<string>("");
  const [newAgentRole, setNewAgentRole] = useState<string>("Forecasting");
  const [newAgentTask, setNewAgentTask] = useState<string>("");

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "FA-902x",
      name: "Finance Analyst",
      role: "Finance",
      status: "ACTIVE",
      task: "Q3 Variance Reconciliation",
      progress: 78,
      memory: "14.2 GB / 32 GB",
      cpu: "64%",
      icon: "query_stats",
      colorClass: "text-primary",
      logs: [
        "[10:42:01] Ingesting ledger_q3_final.csv",
        "[10:42:15] Identifying anomaly in OPEX row 402",
        "[10:42:18] Running cross-reference with Q2 data...",
      ],
    },
    {
      id: "FC-114b",
      name: "Forecasting Agent",
      role: "Forecasting",
      status: "IDLE",
      task: "Awaiting input stream",
      progress: 0,
      memory: "1.1 GB / 16 GB",
      cpu: "2%",
      icon: "timeline",
      colorClass: "text-secondary",
      logs: ["Agent standing by. Awaiting event fabric telemetry ingestion."],
    },
    {
      id: "KP-889z",
      name: "KPI Intelligence",
      role: "Metrics",
      status: "ACTIVE",
      task: "Monitoring Marketing Spend Velocity",
      progress: 45,
      memory: "8.4 GB / 16 GB",
      cpu: "31%",
      icon: "insert_chart",
      colorClass: "text-tertiary",
      logs: [
        "[10:40:11] Connecting to API: Ads_Manager",
        "[10:41:05] Calculating real-time CPA...",
        "[10:42:22] Streaming data to Dashboard DB...",
      ],
    },
    {
      id: "RP-001a",
      name: "Risk Prediction",
      role: "Risk",
      status: "ACTIVE",
      task: "Supply Chain Sentiment Analysis",
      progress: 92,
      memory: "28.1 GB / 64 GB",
      cpu: "89%",
      icon: "warning",
      colorClass: "text-error",
      logs: [
        "[10:35:00] Scraping global logistics news feeds",
        "[10:38:44] FLAG: Potential disruption in Port of LA",
        "[10:42:25] Quantifying risk exposure...",
      ],
    },
    {
      id: "WC-Omega",
      name: "Wolfram Computation",
      role: "Math Engine",
      status: "ACTIVE",
      task: "Multi-variable Market Optimization Model",
      progress: 33,
      memory: "112.5 GB / 256 GB",
      cpu: "98% (Cluster)",
      icon: "functions",
      colorClass: "text-primary",
      logs: [
        "[10:30:12] Initializing symbolic computation parameters...",
        "[10:31:00] Solving system of non-linear differential equations",
        "[10:35:45] Iteration 10,000 complete. Loss: 0.042",
        "[10:40:11] Iteration 50,000 complete. Loss: 0.011",
      ],
    },
  ]);

  const handleToggleStatus = (id: string) => {
    if (!checkPermission("config:write")) {
      alert("Access Denied: Your current role does not have permission to manage AI agents.");
      return;
    }

    setAgents(prev =>
      prev.map(agent => {
        if (agent.id === id) {
          const nextStatus = agent.status === "ACTIVE" ? "IDLE" : "ACTIVE";
          addAuditLog("agents.toggle", `Toggled status of agent ${agent.name} to ${nextStatus}`, "SUCCESS");
          return {
            ...agent,
            status: nextStatus,
            progress: nextStatus === "IDLE" ? 0 : agent.progress,
            cpu: nextStatus === "IDLE" ? "1%" : "40%",
          };
        }
        return agent;
      })
    );
  };

  const handleDeployAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission("config:write")) {
      alert("Access Denied: Your current role does not have permission to deploy new agents.");
      return;
    }
    if (!newAgentName || !newAgentTask) return;

    const newAgent: Agent = {
      id: `AG-${Math.floor(100 + Math.random() * 900)}x`,
      name: newAgentName,
      role: newAgentRole,
      status: "ACTIVE",
      task: newAgentTask,
      progress: 10,
      memory: "2.4 GB / 16 GB",
      cpu: "12%",
      icon: newAgentRole === "Forecasting" ? "timeline" : "support_agent",
      colorClass: "text-primary",
      logs: [`[${new Date().toLocaleTimeString()}] Neural agent deployed and ready.`],
    };

    setAgents(prev => [...prev, newAgent]);
    addAuditLog("agents.deploy", `Deployed new neural agent: ${newAgentName}`, "SUCCESS");
    setNewAgentName("");
    setNewAgentTask("");
    setShowDeployModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-md relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface mb-xs tracking-tight font-bold text-[24px]">
              Active Neural Swarm
            </h2>
            <p className="text-xs text-on-surface-variant flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary pulse-active inline-block"></span>{" "}
              {agents.filter(a => a.status === "ACTIVE").length} Agents Active • Enterprise Cluster Beta
            </p>
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => alert("Opening general cluster settings...")}
              className="bg-surface-container-highest border border-outline-variant text-on-surface px-md py-sm rounded font-semibold text-xs tracking-wider uppercase hover:bg-surface-bright transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span> Configure
            </button>
            <button
              onClick={() => setShowDeployModal(true)}
              className="bg-primary text-on-primary px-md py-sm rounded font-semibold text-xs tracking-wider uppercase glow-primary hover:bg-primary-container transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Deploy Agent
            </button>
          </div>
        </div>

        {/* Deploy Agent Modal */}
        {showDeployModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-md">
            <div className="glass-panel w-full max-w-md rounded-xl overflow-hidden p-md space-y-md border border-primary/20">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-lg font-bold text-on-surface">Deploy Neural Agent</h3>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleDeployAgent} className="space-y-sm">
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1">AGENT NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Scoring Swarm"
                    value={newAgentName}
                    onChange={e => setNewAgentName(e.target.value)}
                    className="w-full bg-surface-container border border-outline rounded p-xs text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1">ROLE</label>
                  <select
                    value={newAgentRole}
                    onChange={e => setNewAgentRole(e.target.value)}
                    className="w-full bg-surface-container border border-outline rounded p-xs text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Forecasting">Forecasting</option>
                    <option value="Finance">Finance</option>
                    <option value="Metrics">Metrics</option>
                    <option value="Risk">Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1">TASK DESCRIPTION</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scoring qualified pipeline leads daily"
                    value={newAgentTask}
                    onChange={e => setNewAgentTask(e.target.value)}
                    className="w-full bg-surface-container border border-outline rounded p-xs text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary text-xs py-2 rounded font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Deploy
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="glass-panel rounded-lg p-md flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] gradient-wipe"></div>
              <div className="flex justify-between items-start mb-md">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary glow-primary">
                    <span className="material-symbols-outlined">{agent.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-on-surface text-[16px] font-bold">{agent.name}</h3>
                    <p className="font-mono text-on-surface-variant text-[10px] opacity-70">ID: {agent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(agent.id)}
                  className={`font-mono text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    agent.status === "ACTIVE"
                      ? "text-tertiary bg-tertiary/10 border border-tertiary/20"
                      : "text-outline bg-outline/10 border border-outline/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${agent.status === "ACTIVE" ? "bg-tertiary animate-pulse" : "bg-outline"}`}
                  ></span>{" "}
                  {agent.status}
                </button>
              </div>

              <div className="mb-md">
                <p className="font-sans text-[10px] text-on-surface-variant mb-xs font-semibold uppercase tracking-wider">
                  Current Task
                </p>
                <p className="font-sans text-xs text-on-surface truncate font-semibold">{agent.task}</p>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      agent.status === "ACTIVE" ? "bg-primary" : "bg-outline/30"
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm mb-md font-mono text-[10px] text-on-surface-variant border-y border-outline-variant/30 py-sm">
                <div>
                  <span className="block opacity-60 mb-1">Mem Usage</span>
                  <span className="text-on-surface font-semibold">{agent.memory}</span>
                </div>
                <div>
                  <span className="block opacity-60 mb-1">Compute Load</span>
                  <span className="text-on-surface font-semibold">{agent.cpu}</span>
                </div>
              </div>

              {/* Logs area */}
              <div className="bg-surface-container h-24 rounded border border-outline-variant/50 p-2 overflow-y-auto font-mono text-[10px] text-on-surface-variant/80 space-y-1">
                {agent.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex gap-2 leading-relaxed">
                    <span className="text-tertiary font-bold">LOG:</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
