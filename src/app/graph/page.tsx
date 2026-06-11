"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface GraphNode {
  id: string;
  type: "CORE SYSTEM" | "WORKFLOW" | "REPORT" | "KPI NODE" | "PEOPLE NODE";
  title: string;
  desc: string;
  links: string[];
  icon: string;
  colorClass: string;
  x: number;
  y: number;
}

export default function KnowledgeGraphPage() {
  const { addAuditLog } = useSecurity();
  const [selectedNodeId, setSelectedNodeId] = useState<string>("central");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const nodes: GraphNode[] = [
    {
      id: "central",
      type: "CORE SYSTEM",
      title: "Sanktrix Executive OS",
      desc: "Primary orchestration kernel executing multi-agent processes and symbolic math pipelines.",
      links: ["SDR Swarm (Workflow)", "ARR Dashboard (Report)", "Karan Sharma (Owner)"],
      icon: "smart_toy",
      colorClass: "border-primary text-primary",
      x: 320,
      y: 230,
    },
    {
      id: "sdr",
      type: "WORKFLOW",
      title: "SDR Swarm",
      desc: "Autonomous sales development workflow. Auto-calls contacts, crafts outreach, tracks ARR bookings.",
      links: ["Executive OS (Dependent)", "Karan Sharma (Supervisor)"],
      icon: "support_agent",
      colorClass: "border-tertiary text-tertiary",
      x: 120,
      y: 90,
    },
    {
      id: "arr",
      type: "REPORT",
      title: "ARR Dashboard",
      desc: "Realtime ARR monitoring report compiling SaaS MRR variables from Stripe and Salesforce API links.",
      links: ["Executive OS (Input)", "ARR Net Runway (KPI Node)"],
      icon: "assessment",
      colorClass: "border-secondary text-secondary",
      x: 520,
      y: 90,
    },
    {
      id: "burn",
      type: "KPI NODE",
      title: "ARR Net Runway",
      desc: "Key performance metric indicating months of remaining runway. Connected to ClickHouse mathematical projection databases.",
      links: ["ARR Dashboard (Input)"],
      icon: "trending_down",
      colorClass: "border-error text-error",
      x: 120,
      y: 350,
    },
    {
      id: "owner",
      type: "PEOPLE NODE",
      title: "Karan Sharma",
      desc: "Founder & CEO. Primary strategic authority with root permissions over multi-agent workflows and execution triggers.",
      links: ["Executive OS (Orchestrates)", "SDR Swarm (Supervises)"],
      icon: "person",
      colorClass: "border-primary text-primary",
      x: 520,
      y: 350,
    },
  ];

  const inspectNode = (id: string) => {
    setSelectedNodeId(id);
    addAuditLog("graph.inspect_node", `Inspected knowledge node: ${id}`, "SUCCESS");
  };

  const reIndexEmbeddings = () => {
    addAuditLog("graph.reindex", "Vector embeddings re-index triggered", "SUCCESS");
    alert("Regenerating vector mapping nodes... Pinecone db synchronization started.");
  };

  // Filter logic
  const filteredNodes = nodes.filter(node => {
    // Search query filter
    const matchesSearch =
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    if (!matchesSearch) return false;
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PEOPLE" && node.type === "PEOPLE NODE") return true;
    if (activeFilter === "WORKFLOWS" && node.type === "WORKFLOW") return true;
    if (activeFilter === "REPORTS" && node.type === "REPORT") return true;
    if (activeFilter === "KPIS" && node.type === "KPI NODE") return true;
    return false;
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Row 1: Graph Filter Controls */}
        <div className="glass-panel p-sm rounded-xl flex flex-wrap gap-md justify-between items-center relative overflow-hidden">
          <div className="stream-pulse"></div>
          <div className="flex items-center gap-md flex-grow">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
            <input
              type="text"
              placeholder="Search knowledge nodes (e.g. Q3 ARR, SDR swarm, temporal)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-surface-container-high border border-outline-variant/60 rounded px-md py-xs text-xs text-on-surface placeholder-on-surface-variant/50 w-full max-w-md focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-sm font-mono text-[10px] text-on-surface-variant">
            {["ALL", "PEOPLE", "WORKFLOWS", "REPORTS", "KPIS"].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  activeFilter === filter
                    ? "bg-primary/20 text-primary border border-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                {filter === "ALL" ? "All Nodes" : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Node Graph & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* Node Graph Display */}
          <div className="lg:col-span-8 glass-panel rounded-xl p-md flex flex-col h-[520px] relative overflow-hidden">
            {/* SVG Connections & Nodes */}
            <div className="flex-grow bg-surface-container-lowest/30 rounded border border-outline-variant/30 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-primary/5 via-surface-dim to-surface-lowest pointer-events-none"></div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Central (320, 230) -> SDR (120, 90) */}
                <line
                  x1="320"
                  y1="230"
                  x2="160"
                  y2="130"
                  stroke="#424655"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
                {/* Central (320, 230) -> ARR (520, 90) */}
                <line
                  x1="320"
                  y1="230"
                  x2="480"
                  y2="130"
                  stroke="#424655"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
                {/* Central (320, 230) -> Burn (120, 350) */}
                <line
                  x1="320"
                  y1="230"
                  x2="160"
                  y2="330"
                  stroke="#424655"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
                {/* Central (320, 230) -> Owner (520, 350) */}
                <line
                  x1="320"
                  y1="230"
                  x2="480"
                  y2="330"
                  stroke="#424655"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Central Node */}
              {nodes.map(node => {
                const isFilteredOut = !filteredNodes.some(fn => fn.id === node.id);
                const isSelected = selectedNodeId === node.id;
                let positionStyles: React.CSSProperties = {};

                if (node.id === "central") {
                  positionStyles = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
                } else if (node.id === "sdr") {
                  positionStyles = { left: "10%", top: "15%" };
                } else if (node.id === "arr") {
                  positionStyles = { right: "10%", top: "15%" };
                } else if (node.id === "burn") {
                  positionStyles = { left: "10%", bottom: "15%" };
                } else if (node.id === "owner") {
                  positionStyles = { right: "10%", bottom: "15%" };
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => inspectNode(node.id)}
                    style={positionStyles}
                    className={`absolute bg-surface-container border p-sm rounded text-center cursor-pointer transition-all z-10 w-32 ${
                      isSelected ? "border-white glow-primary scale-105" : "border-outline-variant hover:border-primary"
                    } ${isFilteredOut ? "opacity-20 scale-90" : "opacity-100"}`}
                  >
                    <span className="material-symbols-outlined text-xl">{node.icon}</span>
                    <div className="font-mono text-xs mt-1 font-bold truncate">{node.title}</div>
                    <span className="text-[9px] text-on-surface-variant block uppercase truncate">{node.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relationship Inspector */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between h-[520px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Relationship Inspector</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">SEMANTIC GRAPH PATHWAY TELEMETRY</p>
            </div>

            <div className="flex-grow space-y-md my-md overflow-y-auto pr-xs">
              <div className="bg-surface-container p-sm rounded border border-outline-variant">
                <span className="font-sans text-[10px] text-primary block font-semibold uppercase tracking-wider">
                  ENTITY TYPE: {selectedNode.type}
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">{selectedNode.title}</h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{selectedNode.desc}</p>
              </div>
              <div className="space-y-xs">
                <span className="font-sans text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider block">
                  Connected Entities
                </span>
                <ul className="text-xs space-y-1 text-on-surface font-mono">
                  {selectedNode.links.map((link, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30">
              <button
                onClick={reIndexEmbeddings}
                className="w-full bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase text-center py-sm rounded hover:bg-primary-container transition-all cursor-pointer"
              >
                Re-Index Vector Embeddings
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
