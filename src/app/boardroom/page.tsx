"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "APPROVED" | "PENDING";
}

export default function BoardroomPage() {
  const { addAuditLog, checkPermission } = useSecurity();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "chk_1",
      title: "Ad Spend Shift Approval",
      description: "Approved. Reallocated $150K display budget to search. Telemetry showing CTR improvement.",
      status: "APPROVED",
    },
    {
      id: "chk_2",
      title: "CS Customer Retention Agent Swarm Sign-off",
      description: "Pending approval. Awaiting QA confirmation of outbound email scripts.",
      status: "PENDING",
    },
  ]);

  const triggerExport = () => {
    // RBAC: Only Admin/Executive can export boardroom decks
    if (!checkPermission("boardroom:export")) {
      alert("Access Denied: Your current role does not have permission to export Boardroom reports.");
      addAuditLog("boardroom.export_failed", "Boardroom report export failed: insufficient permission", "FAILED");
      return;
    }

    setIsExporting(true);
    addAuditLog("boardroom.export_started", "Boardroom report compilation started", "SUCCESS");

    setTimeout(() => {
      setIsExporting(false);
      addAuditLog("boardroom.export_complete", "Boardroom PDF & Excel deck successfully downloaded", "SUCCESS");
      alert(
        "Board deck and financial model compiled successfully.\n1. Sanktrix_Board_Brief_Q3.pdf\n2. Sanktrix_Runway_Simulation_Model.xlsx\nFiles downloaded."
      );
    }, 2000);
  };

  const handleToggleChecklist = (id: string) => {
    if (!checkPermission("config:write")) {
      alert("Access Denied: You do not have permission to check off boardroom directives.");
      return;
    }

    setChecklist(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === "APPROVED" ? "PENDING" : "APPROVED";
          addAuditLog("boardroom.toggle_checklist", `Toggled checklist ${item.title} to ${nextStatus}`, "SUCCESS");
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="relative space-y-md">
        {/* Floating overlay for export loading */}
        {isExporting && (
          <div className="absolute inset-0 bg-surface-lowest/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center min-h-[500px] rounded-xl border border-outline-variant">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-primary"></div>
            <h3 className="font-display text-headline-md text-on-surface mt-lg">Compiling Board Documents...</h3>
            <p className="font-mono text-on-surface-variant text-xs mt-sm">Executing Wolfram Report Compiler Kernel...</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-sm gap-sm">
          <div>
            <h2 className="font-display text-headline-md text-on-surface text-[22px] font-bold">Executive Boardroom Mode</h2>
            <p className="text-xs text-on-surface-variant mt-1">Ready for Investor Presentation</p>
          </div>
          <button
            onClick={triggerExport}
            className="bg-primary text-on-primary font-semibold text-xs tracking-wider uppercase px-md py-sm rounded hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(176,198,255,0.3)] flex items-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            One-Click Export
          </button>
        </div>

        {/* Row 1: Executive summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
          {/* Board Report Card */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[300px] relative overflow-hidden">
            <div className="stream-pulse"></div>
            <div className="border-b border-outline-variant/30 pb-sm mb-xs">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Q3 Executive Board Report</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">SANKTRIX AUTONOMOUS STRATEGY SUMMARY</p>
            </div>
            <div className="flex-grow text-xs text-on-surface-variant leading-relaxed space-y-sm overflow-y-auto py-sm pr-xs">
              <p>
                We present a highly robust plan for Q3 operations. Following parametric tuning of core customer success
                channels, our projected Q3 ARR stands at <strong>$42.8M</strong>. Operational costs have been
                auto-mitigated through agent-led cloud budget balancing, extending cash runway thresholds to{" "}
                <strong>18.4 months</strong>.
              </p>
              <p>
                Critical board approval items include signing off on the Search ad conversion expansion strategy and
                approving dev headcount increases for Q4 roadmap delivery acceleration.
              </p>
            </div>
            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
              <span>CONFIDENTIAL // INTERNAL BOARD ONLY</span>
              <span className="text-tertiary">VERSION 2.4.1</span>
            </div>
          </div>

          {/* Investor briefing Card */}
          <div className="glass-panel rounded-xl p-md flex flex-col justify-between h-[300px]">
            <div className="border-b border-outline-variant/30 pb-sm mb-xs">
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">Investor Summary Brief</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1">
                CAPITAL EFFICIENCY AND REVENUE TRAJECTORY
              </p>
            </div>
            <div className="flex-grow text-xs text-on-surface-variant leading-relaxed space-y-sm overflow-y-auto py-sm pr-xs">
              <p>
                Sanktrix continues to demonstrate sector-leading capital efficiency. Our Wolfram-powered mathematical
                engine tracks capital allocation across departments, yielding a net burn-to-growth multiplier of{" "}
                <strong>1.48x</strong>.
              </p>
              <p>
                Investor presentations can be customized to focus on LTV:CAC ratios, core retention metrics, and
                bottom-line stability under macroeconomic scenario adjustments.
              </p>
            </div>
            <div className="pt-sm border-t border-outline-variant/30 flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
              <span>CONFIDENTIAL // INVESTOR ACCREDITED ONLY</span>
              <span className="text-tertiary">SYNCED LIVE WITH CLICKHOUSE</span>
            </div>
          </div>
        </div>

        {/* Row 2: Financial forecasting table */}
        <div className="glass-panel rounded-xl p-md">
          <div className="border-b border-outline-variant/30 pb-sm mb-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-sm">
            <div>
              <h3 className="font-display text-headline-md text-on-surface text-[18px]">
                Quarterly Presentation & Financial Planning
              </h3>
              <p className="font-mono text-xs text-on-surface-variant mt-1 font-semibold uppercase tracking-wider">
                WOLFRAM ESTIMATES UNDER COMMITMENT PARAMETERS
              </p>
            </div>
            <span className="text-[10px] font-mono bg-tertiary/10 border border-tertiary/30 text-tertiary px-2 py-0.5 rounded inline-block self-start sm:self-center font-bold">
              98% Accuracy Index
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-on-surface-variant min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant/50 text-on-surface">
                  <th className="pb-sm font-normal">Metric Category</th>
                  <th className="pb-sm font-normal text-right">Q2 Actuals</th>
                  <th className="pb-sm font-normal text-right">Q3 Projected</th>
                  <th className="pb-sm font-normal text-right">Q4 Projected</th>
                  <th className="pb-sm font-normal text-right">YOY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr className="hover:bg-surface-container-highest/20 transition-colors">
                  <td className="py-md text-on-surface font-bold">Annual Recurring Revenue (ARR)</td>
                  <td className="py-md text-right">$41.2M</td>
                  <td className="py-md text-right text-primary font-bold">$42.8M</td>
                  <td className="py-md text-right">$45.4M</td>
                  <td className="py-md text-right text-tertiary font-bold">+18.2%</td>
                </tr>
                <tr className="hover:bg-surface-container-highest/20 transition-colors">
                  <td className="py-md text-on-surface font-bold">Monthly Burn Rate</td>
                  <td className="py-md text-right">$1.9M</td>
                  <td className="py-md text-right text-tertiary font-bold">$1.6M</td>
                  <td className="py-md text-right">$1.5M</td>
                  <td className="py-md text-right text-tertiary font-bold">-21.0%</td>
                </tr>
                <tr className="hover:bg-surface-container-highest/20 transition-colors">
                  <td className="py-md text-on-surface font-bold">LTV:CAC Ratio</td>
                  <td className="py-md text-right">3.8x</td>
                  <td className="py-md text-right text-primary font-bold">4.2x</td>
                  <td className="py-md text-right">4.5x</td>
                  <td className="py-md text-right text-tertiary font-bold">+15.8%</td>
                </tr>
                <tr className="hover:bg-surface-container-highest/20 transition-colors">
                  <td className="py-md text-on-surface font-bold">Active Customer Base</td>
                  <td className="py-md text-right">12,482</td>
                  <td className="py-md text-right text-primary font-bold">13,010</td>
                  <td className="py-md text-right">14,200</td>
                  <td className="py-md text-right text-tertiary font-bold">+22.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Strategic risk checklist */}
        <div className="glass-panel rounded-xl p-md">
          <div className="border-b border-outline-variant/30 pb-sm mb-sm">
            <h3 className="font-display text-headline-md text-on-surface text-[18px]">Quarterly Board Risk Checklist</h3>
            <p className="font-mono text-xs text-on-surface-variant mt-1">COMPLIANCE AND EXPOSURE MITIGATION PLAN</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md my-sm">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className="flex items-start gap-sm text-left hover:bg-surface-container/30 p-sm rounded border border-transparent hover:border-outline-variant/40 transition-colors w-full cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-sm mt-0.5 ${
                    item.status === "APPROVED" ? "text-tertiary" : "text-outline"
                  }`}
                >
                  {item.status === "APPROVED" ? "check_box" : "check_box_outline_blank"}
                </span>
                <div>
                  <span className="text-xs text-on-surface font-bold block">{item.title}</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
