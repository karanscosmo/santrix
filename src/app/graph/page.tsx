"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

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
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const nodes: GraphNode[] = [
    {
      id: "central",
      type: "CORE SYSTEM",
      title: "Sanktrix Executive OS",
      desc: "Primary orchestration kernel executing multi-agent processes and symbolic math pipelines.",
      links: ["SDR Swarm (Workflow)", "ARR Dashboard (Report)", "Karan Sharma (Owner)"],
      icon: "smart_toy",
      colorClass: "border-[#8ab4f8] text-[#8ab4f8]",
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
      colorClass: "border-amber-500 text-amber-500",
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
      colorClass: "border-teal-400 text-teal-400",
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
      colorClass: "border-red-400 text-red-400",
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
      colorClass: "border-[#8ab4f8] text-[#8ab4f8]",
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

  const handleZoom = (type: "in" | "out" | "reset") => {
    if (type === "in") setZoom(prev => Math.min(prev + 0.1, 2.0));
    else if (type === "out") setZoom(prev => Math.max(prev - 0.1, 0.5));
    else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const handlePan = (direction: "up" | "down" | "left" | "right") => {
    const step = 40;
    setPan(prev => {
      if (direction === "up") return { ...prev, y: prev.y - step };
      if (direction === "down") return { ...prev, y: prev.y + step };
      if (direction === "left") return { ...prev, x: prev.x - step };
      return { ...prev, x: prev.x + step };
    });
  };

  // Filter logic
  const filteredNodes = nodes.filter(node => {
    const matchesSearch =
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.type.toLowerCase().includes(searchQuery.toLowerCase());

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
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Knowledge Graph Explorer
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Semantic enterprise vector relationships canvas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            Vectors: 45,000 Index Nodes
          </div>
          {/* Action Contexts */}
          <button
            onClick={reIndexEmbeddings}
            className="btn-action btn-primary text-[10px] py-2"
          >
            Re-Index Embeddings
          </button>
        </div>
      </header>

      {/* 2. Graph Filter Controls Panel */}
      <div className="card-layer p-3 flex flex-wrap gap-4 justify-between items-center bg-[#0d0e12]/30">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <span className="material-symbols-outlined text-[#8ab4f8] text-lg">search</span>
          <input
            type="text"
            placeholder="Search entity node maps (e.g. SDR, Karan, ARR)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#050505]/40 border border-white/[0.06] rounded-[8px] px-3 py-1.5 text-xs text-white placeholder-gray-500 w-full focus:outline-none focus:border-[#8ab4f8]"
          />
        </div>
        <div className="flex flex-wrap gap-1 font-mono text-[9px] text-gray-400">
          {["ALL", "PEOPLE", "WORKFLOWS", "REPORTS", "KPIS"].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-[6px] cursor-pointer transition-colors border ${
                activeFilter === filter
                  ? "bg-[#8ab4f8]/10 text-[#8ab4f8] border-[#8ab4f8]/30"
                  : "border-transparent hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              {filter === "ALL" ? "All Nodes" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Graph Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG/Canvas Node Area (Col 8) */}
        <div className="lg:col-span-8 panel-layer p-5 flex flex-col h-[520px] relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3 mb-4">
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">Knowledge Canvas</h3>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">DRAG OR PAN GRAPH FOR DEEP MAPPING RELATIONSHIPS</p>
            </div>

            {/* Pan & Zoom Toolbar */}
            <div className="flex items-center gap-1.5 bg-[#050505]/60 border border-white/[0.06] rounded-[8px] p-1">
              <button
                onClick={() => handlePan("left")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Pan Left"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              </button>
              <button
                onClick={() => handlePan("up")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Pan Up"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
              </button>
              <button
                onClick={() => handlePan("down")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Pan Down"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_downward</span>
              </button>
              <button
                onClick={() => handlePan("right")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Pan Right"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
              <div className="w-[1px] h-4 bg-white/[0.08] mx-1"></div>
              <button
                onClick={() => handleZoom("in")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[15px]">zoom_in</span>
              </button>
              <button
                onClick={() => handleZoom("out")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[15px]">zoom_out</span>
              </button>
              <button
                onClick={() => handleZoom("reset")}
                className="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                title="Reset Canvas"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* SVG Map Canvas Wrapper */}
          <div className="flex-grow bg-[#050505]/50 rounded-xl border border-white/[0.03] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

            {/* Transformable Canvas Container */}
            <div
              className="w-full h-full relative transition-all duration-300 ease-out"
              style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
            >
              {/* Connector Edges SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Lines mapping (based on node x, y coords) */}
                <line x1="380" y1="250" x2="180" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="380" y1="250" x2="580" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="380" y1="250" x2="180" y2="370" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="380" y1="250" x2="580" y2="370" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

                {/* Animated Edge Pulse nodes */}
                <circle r="3" fill="#8ab4f8" className="animate-ping">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 380 250 L 180 110" />
                </circle>
                <circle r="3" fill="#4edea3" className="animate-ping">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M 380 250 L 580 110" />
                </circle>
                <circle r="3" fill="#f28b82" className="animate-ping">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M 380 250 L 180 370" />
                </circle>
              </svg>

              {/* Dynamic Interactive Nodes */}
              {nodes.map(node => {
                const isFilteredOut = !filteredNodes.some(fn => fn.id === node.id);
                const isSelected = selectedNodeId === node.id;
                let positionStyles: React.CSSProperties = {};

                if (node.id === "central") {
                  positionStyles = { left: "320px", top: "210px" };
                } else if (node.id === "sdr") {
                  positionStyles = { left: "120px", top: "70px" };
                } else if (node.id === "arr") {
                  positionStyles = { left: "520px", top: "70px" };
                } else if (node.id === "burn") {
                  positionStyles = { left: "120px", top: "330px" };
                } else if (node.id === "owner") {
                  positionStyles = { left: "520px", top: "330px" };
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => inspectNode(node.id)}
                    style={positionStyles}
                    className={`absolute bg-[#0d0e12]/95 border p-3 rounded-[14px] text-center cursor-pointer transition-all z-10 w-32 ${
                      isSelected 
                        ? "border-[#8ab4f8] shadow-[0_0_20px_rgba(138,180,248,0.2)] scale-105" 
                        : "border-white/[0.06] hover:border-[#8ab4f8]/50"
                    } ${isFilteredOut ? "opacity-20 scale-90" : "opacity-100"}`}
                  >
                    <span className="material-symbols-outlined text-lg text-[#8ab4f8]">{node.icon}</span>
                    <div className="font-mono text-[10px] mt-1 font-bold truncate text-white">{node.title}</div>
                    <span className="text-[8px] text-gray-500 block uppercase truncate mt-0.5">{node.type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel Sidebar (Col 4) */}
        <div className="lg:col-span-4 panel-layer p-5 flex flex-col justify-between h-[520px]">
          <div className="space-y-4">
            <div className="border-b border-white/[0.04] pb-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide">Relationship Inspector</h3>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">SEMANTIC GRAPH PATHWAY TELEMETRY</p>
            </div>

            <div className="bg-[#050505]/40 p-4 rounded-[12px] border border-white/[0.03] space-y-2">
              <span className="font-sans text-[8px] text-[#8ab4f8] block font-bold uppercase tracking-widest">
                ENTITY TYPE: {selectedNode.type}
              </span>
              <h4 className="font-bold text-xs text-white mt-1">{selectedNode.title}</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">{selectedNode.desc}</p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest block">
                Connected Nodes
              </span>
              <div className="space-y-1">
                {selectedNode.links.map((link, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-[#050505]/20 border border-white/[0.02] p-2.5 rounded-[10px] font-mono text-[10px] text-white"
                  >
                    <span className="w-1.5 h-1.5 bg-[#8ab4f8] rounded-full"></span>
                    <span>{link}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.04]">
            <button
              onClick={reIndexEmbeddings}
              className="w-full btn-action btn-primary py-3 text-[10px]"
            >
              Re-Index Vector Space
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
