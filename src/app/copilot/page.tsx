"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface Message {
  id: string;
  sender: "USER" | "SANKTRIX";
  text: string;
  analysis?: string;
  simulation?: string;
  forecast?: string;
  recommendation?: string;
  confidence?: number;
  impact?: { label: string; value: string; direction: "up" | "down" };
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
          text: "I've analyzed the European market opportunity against our current position and competitive landscape.",
          analysis: "European TAM is growing at 23% YoY, with DACH region showing the strongest demand signals. Competitor penetration is still low (< 8% market share). Our product-market fit indicators for the enterprise segment are strong based on 12 inbound inquiries from DACH companies in Q2.",
          simulation: "Modeling a DACH-first entry strategy with a 3-person sales team and $800K initial investment shows breakeven at month 14. Under pessimistic assumptions (50% slower ramp), breakeven extends to month 20.",
          forecast: "Expected revenue contribution of $4.1M by end of Year 1, growing to $12.8M by Year 2. Pipeline build rate of $1.2M/month expected after month 6.",
          recommendation: "Proceed with DACH-first entry. Hire a regional sales lead from the market, invest in localization, and establish a Frankfurt hub. Begin partner recruitment in parallel.",
          confidence: 86,
          impact: { label: "Revenue Impact", value: "+$4.1M", direction: "up" },
        };
      } else if (q.includes("churn") || q.includes("retention")) {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've modeled the churn scenario and its cascading effects across your business.",
          analysis: "A 15% churn increase would primarily impact the APAC enterprise segment, affecting 14 high-value accounts with a combined $2.3M ARR. Root causes identified: reduced CSM coverage (1:18 ratio vs industry 1:12), competitive pressure from RegionPay, and delayed feature delivery.",
          simulation: "Under 15% churn increase, Q3 revenue drops by $3.4M from forecast. NRR declines from 118% to 103%. The cascading effect reduces Q4 pipeline by 8% due to lower reference-ability and case study availability.",
          forecast: "Without intervention, the churn trajectory reaches 22% by Q4. With the recommended actions, churn can be reduced to 10% within 90 days.",
          recommendation: "Deploy a 3-pronged retention strategy: (1) Increase CSM ratio to 1:10 for enterprise accounts, (2) Launch targeted win-back campaign for the 14 at-risk accounts, (3) Accelerate the Q3 feature roadmap for the top 5 requested features.",
          confidence: 94,
          impact: { label: "ARR Recovery", value: "+$2.3M", direction: "up" },
        };
      } else if (q.includes("cac") || q.includes("acquisition cost")) {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've analyzed your customer acquisition costs across all channels and segments.",
          analysis: "Current blended CAC is $1,245. Enterprise CAC ($3,200) is 2.6x mid-market ($1,230) and 8x SMB ($400). Display advertising is driving 40% of spend but only 12% of qualified pipeline. Search and content channels show 3.2x better ROI.",
          simulation: "A 20% CAC reduction is achievable by reallocating 60% of display budget to search and content marketing. Modeling shows pipeline maintenance at current levels with $1.8M annual savings.",
          forecast: "Blended CAC drops to $996 within 60 days. Payback period improves from 14 months to 11 months. LTV:CAC ratio improves from 3.2x to 4.1x.",
          recommendation: "Reallocate marketing budget from display to performance channels. Invest saved budget into content-led demand generation and partner marketing. Expected savings: $1.8M annually with maintained pipeline volume.",
          confidence: 89,
          impact: { label: "Annual Savings", value: "$1.8M", direction: "up" },
        };
      } else if (q.includes("invest") || q.includes("quarter") || q.includes("budget")) {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've evaluated the optimal investment allocation for next quarter based on ROI projections.",
          analysis: "Current Q3 budget allocation shows 45% to Sales, 30% to Marketing, 15% to R&D, 10% to Operations. Analysis indicates Marketing is over-allocated by 8% relative to pipeline conversion rates, while Customer Success is under-resourced given churn trends.",
          simulation: "Optimal allocation: Sales 42% (-3%), Marketing 22% (-8%), R&D 18% (+3%), Customer Success 12% (new), Operations 6% (-4%). This rebalancing improves projected Q4 outcomes by $2.8M.",
          forecast: "Rebalanced investment yields 14% better ROI across the portfolio. Customer Success investment shows the highest marginal return at 3.8x within 90 days.",
          recommendation: "Shift 8% of marketing budget to a new Customer Success initiative focused on enterprise retention. Increase R&D allocation by 3% to accelerate the mid-market product launch. Maintain sales investment with focus on EMEA expansion.",
          confidence: 87,
          impact: { label: "ROI Improvement", value: "+14%", direction: "up" },
        };
      } else {
        response = {
          id: `msg_${Date.now() + 1}`,
          sender: "SANKTRIX",
          text: "I've analyzed your question against current enterprise data and market conditions.",
          analysis: "Based on current operational metrics and market signals, this scenario falls within normal operating parameters. Key factors considered: revenue trajectory (+14.2% QoQ), operational efficiency (1.42x), and market positioning.",
          simulation: "Running sensitivity analysis across 10,000 scenarios shows a 78% probability of positive outcome under current conditions. Key variables: market growth rate, competitive response, and execution velocity.",
          recommendation: "Continue current trajectory with enhanced monitoring. Set up automated alerts for the key variables identified in the sensitivity analysis. Consider running a more specific scenario in the Scenario Lab for detailed projections.",
          confidence: 82,
          impact: { label: "Projected Outcome", value: "Positive", direction: "up" },
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
      {/* Header */}
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

      {/* Main Chat Area */}
      <div className="panel-layer flex flex-col" style={{ height: "calc(100vh - 16rem)", minHeight: "500px" }}>
        {/* Message Stream */}
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
                  {/* Bot Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#8ab4f8]/10 border border-[#8ab4f8]/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-[#8ab4f8]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">Decision Copilot</span>
                  </div>

                  {/* Response Content */}
                  <div className="bg-[#050505]/40 border border-white/[0.04] p-5 rounded-[16px] space-y-5">
                    <p className="text-sm leading-relaxed text-gray-200">{msg.text}</p>

                    {msg.analysis && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] text-[#8ab4f8] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">analytics</span>
                          Analysis
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.analysis}</p>
                      </div>
                    )}

                    {msg.simulation && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] text-[#c4b5fd] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">science</span>
                          Simulation Result
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.simulation}</p>
                      </div>
                    )}

                    {msg.forecast && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] text-[#f59e0b] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          Forecast
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed pl-5">{msg.forecast}</p>
                      </div>
                    )}

                    {msg.recommendation && (
                      <div className="bg-[#4edea3]/5 border border-[#4edea3]/15 rounded-[12px] p-4 space-y-2">
                        <h4 className="text-[11px] text-[#4edea3] uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                          Recommendation
                        </h4>
                        <p className="text-xs text-white leading-relaxed pl-5">{msg.recommendation}</p>
                      </div>
                    )}

                    {/* Bottom Row: Confidence + Impact */}
                    {msg.confidence && (
                      <div className="flex items-center gap-6 pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-gray-500">Confidence</span>
                          <div className="confidence-bar w-20">
                            <div className="fill" style={{ width: `${msg.confidence}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-white">{msg.confidence}%</span>
                        </div>
                        {msg.impact && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-500">{msg.impact.label}</span>
                            <span className={`text-sm font-bold ${msg.impact.direction === "up" ? "text-[#4edea3]" : "text-[#f28b82]"}`}>
                              {msg.impact.value}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-gray-400 text-sm pl-9">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8ab4f8] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-[#8ab4f8] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-[#8ab4f8] animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span>Analyzing your question...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] px-3.5 py-2 rounded-full border border-white/[0.06] text-gray-400 hover:text-white hover:border-[#8ab4f8]/30 hover:bg-[#8ab4f8]/5 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/[0.04]">
          <form onSubmit={handleSubmit} className="relative bg-[#07080c] border border-white/[0.06] rounded-[14px] overflow-hidden focus-within:border-[#8ab4f8]/50 transition-colors">
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-transparent border-none text-white text-sm placeholder-gray-500 py-3.5 pl-5 pr-16 outline-none focus:ring-0"
              placeholder="Ask a strategic question..."
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2 bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#001945] w-8 h-8 rounded-[10px] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">arrow_upward</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
