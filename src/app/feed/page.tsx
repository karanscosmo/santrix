"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface FeedItem {
  id: string;
  headline: string;
  summary: string;
  whyMatters: string;
  category: "risk" | "opportunity" | "forecast" | "strategic";
  impactLevel: "Critical" | "High" | "Medium" | "Low";
  suggestedAction: string;
  timestamp: string;
}

const categoryConfig = {
  risk: { label: "Risk Alert", icon: "warning", color: "#f28b82", emoji: "🔴" },
  opportunity: { label: "Opportunity", icon: "trending_up", color: "#4edea3", emoji: "🟢" },
  forecast: { label: "Forecast Change", icon: "analytics", color: "#8ab4f8", emoji: "🔵" },
  strategic: { label: "Strategic Recommendation", icon: "lightbulb", color: "#f59e0b", emoji: "🟡" },
};

const seedItems: FeedItem[] = [
  {
    id: "f1",
    headline: "APAC enterprise churn trending above threshold",
    summary: "Enterprise churn in APAC increased from 8% to 11.2% over the last 45 days. 14 accounts flagged as high-risk based on usage decline, NPS drop, and support escalation patterns.",
    whyMatters: "At current trajectory, APAC churn will cost $2.3M in ARR by Q3 end. This accounts for 46% of the total revenue risk currently on the books. Immediate intervention required.",
    category: "risk",
    impactLevel: "Critical",
    suggestedAction: "Increase CSM coverage to 1:10 ratio and deploy retention campaign for top 14 accounts",
    timestamp: "25 min ago",
  },
  {
    id: "f2",
    headline: "European market showing accelerated growth signals",
    summary: "DACH region TAM expanded 23% YoY with 12 inbound inquiries from enterprise prospects in Q2. Competitor penetration remains below 8%.",
    whyMatters: "First-mover window is narrowing as 2 competitors have announced DACH expansion plans. Each quarter of delay reduces projected Year 1 revenue by approximately $1.2M.",
    category: "opportunity",
    impactLevel: "High",
    suggestedAction: "Fast-track European expansion — hire regional sales lead and begin partner recruitment",
    timestamp: "1 hour ago",
  },
  {
    id: "f3",
    headline: "Q3 revenue forecast adjusted downward by 4.2%",
    summary: "The Q3 forecast has been revised from $52.4M to $50.2M ARR. Primary drivers: APAC churn increase and 2 delayed enterprise deals in the Americas.",
    whyMatters: "While the revision is within acceptable bounds (< 5%), it marks the second consecutive downward adjustment. A third would trigger a board-level review.",
    category: "forecast",
    impactLevel: "High",
    suggestedAction: "Accelerate pipeline generation and prioritize the 2 delayed Americas deals for executive sponsorship",
    timestamp: "2 hours ago",
  },
  {
    id: "f4",
    headline: "AI recommends reallocating Q3 marketing budget",
    summary: "Analysis shows display advertising generating 40% of spend but only 12% of qualified pipeline. Performance marketing and content channels show 3.2x better ROI.",
    whyMatters: "Reallocating budget could save $1.8M annually while maintaining or improving pipeline quality. Current allocation is sub-optimal based on 6 months of performance data.",
    category: "strategic",
    impactLevel: "Medium",
    suggestedAction: "Shift 25% of display budget to search and content marketing over 60 days",
    timestamp: "3 hours ago",
  },
  {
    id: "f5",
    headline: "Customer satisfaction milestone: NPS reached 72",
    summary: "Overall NPS improved from 65 to 72 this quarter, driven by product quality improvements and faster onboarding. Americas and EMEA segments leading the improvement.",
    whyMatters: "NPS above 70 is correlated with 95% renewal rates in our historical data. This positions us well for the renewal season starting next quarter.",
    category: "opportunity",
    impactLevel: "Medium",
    suggestedAction: "Capitalize on high NPS by launching customer referral program and collecting case studies",
    timestamp: "4 hours ago",
  },
  {
    id: "f6",
    headline: "Supply chain concentration risk identified in APAC vendors",
    summary: "78% of hardware components sourced from 2 APAC vendors. Recent geopolitical developments increase the probability of supply disruption from 12% to 28%.",
    whyMatters: "A supply disruption would delay 8 enterprise implementations currently in progress, potentially triggering early-stage churn. Diversification is overdue.",
    category: "risk",
    impactLevel: "High",
    suggestedAction: "Begin qualification of 2 alternative vendors in Americas and EMEA regions",
    timestamp: "5 hours ago",
  },
];

