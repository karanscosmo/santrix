"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface ActionCard {
  id: string;
  title: string;
  tag: string;
  description: string;
  runwayDelta: number;
  arrDelta: number;
}

export default function StrategyPage() {
  const { checkPermission, addAuditLog, rateLimitCheck } = useSecurity();
  const [activeActions, setActiveActions] = useState<Set<string>>(new Set());

  const actionCards: ActionCard[] = [
    {
      id: "ad_spend",
      title: "REALLOCATE AD SPEND",
      tag: "HIGH IMPACT",
      description: "Shifting $150K display advertising budget directly to high-intent keyword campaigns.",
      runwayDelta: 2.2,
      arrDelta: 1.2,
    },
    {
      id: "churn_mitigation",
      title: "IMPLEMENT CHURN MITIGATION",
      tag: "HIGH IMPACT",
      description: "Deploy retention agents to optimize pipeline health and reduce account cancellations by 15%.",
      runwayDelta: 1.1,
      arrDelta: 0.84,
    },
    {
      id: "sales_hire",
      title: "ACCELERATE SALES HIRE",
      tag: "MEDIUM IMPACT",
      description: "Onboard 3 Enterprise AEs next month to unlock capacity in the European sales territories.",
      runwayDelta: -0.6,
      arrDelta: 1.4,
    },
  ];

  const handleToggle = (id: string) => {
    if (!checkPermission("simulation:run")) {
      alert("Access Denied: Your current role does not have permission to run simulations.");
      return;
    }
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Please wait before simulating more actions.");
      return;
    }

    const next = new Set(activeActions);
    if (next.has(id)) {
      next.delete(id);
      addAuditLog("strategy.simulate_deactivate", `Deactivated strategy simulation for action: ${id}`, "SUCCESS");
    } else {
      next.add(id);
      addAuditLog("strategy.simulate_activate", `Activated strategy simulation for action: ${id}`, "SUCCESS");
    }
    setActiveActions(next);
  };

  const activeCards = actionCards.filter(c => activeActions.has(c.id));
  const totalRunwayDelta = activeCards.reduce((acc, curr) => acc + curr.runwayDelta, 0);
  const totalArrDelta = activeCards.reduce((acc, curr) => acc + curr.arrDelta, 0);

  const handleCommit = () => {
    if (!checkPermission("config:write")) {
      alert("Access Denied: Your current role does not have permission to commit strategic plans.");
      addAuditLog("strategy.commit_rejected", "Strategic plan commit rejected due to insufficient permissions", "FAILED");
      return;
    }

    addAuditLog(
      "strategy.commit_plan",
      `Committed strategic plan with runway delta: ${totalRunwayDelta.toFixed(1)} Months, ARR change: $${totalArrDelta.toFixed(2)}M`,
      "SUCCESS"
    );
    alert(
      `Committing plan to execution:\nRunway shift: ${totalRunwayDelta.toFixed(
        1
      )} Months\nNet ARR change: $${totalArrDelta.toFixed(2)}M\nTriggering automated workflows via temporal/n8n...`
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-md">
        {/* Strategic Overview Gauges (Scorecard) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {/* Priority Health */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between">
            <span className="font-sans text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
              Strategic Health Index
            </span>
            <h2 className="font-display text-[32px] text-tertiary font-bold mt-1">94.8%</h2>
            <div className="flex items-center gap-sm mt-md font-mono text-xs text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+2.4% vs last week</span>
            </div>
          </div>
          {/* Risk Level */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between">
            <span className="font-sans text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
              Active Operations Risk
            </span>
            <h2 className="font-display text-[32px] text-secondary font-bold mt-1">Elevated</h2>
            <div className="flex items-center gap-sm mt-md font-mono text-xs text-secondary">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>Critical: Marketing Churn</span>
            </div>
          </div>
          {/* Opportunities */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between">
            <span className="font-sans text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
              Identified Arbitrage
            </span>
            <h2 className="font-display text-[32px] text-primary font-bold mt-1">$4.2M</h2>
            <div className="flex items-center gap-sm mt-md font-mono text-xs text-primary">
              <span className="material-symbols-outlined text-sm">lightbulb</span>
              <span>Optimize Ad Budget</span>
            </div>
          </div>
          {/* Compute Optimization */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between">
            <span className="font-sans text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
              Wolfram Yield multiplier
            </span>
            <h2 className="font-display text-[32px] text-tertiary font-bold mt-1">1.48x</h2>
            <div className="flex items-center gap-sm mt-md font-mono text-xs text-tertiary">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Autonomous tuning active</span>
            </div>
          </div>
        </div>

        {/* Row 2: AI Strategic Brief & Priority Action list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
          {/* AI Brief */}
          <div className="lg:col-span-7 glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden h-[450px]">
            <div className="stream-pulse"></div>
            <div className="border-b border-outline-variant/30 pb-sm flex justify-between items-center mb-sm">
              <div>
                <h3 className="font-display text-headline-md text-on-surface text-[18px]">AI Executive Briefing</h3>
                <p className="font-mono text-xs text-on-surface-variant mt-1">REAL-TIME BUSINESS INTERPRETATION</p>
              </div>
              <span className="material-symbols-outlined text-primary">description</span>
            </div>

            <div className="flex-grow font-sans text-sm text-on-surface-variant leading-relaxed space-y-md overflow-y-auto my-md pr-xs">
              <p>
                Sanktrix AI agents, operating in coordination with the <strong>Wolfram Computational Layer</strong>, have identified a potential runway optimization opportunity. Current ARR projections sit at <strong>$42.8M</strong> with a monthly cash burn rate of <strong>$1.8M</strong>.
              </p>
              <p>
                Under baseline parameters, the company maintains a runway of <strong>16.2 months</strong>. However, the simulation indicates that implementing the <em>Marketing Budget Reallocation</em> recommendation will improve capital efficiency by <strong>18%</strong>, extending runway to <strong>18.4 months</strong> while maintaining top-line expansion goals.
              </p>
              <div className="p-sm rounded bg-secondary-container/10 border border-secondary/20 text-secondary text-xs flex gap-sm">
                <span className="material-symbols-outlined text-sm mt-0.5">warning</span>
                <span>
                  CRITICAL DIRECTIVE: A 20% increase in Customer Acquisition Cost (CAC) without optimization will trigger margin erosion starting in Q3. Immediate action is suggested.
                </span>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-mono">Brief compiled: 4m ago</span>
              <div className="flex gap-sm">
                <button
                  onClick={() => alert("Exporting executive brief...")}
                  className="border border-outline hover:border-primary text-on-surface hover:text-primary text-xs font-semibold px-sm py-sm rounded tracking-wide uppercase transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => alert("Strategic plan pushed to Executive Boardroom session.")}
                  className="bg-primary text-on-primary text-xs font-semibold px-sm py-sm rounded hover:bg-primary-container tracking-wide uppercase transition-colors"
                >
                  Send to Boardroom
                </button>
              </div>
            </div>
          </div>

          {/* Priority Recommendations List */}
          <div className="lg:col-span-5 glass-panel rounded-xl p-md flex flex-col justify-between h-[450px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-sm">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Top Priorities & Decisions</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">ORDERED BY ACTION PRIORITY AND SCORE</p>
            </div>

            <div className="flex-grow overflow-y-auto space-y-sm my-sm pr-xs">
              {/* Item 1 */}
              <div className="bg-surface-container p-sm rounded border border-outline-variant/50 hover:border-primary transition-colors flex gap-sm items-start">
                <span className="text-xs bg-error/10 border border-error/30 text-error px-1.5 py-0.5 rounded font-mono font-bold">
                  P1
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-on-surface">Optimize Ad Spend Allocation</h4>
                    <span className="text-[10px] text-tertiary bg-tertiary/10 px-1 rounded font-bold">Score: 94</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Shift 22% of budget from display to search based on conversion variance.
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-on-surface-variant">
                    <span>Impact: +$1.2M ARR</span>
                    <button onClick={() => handleToggle("ad_spend")} className="text-tertiary hover:underline">
                      {activeActions.has("ad_spend") ? "Deactivate simulation" : "Run simulation &rarr;"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-surface-container p-sm rounded border border-outline-variant/50 hover:border-primary transition-colors flex gap-sm items-start">
                <span className="text-xs bg-secondary/10 border border-secondary/30 text-secondary px-1.5 py-0.5 rounded font-mono font-bold">
                  P2
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-on-surface">Implement Churn Mitigation Loop</h4>
                    <span className="text-[10px] text-tertiary bg-tertiary/10 px-1 rounded font-bold">Score: 88</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Activate SDR retention workflow for accounts exhibiting drop-off characteristics.
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-on-surface-variant">
                    <span>Impact: -4.2% Churn</span>
                    <button onClick={() => handleToggle("churn_mitigation")} className="text-tertiary hover:underline">
                      {activeActions.has("churn_mitigation") ? "Deactivate simulation" : "Run simulation &rarr;"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-surface-container p-sm rounded border border-outline-variant/50 hover:border-primary transition-colors flex gap-sm items-start">
                <span className="text-xs bg-outline-variant/30 border border-outline-variant/50 text-outline px-1.5 py-0.5 rounded font-mono font-bold">
                  P3
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-on-surface">Accelerate Dev Headcount</h4>
                    <span className="text-[10px] text-secondary bg-secondary/10 px-1 rounded font-bold">Score: 68</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Hire 4 Senior React Developers to speed up product delivery timeline.
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-on-surface-variant">
                    <span>Impact: -2mo Time to Market</span>
                    <button onClick={() => handleToggle("sales_hire")} className="text-tertiary hover:underline">
                      {activeActions.has("sales_hire") ? "Deactivate simulation" : "Run simulation &rarr;"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-mono">Decision Matrix: Auto-Refreshed</span>
              <button
                onClick={() => alert("Opening advanced settings...")}
                className="text-primary hover:underline font-semibold uppercase text-[10px]"
              >
                Advanced Settings
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Suggested Actions & Interactive Impact Scores */}
        <div className="glass-panel rounded-xl p-md">
          <div className="border-b border-outline-variant/30 pb-sm mb-sm flex justify-between items-center">
            <div>
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                Decision Simulation & Impact Sandbox
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">
                TOGGLE STRATEGIC PATHWAYS TO FORECAST BUSINESS IMPACTS IN REAL-TIME
              </p>
            </div>
            <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-1 rounded">
              Live Wolfram Model integration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-md my-md">
            {actionCards.map(action => {
              const isActive = activeActions.has(action.id);
              return (
                <div
                  key={action.id}
                  className="bg-surface-container-low p-md rounded-lg border border-outline-variant flex flex-col justify-between h-[180px] hover:border-primary/50 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-primary font-bold">{action.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          action.tag === "HIGH IMPACT"
                            ? "text-tertiary bg-tertiary/10"
                            : "text-secondary bg-secondary/10"
                        }`}
                      >
                        {action.tag}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-sm">{action.description}</p>
                  </div>
                  <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {action.id === "churn_mitigation"
                          ? "CASH YIELD DELTA"
                          : action.id === "sales_hire"
                          ? "NET EXPANSION YIELD"
                          : "RUNWAY EXTENSION"}
                      </span>
                      <span className="text-xs font-bold text-tertiary font-mono">
                        {action.runwayDelta > 0 ? `+${action.runwayDelta}` : action.runwayDelta} Months / +$
                        {action.arrDelta}M ARR
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle(action.id)}
                      className={`px-sm py-xs rounded font-semibold text-xs transition-colors border cursor-pointer ${
                        isActive
                          ? "bg-tertiary/20 text-tertiary border-tertiary"
                          : "bg-primary/20 text-primary border-primary hover:bg-primary/30"
                      }`}
                    >
                      {isActive ? "Active" : "Simulate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-sm border-t border-outline-variant/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-md">
            <div className="text-mono text-xs text-on-surface-variant">
              Simulated Cumulative Runway Impact:{" "}
              <strong className={totalRunwayDelta >= 0 ? "text-tertiary font-bold" : "text-error font-bold"}>
                {totalRunwayDelta >= 0 ? `+${totalRunwayDelta.toFixed(1)}` : totalRunwayDelta.toFixed(1)} Months
              </strong>{" "}
              | ARR Yield:{" "}
              <strong className="text-primary font-bold">
                {totalArrDelta >= 0 ? `+$${totalArrDelta.toFixed(2)}M` : `-$${Math.abs(totalArrDelta).toFixed(2)}M`}
              </strong>
            </div>
            <button
              onClick={handleCommit}
              className="bg-primary text-on-primary font-semibold text-xs uppercase px-lg py-sm rounded hover:bg-primary-container transition-all shadow-[0_0_15px_rgba(0,112,255,0.3)] cursor-pointer"
            >
              Commit Plan to Execution
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
