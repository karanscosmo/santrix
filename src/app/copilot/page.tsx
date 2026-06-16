"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";
import { ExecutiveRecommendationPanel, RecommendationProps } from "@/components/ExecutiveRecommendationPanel";

interface Message {
  id: string;
  sender: "USER" | "SANKTRIX";
  text: string;
  summary?: string;
  simulation?: string;
  nextStep?: string;
  recommendationData?: RecommendationProps;
}

const suggestedPrompts = [
  "Should we expand to Europe?",
  "What happens if churn rises 15%?",
  "Can we reduce CAC by 20%?",
  "Where should we invest next quarter?",
  "What's the impact of a hiring freeze?",
  "Should we raise enterprise pricing?",
];

export default function ExecutiveCopilot() {
  const router = useRouter();
  const { addAuditLog, checkPermission, rateLimitCheck, sanitizeInput } = useSecurity();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_welcome",
      sender: "SANKTRIX",
      text: "I'm your Decision Copilot. Ask me strategic questions about your business and I'll provide data-driven analysis, simulation results, and actionable recommendations.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text?: string) => {
    const query = text || inputVal.trim();
    if (!query) return;

    if (!checkPermission("notes:edit")) {
      alert("Permission denied. Analyst credentials or higher required.");
      return;
    }
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }

    const sanitized = sanitizeInput(query);
    const userMsg: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: `msg_${Date.now()}`,
      sender: "USER",
      text: sanitized,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    addAuditLog("copilot.query", `User asked: ${sanitized}`, "SUCCESS");

    setTimeout(() => {
      setIsTyping(false);
      let response: Message;
      const q = sanitized.toLowerCase();

      if (q.includes("europe") || q.includes("expand")) {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've analyzed the European market opportunity.",
          summary: "European TAM is growing at 23% YoY, with DACH region showing the strongest demand signals. Competitor penetration is still low.",
          simulation: "Modeling a DACH-first entry strategy with a 3-person sales team and $800K initial investment shows breakeven at month 14.",
          nextStep: "Authorize hiring of DACH regional sales lead.",
          recommendationData: {
            type: "OPPORTUNITY",
            title: "DACH Market Entry",
            context: "Strong inbound signals from DACH. 14-month breakeven modeled via Wolfram.",
            action: "Establish DACH beachhead with localized product and 3-person team.",
            outcome: "Expected revenue contribution of $4.1M by end of Year 1.",
            confidence: 86,
            impact: "+$4.1M Revenue",
            horizon: "12 Months"
          }
        };
      } else if (q.includes("churn") || q.includes("retention")) {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've modeled the churn scenario and its cascading effects.",
          summary: "A 15% churn increase would primarily impact the APAC enterprise segment, affecting 14 high-value accounts.",
          simulation: "Under 15% churn increase, Q3 revenue drops by $3.4M from forecast. NRR declines from 118% to 103%.",
          nextStep: "Approve budget reallocation to Customer Success.",
          recommendationData: {
            type: "RISK",
            title: "Mitigate APAC Enterprise Churn",
            context: "CSM coverage ratio is currently too low (1:18) in the APAC region.",
            action: "Increase CSM ratio to 1:10 and launch targeted win-back campaign.",
            outcome: "Reduce projected churn back to 10% baseline.",
            confidence: 94,
            impact: "+$2.3M ARR Saved",
            horizon: "90 Days"
          }
        };
      } else {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've analyzed your question against current enterprise data.",
          summary: "Based on current operational metrics, this scenario falls within normal operating parameters.",
          simulation: "Monte Carlo sensitivity analysis (n=10,000) shows a 78% probability of positive outcome under current conditions.",
          nextStep: "Set up automated threshold alerts for key variables.",
          recommendationData: {
            type: "RECOMMENDATION",
            title: "Maintain Current Trajectory",
            context: "Operations are stable. No immediate structural changes required.",
            action: "Continue current strategy with enhanced monitoring.",
            outcome: "Steady 14.2% QoQ growth.",
            confidence: 82,
            impact: "Stable Growth",
            horizon: "Next Quarter"
          }
        };
      }

      setMessages(prev => [...prev, response]);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Decision Copilot
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Ask strategic questions — get analysis, simulations, and actionable recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            AI Ready
          </div>
          <button
            onClick={() => {
              setMessages([{
                id: `msg_${Date.now()}`,
                sender: "SANKTRIX",
                text: "New session started. What strategic decision would you like to explore?",
              }]);
            }}
            className="btn-action btn-secondary text-[11px] py-2"
          >
            New Session
          </button>
        </div>
      </header>

      <div className="panel-layer flex flex-col" style={{ height: "calc(100vh - 16rem)", minHeight: "500px" }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-2 ${msg.sender === "USER" ? "items-end" : "items-start"}`}
            >
              {msg.sender === "USER" ? (
                <div className="bg-[#8ab4f8]/10 border border-[#8ab4f8]/20 p-4 rounded-[16px] rounded-tr-none text-white max-w-[85%]">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              ) : (
                <div className="w-full max-w-[90%] space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-[#8ab4f8]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Decision Copilot</span>
                  </div>

                  <div className="bg-[#050505]/40 border border-white/[0.04] p-5 rounded-[16px] space-y-5">
                    <p className="text-sm leading-relaxed text-gray-200">{msg.text}</p>

                    {msg.summary && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] text-[#8ab4f8] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">subject</span>
                          Executive Summary
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.summary}</p>
                      </div>
                    )}

                    {msg.simulation && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] text-[#c4b5fd] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">science</span>
                          Simulation Result <span className="text-[9px] text-gray-500 ml-2 border border-gray-700 px-1.5 rounded">Powered by Wolfram</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.simulation}</p>
                      </div>
                    )}

                    {msg.recommendationData && (
                      <div className="mt-4">
                        <ExecutiveRecommendationPanel {...msg.recommendationData} />
                      </div>
                    )}

                    {msg.nextStep && (
                      <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                        <h4 className="text-[11px] text-[#4edea3] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          Next Step
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.nextStep}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-[#8ab4f8]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <div className="bg-[#050505]/40 border border-white/[0.04] p-4 rounded-[16px] rounded-tl-none flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] text-gray-400 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-full px-3 py-1 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-gray-500 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Copilot about strategy, risks, or simulations..."
              className="w-full bg-[#050505] border border-white/[0.08] rounded-full py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-[#8ab4f8]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#8ab4f8]/10 hover:bg-[#8ab4f8]/20 text-[#8ab4f8] rounded-full transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
