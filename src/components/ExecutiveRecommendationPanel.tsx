"use client";

import React from "react";

export interface RecommendationProps {
  type: "RISK" | "OPPORTUNITY" | "RECOMMENDATION";
  title: string;
  context: string;
  action: string;
  outcome: string;
  confidence: number;
  impact: string;
  horizon: string;
}

export const ExecutiveRecommendationPanel: React.FC<RecommendationProps> = ({
  type,
  title,
  context,
  action,
  outcome,
  confidence,
  impact,
  horizon,
}) => {
  const isRisk = type === "RISK";
  const isOpp = type === "OPPORTUNITY";

  const colorBorder = isRisk ? "border-error/30" : isOpp ? "border-primary/30" : "border-tertiary/30";
  const colorBg = isRisk ? "bg-error/5" : isOpp ? "bg-primary/5" : "bg-tertiary/5";
  const colorText = isRisk ? "text-error" : isOpp ? "text-primary" : "text-tertiary";
  const icon = isRisk ? "warning" : isOpp ? "trending_up" : "lightbulb";

  return (
    <div className={`glass-panel rounded-xl p-6 border ${colorBorder} ${colorBg} flex flex-col h-full relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className={`material-symbols-outlined text-6xl ${colorText}`}>{icon}</span>
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className={`material-symbols-outlined text-lg ${colorText}`}>{icon}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colorText}`}>
          {isRisk ? "Business Risk" : isOpp ? "Growth Opportunity" : "Strategic Recommendation"}
        </span>
      </div>

      <h3 className="font-display text-xl text-on-surface mb-2 relative z-10">{title}</h3>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-6 relative z-10">{context}</p>

      <div className="space-y-4 mb-6 flex-1 relative z-10">
        <div className="bg-surface-lowest/50 p-4 rounded-lg border border-outline-variant/30">
          <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider">Suggested Action</p>
          <p className="text-sm font-semibold text-on-surface">{action}</p>
        </div>
        <div className="bg-surface-lowest/50 p-4 rounded-lg border border-outline-variant/30">
          <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider">Expected Outcome</p>
          <p className="text-sm font-semibold text-on-surface">{outcome}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-outline-variant/30 pt-4 relative z-10">
        <div>
          <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Projected Impact</p>
          <p className={`font-display text-base font-bold ${colorText}`}>{impact}</p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Confidence</p>
          <p className="font-display text-base font-bold text-on-surface">{confidence}%</p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">Time Horizon</p>
          <p className="font-display text-base font-bold text-on-surface">{horizon}</p>
        </div>
      </div>
    </div>
  );
};
