"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Message {
  id: string;
  sender: "USER" | "SANKTRIX";
  timestamp: string;
  text: string;
  summary?: string;
  metrics?: { label: string; value: string; trend: string; isPositive: boolean; trendType: "up" | "down" }[];
  risk?: { level: string; desc: string };
  actions?: { label: string; action: string; icon: string }[];
  agentsUsed?: string[];
  sources?: string[];
  confidence?: string;
}

export default function ExecutiveCopilot() {
  const router = useRouter();
  const { addAuditLog, checkPermission, rateLimitCheck, sanitizeInput } = useSecurity();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_1",
      sender: "USER",
      timestamp: "14:02:45 UTC",
      text: "Predict next quarter revenue under 25% CAC increase",
    },
    {
      id: "msg_2",
      sender: "SANKTRIX",
      timestamp: "14:02:46 UTC",
      text: "Simulating a 25% increase in Customer Acquisition Cost (CAC) projects a short-term margin compression, but maintains overall revenue trajectory within acceptable bounds. Projected Q3 Revenue sits at $42.8M, representing a +4.2% QoQ growth despite headwinds.",
      summary: "Executive Summary",
      metrics: [
        { label: "Proj. Q3 Revenue", value: "$42.8M", trend: "+4.2% QoQ", isPositive: true, trendType: "up" },
        { label: "Simulated CAC", value: "$1,245", trend: "+25% Target Limit", isPositive: false, trendType: "up" },
        { label: "Impacted Margin", value: "68.4%", trend: "-210 bps", isPositive: false, trendType: "down" },
      ],
      risk: {
        level: "Moderate",
        desc: "The primary vulnerability lies in the enterprise segment, where extended sales cycles combined with higher CAC could depress Q4 pipeline health if conversion rates drop below 18%.",
      },
      actions: [
        { label: "Run Sensitivity Analysis", action: "/forecast Runway", icon: "query_stats" },
        { label: "Generate Board Report", action: "/boardroom", icon: "summarize" },
      ],
      agentsUsed: ["Wolfram Engine Solver", "Finance Anomaly Swarm", "Risk Modeling Twin"],
      sources: ["Stripe Telemetry Sync", "Pinecone Vector Indexes", "Enterprise Forecast DB"],
      confidence: "94.2%",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState("session_1");

  const sessions = [
    { id: "session_1", title: "Predict runway cash burn", time: "14:02 UTC" },
    { id: "session_2", title: "Compare SDR Swarm efficiency", time: "09:15 UTC" },
    { id: "session_3", title: "Q3 Headcount Allocation", time: "Yesterday" },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (!checkPermission("notes:edit")) {
      alert("Permission denied. Analyst credentials or higher required.");
      return;
    }
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }

    const sanitized = sanitizeInput(inputVal);
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: "USER",
      timestamp: new Date().toLocaleTimeString() + " UTC",
      text: sanitized,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    addAuditLog("copilot.query", `User asked: ${sanitized}`, "SUCCESS");

    // Simulate agent response compiling
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I have evaluated the request against current Wolfram datasets and organizational context.";
      let metrics: Message["metrics"] = [];
      let risk: Message["risk"] = undefined;
      let agentsUsed = ["Decision Router Agent", "Wolfram Engine Solver"];
      let sources = ["Enterprise Vector Store"];
      let confidence = "92.5%";

      const query = sanitized.toLowerCase();
      if (query.includes("burn") || query.includes("runway") || query.includes("cash")) {
        replyText = "Running Monte Carlo simulations (n=50,000) on current cash burn rates shows a baseline runway of 15.4 months. Under a pessimistic scenario, runway contracts to 12.8 months.";
        metrics = [
          { label: "Expected Runway", value: "15.4 Mo", trend: "+1.2 Mo (vs Q1)", isPositive: true, trendType: "up" },
          { label: "Optimized Runway", value: "18.2 Mo", trend: "with budget cut", isPositive: true, trendType: "up" },
          { label: "Burn Rate", value: "$340K/mo", trend: "-5.4% change", isPositive: true, trendType: "down" },
        ];
        risk = { level: "Low", desc: "Current cash reserves are sufficient to sustain operations through Q3 2027 without external funding." };
        agentsUsed = ["Finance Anomaly Swarm", "Wolfram Engine Solver", "Risk Modeling Twin"];
        sources = ["ClickHouse Financial DB", "Stripe API Sync"];
        confidence = "95.8%";
      } else if (query.includes("hiring") || query.includes("headcount")) {
        replyText = "Operational Twin analysis indicates hiring bottleneck in Product Engineering. Restructuring budget to add 5 senior engineers accelerates project milestone delivery by 14 days.";
        metrics = [
          { label: "Milestone Speedup", value: "14 Days", trend: "+8% efficiency", isPositive: true, trendType: "up" },
          { label: "Incremental Cost", value: "$65K/mo", trend: "Fully funded", isPositive: true, trendType: "up" },
        ];
        agentsUsed = ["Headcount Planner Swarm", "Product Roadmap twin"];
        sources = ["Workday HR Index", "Jira Timeline Analytics"];
        confidence = "91.2%";
      }

      const sanktrixMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: "SANKTRIX",
        timestamp: new Date().toLocaleTimeString() + " UTC",
        text: replyText,
        summary: "Executive Insight",
        metrics: metrics.length > 0 ? metrics : undefined,
        risk: risk,
        agentsUsed,
        sources,
        confidence,
      };

      setMessages(prev => [...prev, sanktrixMsg]);
    }, 1500);
  };

  // Get metadata from the latest Sanktrix message to populate live context panel
  const latestSanktrixMsg = [...messages].reverse().find(m => m.sender === "SANKTRIX");

  return (
    <DashboardLayout>
      {/* 1. Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Copilot
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Interactive decision solver integrating symbolic AI swarms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse"></span>
            Agent Sync: Active
          </div>
          <button 
            onClick={() => {
              setMessages([
                {
                  id: `msg_${Date.now()}`,
                  sender: "SANKTRIX",
                  timestamp: "Now",
                  text: "New session started. How can I assist you with enterprise decisions today?",
                  agentsUsed: ["Router Agent"],
                  sources: [],
                  confidence: "100%",
                }
              ]);
            }}
            className="btn-action btn-secondary text-[10px] py-2"
          >
            New Session
          </button>
        </div>
      </header>

      {/* 2. Overhauled 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
        
        {/* Left Column: Conversation Sessions List (Col 2.5) */}
        <aside className="lg:col-span-3 card-layer p-4 flex flex-col gap-3 h-full bg-[#07080c]/40">
          <div className="border-b border-white/[0.04] pb-2 flex justify-between items-center">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">Sessions</span>
            <span className="material-symbols-outlined text-gray-500 text-sm">history</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {sessions.map(s => {
              const isActive = activeSessionId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSessionId(s.id);
                    setInputVal(s.title);
                  }}
                  className={`w-full text-left p-2.5 rounded-[10px] transition-all flex items-start gap-2.5 cursor-pointer ${
                    isActive 
                      ? "bg-[#8ab4f8]/5 border border-[#8ab4f8]/20 text-[#8ab4f8]" 
                      : "hover:bg-white/[0.02] text-gray-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] mt-0.5 shrink-0">chat_bubble</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate text-white">{s.title}</p>
                    <span className="font-mono text-[8px] text-gray-500">{s.time}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.04] text-[9px] font-mono text-gray-500 flex justify-between items-center">
            <span>SECURE GATEWAY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          </div>
        </aside>

        {/* Center Column: Reasoning Workspace (Col 6) */}
        <section className="lg:col-span-6 card-layer p-4 flex flex-col justify-between h-full relative overflow-hidden bg-[#0d0e12]/30">
          
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-24 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${
                  msg.sender === "USER" ? "items-end" : "items-start"
                }`}
              >
                {msg.sender === "USER" ? (
                  <div className="bg-[#8ab4f8]/10 border border-[#8ab4f8]/20 p-3.5 rounded-[16px] rounded-tr-none text-white max-w-[85%]">
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    {/* Bot Title Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[13px] text-[#8ab4f8]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          smart_toy
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                        Sanktrix Engine // Core
                      </span>
                    </div>

                    {/* Chat Content Card */}
                    <div className="bg-[#050505]/40 border border-white/[0.04] p-4 rounded-[16px] space-y-4">
                      {msg.summary && (
                        <div className="flex items-center gap-1.5 border-b border-white/[0.03] pb-2 font-mono text-[9px] text-[#8ab4f8] uppercase font-bold tracking-wider">
                          <span className="material-symbols-outlined text-[12px]">subject</span>
                          {msg.summary}
                        </div>
                      )}
                      
                      <p className="text-xs leading-relaxed text-gray-200 font-sans">{msg.text}</p>

                      {/* Display inline KPI Grid if available */}
                      {msg.metrics && (
                        <div className="grid grid-cols-3 gap-2">
                          {msg.metrics.map((m, idx) => (
                            <div key={idx} className="bg-[#07080c]/50 p-2.5 border border-white/[0.03] rounded-[10px]">
                              <span className="block text-[8px] font-mono uppercase tracking-wider text-gray-500">{m.label}</span>
                              <span className="block text-xs font-bold text-white mt-0.5">{m.value}</span>
                              <span className={`block text-[8px] font-mono font-bold mt-1 ${m.isPositive ? "text-[#4edea3]" : "text-red-400"}`}>
                                {m.trend}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Display inline Risk Assessment if available */}
                      {msg.risk && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-[10px] space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-[9px] text-amber-500 uppercase font-bold">
                            <span className="material-symbols-outlined text-[12px]">warning</span>
                            Risk Analysis: {msg.risk.level}
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">{msg.risk.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px] bg-[#050505]/20 p-2.5 rounded-[10px] w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-bounce delay-100"></span>
                <span>Resolving symbolic algorithms...</span>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form wrapper */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/95 to-transparent p-4 pt-10">
            <form onSubmit={handleSendMessage} className="relative bg-[#07080c] border border-white/[0.06] rounded-[12px] overflow-hidden focus-within:border-[#8ab4f8]/50 transition-colors">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-transparent border-none text-white text-xs placeholder-gray-500 py-3 pl-4 pr-16 outline-none focus:ring-0"
                placeholder="Ask Copilot a decision request..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#001945] w-7 h-7 rounded-[8px] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] font-bold">arrow_upward</span>
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Live Context Panel (Col 3) */}
        <aside className="lg:col-span-3 card-layer p-4 flex flex-col gap-4 h-full bg-[#07080c]/40 overflow-y-auto scrollbar-thin">
          <div className="border-b border-white/[0.04] pb-2">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold block">Live Context Panel</span>
          </div>

          {/* 1. Confidence Level */}
          <div className="space-y-1.5">
            <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider block">Decision Confidence</span>
            <div className="bg-[#050505]/40 border border-white/[0.03] p-3 rounded-[12px] flex items-center justify-between">
              <span className="text-lg font-bold text-white">{latestSanktrixMsg?.confidence || "94.2%"}</span>
              <span className="font-mono text-[9px] bg-[#4edea3]/10 text-[#4edea3] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                High Trust
              </span>
            </div>
          </div>

          {/* 2. Agents Swarm Executed */}
          <div className="space-y-1.5">
            <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider block">Agents Utilized</span>
            <div className="space-y-1">
              {(latestSanktrixMsg?.agentsUsed || ["Finance Anomaly Swarm", "Wolfram Engine Solver"]).map((agent, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#050505]/30 border border-white/[0.03] p-2 rounded-[10px] text-[10px]">
                  <span className="material-symbols-outlined text-[#8ab4f8] text-[14px]">support_agent</span>
                  <span className="font-medium text-gray-300 truncate">{agent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Knowledge Base Sources */}
          <div className="space-y-1.5">
            <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider block">Sources Referenced</span>
            <div className="space-y-1">
              {(latestSanktrixMsg?.sources || ["Stripe Telemetry Sync", "Pinecone Vector Indexes"]).map((source, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#050505]/30 border border-white/[0.03] p-2 rounded-[10px] text-[10px]">
                  <span className="material-symbols-outlined text-[#4edea3] text-[14px]">link</span>
                  <span className="font-mono text-[9px] text-gray-400 truncate">{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Action Recommendation Shortcuts */}
          {latestSanktrixMsg?.actions && (
            <div className="space-y-2 mt-auto border-t border-white/[0.04] pt-3">
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-wider block">Recommended Actions</span>
              <div className="space-y-1.5">
                {latestSanktrixMsg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(act.action)}
                    className="w-full py-2 bg-[#8ab4f8]/5 hover:bg-[#8ab4f8]/10 border border-[#8ab4f8]/20 rounded-[10px] text-[#8ab4f8] text-[10px] font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[13px]">{act.icon}</span>
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </DashboardLayout>
  );
}
