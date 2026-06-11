"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface Message {
  id: string;
  sender: "USER" | "SANKTRIX";
  timestamp: string;
  text: string;
  summary?: string;
  metrics?: { label: string; value: string; trend: string; isPositive: boolean; trendType: "up" | "down" }[];
  risk?: { level: string; desc: string };
  actions?: { label: string; action: string; icon: string }[];
}

export default function ExecutiveCopilot() {
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
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

      const query = sanitized.toLowerCase();
      if (query.includes("burn") || query.includes("runway") || query.includes("cash")) {
        replyText = "Running Monte Carlo simulations (n=50,000) on current cash burn rates shows a baseline runway of 15.4 months. Under a pessimistic scenario, runway contracts to 12.8 months.";
        metrics = [
          { label: "Expected Runway", value: "15.4 Mo", trend: "+1.2 Mo (vs Q1)", isPositive: true, trendType: "up" },
          { label: "Optimized Runway", value: "18.2 Mo", trend: "with budget cut", isPositive: true, trendType: "up" },
          { label: "Burn Rate", value: "$340K/mo", trend: "-5.4% change", isPositive: true, trendType: "down" },
        ];
        risk = { level: "Low", desc: "Current cash reserves are sufficient to sustain operations through Q3 2027 without external funding." };
      } else if (query.includes("hiring") || query.includes("headcount")) {
        replyText = "Operational Twin analysis indicates hiring bottleneck in Product Engineering. Restructuring budget to add 5 senior engineers accelerates project milestone delivery by 14 days.";
        metrics = [
          { label: "Milestone Speedup", value: "14 Days", trend: "+8% efficiency", isPositive: true, trendType: "up" },
          { label: "Incremental Cost", value: "$65K/mo", trend: "Fully funded", isPositive: true, trendType: "up" },
        ];
      }

      const sanktrixMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: "SANKTRIX",
        timestamp: new Date().toLocaleTimeString() + " UTC",
        text: replyText,
        summary: "Executive Insight",
        metrics: metrics.length > 0 ? metrics : undefined,
        risk: risk,
      };

      setMessages(prev => [...prev, sanktrixMsg]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] relative">
        {/* Central Chat Interface */}
        <section className="flex-1 flex flex-col relative pr-8">
          {/* Scrollable Conversation Area */}
          <div className="flex-1 overflow-y-auto pb-32 flex flex-col gap-lg">
            {/* Session Marker */}
            <div className="flex justify-center">
              <span className="font-mono text-[9px] text-outline px-sm py-xs border border-outline-variant rounded-full bg-surface-container-low">
                COGNITIVE SESSION // SECURE
              </span>
            </div>

            {/* Message History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-2 ${
                  msg.sender === "USER" ? "self-end max-w-[80%]" : "self-start w-full max-w-4xl"
                }`}
              >
                {msg.sender === "USER" ? (
                  <div className="glass-panel p-md rounded-xl rounded-tr-none border border-outline-variant/30 text-on-surface">
                    <div className="flex items-center gap-sm mb-sm text-on-surface-variant opacity-70">
                      <span className="material-symbols-outlined text-sm">account_circle</span>
                      <span className="font-sans text-[10px] uppercase font-bold">EXECUTIVE_USER</span>
                    </div>
                    <p className="font-display text-[16px] font-medium leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-md">
                    {/* Header */}
                    <div className="flex items-center gap-md text-primary">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center relative overflow-hidden">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          smart_toy
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest">Sanktrix Engine</span>
                        <span className="font-mono text-[9px] text-on-surface-variant">Response Synchronized</span>
                      </div>
                    </div>

                    {/* Response Card */}
                    <div className="glass-panel rounded-xl overflow-hidden relative border border-primary/20 p-lg flex flex-col gap-lg">
                      <div className="h-[2px] w-full absolute top-0 left-0 bg-primary/20 stream-pulse"></div>
                      
                      <div>
                        {msg.summary && (
                          <h3 className="font-sans text-[10px] uppercase font-bold text-on-surface-variant mb-xs flex items-center gap-sm">
                            <span className="material-symbols-outlined text-sm">subject</span>
                            {msg.summary}
                          </h3>
                        )}
                        <p className="text-sm leading-relaxed text-on-surface">{msg.text}</p>
                      </div>

                      {/* Dynamic Metrics grids */}
                      {msg.metrics && (
                        <div className="grid grid-cols-3 gap-md">
                          {msg.metrics.map((m, idx) => (
                            <div key={idx} className="bg-surface-container p-sm border border-outline-variant rounded-lg flex flex-col gap-xs">
                              <span className="font-sans text-[9px] uppercase font-bold text-on-surface-variant">{m.label}</span>
                              <span className="font-display text-lg font-bold text-on-surface">{m.value}</span>
                              <div className={`flex items-center gap-1 font-mono text-[9px] mt-auto ${m.isPositive ? "text-tertiary" : "text-error"}`}>
                                <span className="material-symbols-outlined text-xs">
                                  {m.trendType === "up" ? "trending_up" : "trending_down"}
                                </span>
                                {m.trend}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Risk Assessment Popovers */}
                      {msg.risk && (
                        <div className="bg-secondary-container/10 border border-secondary/30 rounded-lg p-sm">
                          <h3 className="font-sans text-[10px] uppercase font-bold text-secondary mb-xs flex items-center gap-sm">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            Risk Assessment: {msg.risk.level}
                          </h3>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{msg.risk.desc}</p>
                        </div>
                      )}

                      {/* Recommendations Buttons */}
                      {msg.actions && (
                        <div>
                          <h3 className="font-sans text-[10px] uppercase font-bold text-on-surface-variant mb-sm flex items-center gap-sm">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Recommended Actions
                          </h3>
                          <div className="flex gap-md">
                            {msg.actions.map((act, idx) => (
                              <button
                                key={idx}
                                className="flex-1 py-sm px-md rounded border border-primary/50 text-primary font-sans text-[10px] uppercase font-bold hover:bg-primary/10 transition flex items-center justify-center gap-sm cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-xs">{act.icon}</span>
                                {act.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-on-surface-variant font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200"></span>
                <span>Sanktrix compiling agent observations...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-xl">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative glass-panel rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all bg-[#0d0e12]">
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
                className="w-full bg-transparent border-none text-on-surface text-sm placeholder-on-surface-variant/50 focus:ring-0 resize-none py-md pl-lg pr-24 outline-none"
                placeholder="Ask Copilot a follow-up query... (e.g. Predict runway cash burn)"
                rows={1}
              />
              <div className="absolute right-sm top-1/2 -translate-y-1/2 flex items-center gap-sm">
                <button
                  type="submit"
                  className="w-8 h-8 rounded bg-primary text-on-primary hover:bg-primary/95 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </div>
            </form>
            <div className="text-center mt-sm">
              <span className="font-mono text-[9px] text-on-surface-variant/50">
                Sanktrix uses deterministic computational solvers. Verify key metrics before committing actions.
              </span>
            </div>
          </div>
        </section>

        {/* Right Side Panel: History */}
        <aside className="w-80 border-l border-outline-variant bg-surface-container-low flex flex-col rounded-xl overflow-hidden">
          <div className="flex border-b border-outline-variant font-sans text-xs">
            <button className="flex-1 py-md border-b-2 border-primary text-primary font-bold bg-primary-container/5">
              History
            </button>
            <button className="flex-grow py-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors">
              Insights
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-md flex flex-col gap-xs">
            <h4 className="font-mono text-[9px] text-outline mt-sm mb-xs px-sm">TODAY</h4>
            <button
              onClick={() => setInputVal("Predict runway cash burn")}
              className="w-full text-left p-sm rounded hover:bg-surface-container-highest transition-colors group flex items-start gap-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant mt-0.5">chat_bubble</span>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-on-surface truncate">Predict runway cash burn</span>
                <span className="font-mono text-[9px] text-on-surface-variant">14:02 UTC</span>
              </div>
            </button>
            <button
              onClick={() => setInputVal("Compare SDR Swarm efficiency")}
              className="w-full text-left p-sm rounded hover:bg-surface-container-highest transition-colors group flex items-start gap-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant mt-0.5">chat_bubble</span>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-on-surface truncate">Compare SDR Swarm efficiency</span>
                <span className="font-mono text-[9px] text-on-surface-variant">09:15 UTC</span>
              </div>
            </button>
          </div>
          <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex items-center justify-between font-mono text-[9px] text-on-surface-variant mb-sm">
              <span>Token Context Window</span>
              <span className="text-tertiary font-bold">45%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[45%]"></div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
