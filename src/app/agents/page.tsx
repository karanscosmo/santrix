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
      colorClass: "text-[#8ab4f8]",
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
      colorClass: "text-[#8ab4f8]",
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
      colorClass: "text-amber-500",
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
      colorClass: "text-red-400",
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
      colorClass: "text-[#8ab4f8]",
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
      colorClass: "text-[#8ab4f8]",
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
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Active Neural Swarms
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Deploy and manage autonomous reasoning swarms for compute optimization.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            {agents.filter(a => a.status === "ACTIVE").length} Swarms Active
          </div>
          {/* Action Contexts */}
          <button
            onClick={() => setShowDeployModal(true)}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Deploy Swarm Agent
          </button>
        </div>
      </header>

      {/* 2. Deploy Agent Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0b0e]/95 backdrop-blur-2xl w-full max-w-md rounded-[18px] overflow-hidden p-5 space-y-4 border border-white/[0.06] shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Deploy Neural Agent</h3>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleDeployAgent} className="space-y-4">
              <div>
                <label className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-wider font-bold">AGENT NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Scoring Swarm"
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] p-2.5 text-xs text-white focus:outline-none focus:border-[#8ab4f8] font-sans"
                />
              </div>
              <div>
                <label className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-wider font-bold">ROLE</label>
                <select
                  value={newAgentRole}
                  onChange={e => setNewAgentRole(e.target.value)}
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] p-2.5 text-xs text-white focus:outline-none focus:border-[#8ab4f8] font-mono cursor-pointer"
                >
                  <option value="Forecasting">Forecasting</option>
                  <option value="Finance">Finance</option>
                  <option value="Metrics">Metrics</option>
                  <option value="Risk">Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-[8px] text-gray-500 font-mono mb-1 uppercase tracking-wider font-bold">TASK DESCRIPTION</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scoring qualified pipeline leads daily"
                  value={newAgentTask}
                  onChange={e => setNewAgentTask(e.target.value)}
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] p-2.5 text-xs text-white focus:outline-none focus:border-[#8ab4f8] font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full btn-action btn-primary py-2.5 text-[10px]"
              >
                Deploy Swarm Agent
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Agent Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="card-layer p-5 flex flex-col relative overflow-hidden group hover:border-[#8ab4f8]/30 transition-all"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#8ab4f8]/10 group-hover:bg-[#8ab4f8]/35 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#8ab4f8]/10 border border-[#8ab4f8]/20 flex items-center justify-center text-[#8ab4f8] shadow-sm">
                  <span className="material-symbols-outlined text-lg">{agent.icon}</span>
                </div>
                <div>
                  <h3 className="font-display text-white text-xs md:text-sm font-bold leading-none">{agent.name}</h3>
                  <p className="font-mono text-gray-500 text-[8px] mt-1 tracking-wider uppercase">ID: {agent.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleStatus(agent.id)}
                className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-[6px] border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  agent.status === "ACTIVE"
                    ? "text-[#4edea3] bg-[#4edea3]/10 border-[#4edea3]/20"
                    : "text-gray-500 bg-white/5 border-transparent"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "ACTIVE" ? "bg-[#4edea3] animate-pulse" : "bg-gray-500"}`}></span>
                {agent.status}
              </button>
            </div>

            <div className="mb-4 bg-[#050505]/30 p-3 rounded-[12px] border border-white/[0.03]">
              <span className="font-mono text-[8px] text-gray-500 mb-1 uppercase tracking-widest block font-bold">
                Task Execution
              </span>
              <p className="font-sans text-xs text-white truncate font-medium">{agent.task}</p>
              
              <div className="w-full bg-white/[0.03] h-1 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    agent.status === "ACTIVE" ? "bg-[#8ab4f8]" : "bg-white/10"
                  }`}
                  style={{ width: `${agent.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-[9px] text-gray-400 border-y border-white/[0.04] py-3">
              <div>
                <span className="block text-gray-500 mb-0.5">Mem Allocation</span>
                <span className="text-white font-bold">{agent.memory}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-0.5">CPU Load</span>
                <span className="text-white font-bold">{agent.cpu}</span>
              </div>
            </div>

            {/* Live Logs console */}
            <div className="bg-[#050505]/60 h-24 rounded-[12px] border border-white/[0.03] p-3 overflow-y-auto font-mono text-[8px] text-gray-400 space-y-1 scrollbar-thin">
              {agent.logs.map((log, lIdx) => (
                <div key={lIdx} className="flex items-start gap-1 leading-relaxed">
                  <span className="text-[#4edea3] font-bold shrink-0">EXEC:</span>
                  <span className="font-light">{log}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}