const incomingItems: Omit<FeedItem, "id" | "timestamp">[] = [
  { headline: "Mid-market product launch timeline at risk", summary: "Engineering velocity dropped 8% due to unplanned security patch. Mid-market tier launch may shift from Q2 to early Q3.", whyMatters: "Each month of delay costs approximately $500K in lost first-mover revenue. Competitor launched their mid-market tier last week.", category: "risk", impactLevel: "High", suggestedAction: "Evaluate resource reallocation to protect launch timeline" },
  { headline: "Partnership opportunity with major SI firm", summary: "A top-5 systems integrator expressed interest in reseller partnership. Could accelerate enterprise sales in financial services vertical.", whyMatters: "SI partnerships historically generate 2.4x larger deal sizes and 40% faster sales cycles. Financial services is our fastest-growing vertical.", category: "opportunity", impactLevel: "High", suggestedAction: "Schedule executive meeting with SI partnership team within 2 weeks" },
  { headline: "AI confidence in expansion forecast increased to 91%", summary: "Updated market data and pipeline signals have increased the AI's confidence in the European expansion forecast from 86% to 91%.", whyMatters: "Higher confidence reduces the risk premium in our financial model, making the investment case stronger for the board.", category: "forecast", impactLevel: "Medium", suggestedAction: "Update the board deck with revised confidence metrics" },
];

const filterOptions = ["all", "risk", "opportunity", "forecast", "strategic"] as const;

export default function IntelligenceFeedPage() {
  const [items, setItems] = useState<FeedItem[]>(seedItems);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const rand = incomingItems[Math.floor(Math.random() * incomingItems.length)];
      const newItem: FeedItem = {
        ...rand,
        id: `f_${Date.now()}`,
        timestamp: "Just now",
      };
      setItems(prev => [newItem, ...prev.slice(0, 12)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredItems = activeFilter === "all" ? items : items.filter(i => i.category === activeFilter);

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Executive Feed
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            AI-curated intelligence briefings — risks, opportunities, forecast changes, and strategic recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#8ab4f8] animate-pulse" : "bg-gray-500"}`}></span>
            {isLive ? "Live updates" : "Paused"}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="btn-action btn-secondary text-[11px] py-2"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map(f => {
          const cfg = f !== "all" ? categoryConfig[f] : null;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === f
                  ? "font-bold"
                  : "text-gray-400 border-white/[0.04] hover:text-white hover:border-white/[0.1]"
              }`}
              style={activeFilter === f ? {
                backgroundColor: cfg ? `${cfg.color}10` : "rgba(138,180,248,0.1)",
                color: cfg ? cfg.color : "#8ab4f8",
                borderColor: cfg ? `${cfg.color}30` : "rgba(138,180,248,0.3)",
              } : {}}
            >
              {cfg && <span>{cfg.emoji}</span>}
              {f === "all" ? "All Updates" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* Feed Cards */}
      <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredItems.map(item => {
          const cfg = categoryConfig[item.category];
          return (
            <div key={item.id} className="feed-card">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ color: cfg.color }}>
                      {cfg.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ color: cfg.color, backgroundColor: `${cfg.color}10`, borderColor: `${cfg.color}25` }}
                      >
                        {cfg.label}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        item.impactLevel === "Critical" ? "text-[#f28b82]" :
                        item.impactLevel === "High" ? "text-[#f59e0b]" :
                        item.impactLevel === "Medium" ? "text-[#8ab4f8]" : "text-gray-500"
                      }`}>
                        {item.impactLevel} Impact
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.headline}</h3>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0 mt-1">{item.timestamp}</span>
              </div>

              {/* Summary */}
              <p className="text-xs text-gray-400 leading-relaxed mb-3 pl-12">{item.summary}</p>

              {/* Why does this matter? */}
              <div className="why-matters ml-12">
                <span className="text-[10px] text-[#8ab4f8] uppercase tracking-wider font-bold block mb-1">
                  Why does this matter?
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">{item.whyMatters}</p>
              </div>

              {/* Suggested Action */}
              <div className="flex items-center gap-2 mt-3 pl-12 text-[11px]">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">lightbulb</span>
                <span className="text-gray-400">{item.suggestedAction}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
