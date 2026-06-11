"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";
import { UserRole } from "@/types";

export default function SecurityPage() {
  const { currentUser, setRole, auditLogs, addAuditLog, rateLimitCheck } = useSecurity();

  // Security Policy Toggles
  const [allowAiTrades, setAllowAiTrades] = useState(false);
  const [require2FA, setRequire2FA] = useState(true);
  const [ipRestrictedMode, setIpRestrictedMode] = useState(false);
  const [dataSanitizationLog, setDataSanitizationLog] = useState(true);

  // Trigger Policy Change Log
  const handleTogglePolicy = (policyName: string, currentValue: boolean, setValue: (v: boolean) => void) => {
    const nextVal = !currentValue;
    setValue(nextVal);
    addAuditLog(
      "security.policy_update",
      `Toggled policy '${policyName}' to ${nextVal ? "ENABLED" : "DISABLED"}`,
      "SUCCESS"
    );
  };

  // RBAC Permission Grid Definitions
  const rbacRules = [
    { action: "simulation:run", admin: true, exec: true, analyst: true, viewer: false, desc: "Execute computational simulation models" },
    { action: "config:write", admin: true, exec: false, analyst: false, viewer: false, desc: "Modify cloud regional parameters" },
    { action: "api_key:generate", admin: true, exec: true, analyst: false, viewer: false, desc: "Create and sign production credentials" },
    { action: "agent:deploy", admin: true, exec: true, analyst: true, viewer: false, desc: "Deploy autonomous reasoning swarms" },
    { action: "audit:purge", admin: false, exec: false, analyst: false, viewer: false, desc: "Flush centralized governance logs (Immutable)" },
  ];

  return (
    <DashboardLayout>
      {/* 1. Page Header matching visual hierarchy guidelines */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Security &amp; Governance Center
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-wider">
            Monitor active identity contexts, inspect cryptographically signed logs, and enforce runtime guardrails.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-[#0d0f14] border border-white/[0.06] rounded-[10px] px-3.5 py-1.5 text-[10px] font-mono font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            IP: santrix-node-01 • SECURE
          </div>
        </div>
      </header>

      {/* 2. Grid split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (Col 8) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Layer 7 Governance Logs */}
          <div className="panel-layer p-5 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4 border-b border-white/[0.04] pb-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#8ab4f8]">assignment_turned_in</span>
                Layer 7 Governance Logs
              </h3>
              <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-ping"></span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-1 scrollbar-thin">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#050505]/40 rounded-[12px] border border-white/[0.03] text-gray-400 flex gap-3 items-start hover:border-[#8ab4f8]/20 transition-colors">
                  <span className={`px-2 py-0.5 rounded font-bold text-[8px] mt-0.5 shrink-0 ${
                    log.status === "SUCCESS" ? "text-[#4edea3] bg-[#4edea3]/10" : "text-red-400 bg-red-400/10"
                  }`}>
                    {log.status}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">
                      <strong className="text-[#8ab4f8] font-bold">{log.action}</strong>: {log.details}
                    </p>
                    <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                      <span>ACTOR: {log.userEmail} ({log.role})</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()} • IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Control Policy Matrix (RBAC) */}
          <div className="panel-layer p-5">
            <div className="mb-4 border-b border-white/[0.04] pb-3">
              <h3 className="font-display text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#8ab4f8]">policy</span>
                Access Control Policy Matrix (RBAC)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-gray-400">
                <thead>
                  <tr className="border-b border-white/[0.04] text-gray-500 text-[9px] uppercase font-bold">
                    <th className="p-2.5">POLICY TARGET</th>
                    <th className="p-2.5 text-center">ADMIN</th>
                    <th className="p-2.5 text-center">EXEC</th>
                    <th className="p-2.5 text-center">ANALYST</th>
                    <th className="p-2.5 text-center">VIEWER</th>
                    <th className="p-2.5 hidden md:table-cell">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {rbacRules.map((rule) => (
                    <tr key={rule.action} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-2.5 font-bold text-white">{rule.action}</td>
                      <td className="p-2.5 text-center">
                        <span className={`material-symbols-outlined text-sm ${rule.admin ? "text-[#4edea3]" : "text-red-400/40"}`}>
                          {rule.admin ? "check_circle" : "cancel"}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`material-symbols-outlined text-sm ${rule.exec ? "text-[#4edea3]" : "text-red-400/40"}`}>
                          {rule.exec ? "check_circle" : "cancel"}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`material-symbols-outlined text-sm ${rule.analyst ? "text-[#4edea3]" : "text-red-400/40"}`}>
                          {rule.analyst ? "check_circle" : "cancel"}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`material-symbols-outlined text-sm ${rule.viewer ? "text-[#4edea3]" : "text-red-400/40"}`}>
                          {rule.viewer ? "check_circle" : "cancel"}
                        </span>
                      </td>
                      <td className="p-2.5 hidden md:table-cell text-gray-400 font-sans text-xs font-light">
                        {rule.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (Col 4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Runtime Role Switcher */}
          <div className="card-layer p-5 border border-[#8ab4f8]/20 bg-[#0d0f14]/50">
            <h3 className="font-display text-sm text-white mb-2 font-bold flex items-center gap-2 text-[#8ab4f8]">
              <span className="material-symbols-outlined text-sm">shield</span> Runtime Identity Override
            </h3>
            <p className="font-sans text-[11px] text-gray-400 mb-4 leading-relaxed font-light">
              Dynamically switch roles in this simulation sandbox to test permissions of other users.
            </p>
            
            <div className="bg-[#050505]/40 p-3.5 rounded-[12px] border border-white/[0.04]">
              <label className="block font-sans text-[9px] text-gray-500 uppercase font-bold mb-1.5">
                Active User Role Scope
              </label>
              <select
                value={currentUser.role}
                onChange={(e) => {
                  const nextRole = e.target.value as UserRole;
                  setRole(nextRole);
                  addAuditLog("user.role_override", `Manually overrode local session role scope to '${nextRole}'`, "SUCCESS");
                }}
                className="w-full bg-[#050505] border border-white/[0.06] rounded-[10px] p-2 font-mono text-xs text-amber-500 font-bold focus:border-[#8ab4f8] outline-none"
              >
                <option value="Admin">Admin (Full System Permissions)</option>
                <option value="Executive">Executive (Simulate Models, Scoped API Keys)</option>
                <option value="Analyst">Analyst (Trigger Telemetry, restricted boardroom)</option>
                <option value="Viewer">Viewer (Read-Only access limiters)</option>
              </select>
              <div className="mt-3 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                <span>Actor ID: {currentUser.id}</span>
                <span>Scope: {currentUser.role === "Admin" ? "Full Access" : "Scoped Actions"}</span>
              </div>
            </div>
          </div>

          {/* Runtime Toggles */}
          <div className="card-layer p-5 space-y-4">
            <div className="border-b border-white/[0.04] pb-2">
              <h3 className="font-display text-xs text-white uppercase tracking-wider flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-sm text-[#8ab4f8]">gavel</span>
                Runtime Governance Guards
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "AI Direct Asset Trading", desc: "Allow autonomous intelligence agents to trigger programmatic asset reallocations.", val: allowAiTrades, setter: setAllowAiTrades, label: "AI_DIRECT_TRADES" },
                { name: "Hardware 2FA Policies", desc: "Require physical security keys (YubiKey) for all core database mutations.", val: require2FA, setter: setRequire2FA, label: "YUBIKEY_MUTATIONS" },
                { name: "Corporate IP Whitelisting", desc: "Restrict platform mutations exclusively to registered enterprise CIDR blocks.", val: ipRestrictedMode, setter: setIpRestrictedMode, label: "IP_WHITELIST" },
                { name: "XSS Ingestion Sanitization Logs", desc: "Record all DOMPurify input filter triggers in centralized status feed.", val: dataSanitizationLog, setter: setDataSanitizationLog, label: "DOMPURIFY_LOGS" },
              ].map((policy, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="block font-sans text-xs font-bold text-white">{policy.name}</span>
                    <span className="block font-sans text-[10px] text-gray-400 mt-1 leading-normal font-light">
                      {policy.desc}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePolicy(policy.label, policy.val, policy.setter)}
                    className={`w-9 h-5 rounded-full relative border transition-all cursor-pointer shrink-0 mt-0.5 ${
                      policy.val ? "bg-[#8ab4f8]/20 border-[#8ab4f8]/60" : "bg-[#1c1d24] border-white/[0.06]"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${
                        policy.val ? "bg-[#8ab4f8] right-[2px]" : "bg-gray-500 left-[2px]"
                      }`}
                    ></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
