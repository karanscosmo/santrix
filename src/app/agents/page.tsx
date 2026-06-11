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
        "Ingesting ledger_q3_final.csv",
        "Identifying anomaly in OPEX row 402",
        "Running cross-reference with Q2 data...",
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
      logs: ["Agent standing by. Awaiting event fabric telemetry Ingestion."],
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
        "Connecting to API: Ads_Manager",
        "Calculating real-time CPA...",
        "Streaming data to Dashboard DB...",
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
        "Scraping global logistics news feeds",
        "FLAG: Potential disruption in Port of LA",
        "Quantifying risk exposure...",
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
        "Initializing symbolic computation parameters...",
        "Solving system of non-linear differential equations",
        "Iteration 10,000 complete. Loss: 0.042",
        "Iteration 50,000 complete. Loss: 0.011",
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
      logs: [`Neural agent deployed and ready.`],
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-md mb-xl">
          <div>
            <h2 className="font-display text-3xl text-on-surface font-bold">
              Active Neural Swarm
            </h2>
            <p className="text-xs text-on-surface-variant flex items-center gap-xs mt-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary pulse-indicator inline-block"></span>{" "}
              {agents.filter(a => a.status === "ACTIVE").length} Agents Active • Enterprise Cluster Beta
            </p>
          </div>
          <div className="flex gap-sm shrink-0">
            <button
              onClick={() => alert("Opening general cluster settings...")}
              className="bg-surface-container-highest border border-white/10 text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase hover:bg-white/5 transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span> Configure
            </button>
            <button
              onClick={() => setShowDeployModal(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase glow-primary hover:bg-primary-container transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Deploy Agent
            </button>
          </div>
        </div>

        {/* Deploy Agent Modal */}
        {showDeployModal && (
          <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-md">
            <div className="glass-panel w-full max-w-md rounded-xl overflow-hidden p-md space-y-md border border-primary/20 bg-[#090b10]">
              <div className="flex justify-between items-center border-b border-white/5 pb-sm">
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Deploy Neural Agent</h3>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-on-surface-variant hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <form onSubmit={handleDeployAgent} className="space-y-md">
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1.5 uppercase font-bold tracking-wider">AGENT NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Scoring Swarm"
                    value={newAgentName}
                    onChange={e => setNewAgentName(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-sm text-xs text-white focus:outline-none focus:border-primary font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1.5 uppercase font-bold tracking-wider">ROLE</label>
                  <select
                    value={newAgentRole}
                    onChange={e => setNewAgentRole(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-sm text-xs text-white focus:outline-none focus:border-primary font-mono cursor-pointer"
                  >
                    <option value="Forecasting">Forecasting</option>
                    <option value="Finance">Finance</option>
                    <option value="Metrics">Metrics</option>
                    <option value="Risk">Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-on-surface-variant font-mono mb-1.5 uppercase font-bold tracking-wider">TASK DESCRIPTION</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scoring qualified pipeline leads daily"
                    value={newAgentTask}
                    onChange={e => setNewAgentTask(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-sm text-xs text-white focus:outline-none focus:border-primary font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary text-xs py-md rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-primary-container transition-colors"
                >
                  Deploy Swarm Agent
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md pb-8">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="glass-panel rounded-xl p-md flex flex-col relative overflow-hidden group hover:border-primary/40 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 group-hover:bg-primary/50 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-md">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary glow-primary">
                    <span className="material-symbols-outlined text-lg">{agent.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-white text-sm font-bold leading-none">{agent.name}</h3>
                    <p className="font-mono text-on-surface-variant text-[9px] mt-1 tracking-wider uppercase opacity-75">ID: {agent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(agent.id)}
                  className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    agent.status === "ACTIVE"
                      ? "text-tertiary bg-tertiary/10 border-tertiary/20"
                      : "text-on-surface-variant/70 bg-[#050505]/40 border-white/5"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${agent.status === "ACTIVE" ? "bg-tertiary animate-pulse" : "bg-on-surface-variant/40"}`}
                  ></span>{" "}
                  {agent.status}
                </button>
              </div>

              <div className="mb-md bg-[#050505]/30 p-sm rounded-lg border border-white/5">
                <p className="font-sans text-[9px] text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
                  Current Task Execution
                </p>
                <p className="font-sans text-xs text-white truncate font-medium">{agent.task}</p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      agent.status === "ACTIVE" ? "bg-primary shadow-[0_0_8px_rgba(0,219,231,0.5)]" : "bg-white/10"
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm mb-md font-mono text-[9px] text-on-surface-variant border-y border-white/5 py-sm">
                <div>
                  <span className="block opacity-65 mb-0.5">Mem Usage</span>
                  <span className="text-white font-bold">{agent.memory}</span>
                </div>
                <div>
                  <span className="block opacity-65 mb-0.5">Compute Load</span>
                  <span className="text-white font-bold">{agent.cpu}</span>
                </div>
              </div>

              {/* Logs area */}
              <div className="bg-[#050505]/60 h-24 rounded-lg border border-white/5 p-sm overflow-y-auto font-mono text-[9px] text-on-surface-variant/80 space-y-1.5">
                {agent.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-tertiary font-bold shrink-0">LOG:</span>
                    <span className="font-light">{log}</span>
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
