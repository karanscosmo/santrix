"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface BusinessEvent {
  id: string;
  title: string;
  category: "revenue" | "customer" | "market" | "operational" | "risk";
  timestamp: string;
  impact: string;
  whyMatters: string;
  suggestedAction: string;
}

const categoryConfig = {
  revenue: { label: "Revenue", icon: "payments", color: "#4edea3" },
  customer: { label: "Customer", icon: "groups", color: "#8ab4f8" },
  market: { label: "Market", icon: "public", color: "#c4b5fd" },
  operational: { label: "Operational", icon: "precision_manufacturing", color: "#f59e0b" },
  risk: { label: "Risk", icon: "warning", color: "#f28b82" },
};

const seedEvents: BusinessEvent[] = [
  {
    id: "ev1",
    title: "Enterprise deal closed: Meridian Corp ($420K ACV)",
    category: "revenue",
    timestamp: "12 min ago",
    impact: "+$420K ARR",
    whyMatters: "Largest deal this quarter. Validates enterprise pricing strategy and creates a reference account for the financial services vertical.",
    suggestedAction: "Trigger CSM onboarding workflow and schedule executive sponsor introduction",
  },
  {
    id: "ev2",
    title: "NPS score dropped 8 points in APAC enterprise segment",
    category: "customer",
    timestamp: "34 min ago",
    impact: "14 accounts at risk",
    whyMatters: "NPS decline correlates with churn in 78% of historical cases. APAC is already showing elevated churn signals — this compounds the risk.",
    suggestedAction: "Schedule executive check-ins with top 5 APAC accounts this week",
  },
  {
    id: "ev3",
    title: "Competitor launched self-serve tier targeting mid-market",
    category: "market",
    timestamp: "2 hours ago",
    impact: "Competitive pressure in $15K-50K ACV",
    whyMatters: "Direct competitor to our planned mid-market launch. Accelerating our timeline by 30 days could capture first-mover advantage in 3 key verticals.",
    suggestedAction: "Escalate to product team and evaluate acceleration of Q2 mid-market launch",
  },
  {
    id: "ev4",
    title: "Onboarding time-to-value reduced by 8 days",
    category: "operational",
    timestamp: "3 hours ago",
    impact: "Efficiency milestone achieved",
    whyMatters: "Faster time-to-value directly improves NPS and reduces early-stage churn. This 22% improvement exceeds our quarterly target by 8 points.",
    suggestedAction: "Document the process improvement and replicate across remaining customer segments",
  },
  {
    id: "ev5",
    title: "Supply chain vendor delayed shipment by 12 days",
    category: "risk",
    timestamp: "4 hours ago",
    impact: "8 enterprise implementations delayed",
    whyMatters: "Affects 8 enterprise customers in the onboarding pipeline. Delivery delays are the #2 driver of first-year churn in our data.",
    suggestedAction: "Activate backup vendor and notify affected account teams",
  },
  {
    id: "ev6",
    title: "Upsell opportunity detected: Atlas Financial (+$180K)",
    category: "revenue",
    timestamp: "5 hours ago",
    impact: "+$180K expansion revenue",
    whyMatters: "Atlas Financial's usage has grown 340% in 60 days, indicating strong product-market fit and readiness for the Enterprise tier upgrade.",
    suggestedAction: "Route to account executive for expansion conversation",
  },
];

const incomingEvents: Omit<BusinessEvent, "id" | "timestamp">[] = [
  { title: "Customer renewal: Quantum Labs ($290K ACV) auto-renewed", category: "revenue", impact: "$290K retained", whyMatters: "Successful auto-renewal validates product stickiness. Quantum Labs was flagged as medium-risk last quarter — retention strategy worked.", suggestedAction: "Celebrate with CSM team and document the winning retention playbook" },
  { title: "Employee satisfaction score improved 12% in Engineering", category: "operational", impact: "Retention risk reduced", whyMatters: "Engineering satisfaction directly correlates with code quality and release velocity. This improvement supports our product roadmap timelines.", suggestedAction: "Reinforce the initiatives that drove the improvement" },
  { title: "Regulatory change in EU data processing requirements", category: "risk", impact: "Compliance update needed", whyMatters: "Non-compliance could block our European expansion plan. Timeline for compliance: 90 days. Our current architecture needs 2 minor modifications.", suggestedAction: "Assign to security team with 60-day delivery target" },
  { title: "Support ticket volume decreased 18% month-over-month", category: "customer", impact: "Product quality improving", whyMatters: "Lower ticket volume with stable customer count indicates product improvements are reducing friction. This supports our efficiency metrics.", suggestedAction: "Continue investment in self-service documentation and in-app guidance" },
];

const categories = ["all", "revenue", "customer", "market", "operational", "risk"] as const;

export default function EventFabricPage() {
  const [events, setEvents] = useState<BusinessEvent[]>(seedEvents);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomEvent = incomingEvents[Math.floor(Math.random() * incomingEvents.length)];
      const newEvent: BusinessEvent = {
        ...randomEvent,
        id: `ev_${Date.now()}`,
        timestamp: "Just now",
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 12)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredEvents = activeFilter === "all" ? events : events.filter(e => e.category === activeFilter);

  // Count by category
  const counts = Object.fromEntries(
    Object.keys(categoryConfig).map(cat => [cat, events.filter(e => e.category === cat).length])
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            Business Event Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time business events across revenue, customers, markets, operations, and risks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[11px] font-medium text-gray-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#4edea3] animate-pulse" : "bg-gray-500"}`}></span>
            {isLive ? "Live" : "Paused"}
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="btn-action btn-secondary text-[11px] py-2"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </header>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(categoryConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(activeFilter === key ? "all" : key)}
            className={`metric-card !p-3.5 text-left cursor-pointer transition-all ${activeFilter === key ? "!border-white/[0.15]" : ""}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px]" style={{ color: cfg.color }}>{cfg.icon}</span>
              <span className="text-[11px] text-gray-400">{cfg.label}</span>
            </div>
            <span className="font-display text-lg font-bold text-white">{counts[key] || 0}</span>
            <span className="text-[11px] text-gray-500 ml-1">events</span>
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => {
          const cfg = cat !== "all" ? categoryConfig[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeFilter === cat
                  ? "font-bold"
                  : "text-gray-400 border-white/[0.04] hover:text-white hover:border-white/[0.1]"
              }`}
              style={activeFilter === cat ? {
                backgroundColor: cfg ? `${cfg.color}10` : "rgba(138,180,248,0.1)",
                color: cfg ? cfg.color : "#8ab4f8",
                borderColor: cfg ? `${cfg.color}30` : "rgba(138,180,248,0.3)",
              } : {}}
            >
              {cat === "all" ? "All Events" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* Event Stream */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredEvents.map(event => {
          const cfg = categoryConfig[event.category];
          return (
            <div key={event.id} className={`event-card ${event.category}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cfg.color}10` }}
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ color: cfg.color }}>{cfg.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</span>
                      <span className="text-[10px] text-gray-500">· {event.timestamp}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-white font-bold shrink-0 bg-[#050505]/60 px-2.5 py-1 rounded-full border border-white/[0.04]">
                  {event.impact}
                </span>
              </div>

              {/* Why does this matter? */}
              <div className="bg-[#050505]/30 border border-white/[0.03] rounded-[10px] p-3 mb-3">
                <span className="text-[10px] text-[#8ab4f8] uppercase tracking-wider font-bold block mb-1">
                  Why does this matter?
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{event.whyMatters}</p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">lightbulb</span>
                <span className="text-gray-400">{event.suggestedAction}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
