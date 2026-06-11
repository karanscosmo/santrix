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
      <div className="space-y-md">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-md mb-xl">
          <div>
            <h2 className="font-display text-3xl text-on-surface font-bold flex items-center gap-sm">
              Security &amp; Governance Center
              <span className="w-2.5 h-2.5 bg-error rounded-full pulse-indicator inline-block"></span>
            </h2>
            <p className="font-mono text-xs text-on-surface-variant mt-xs">
              Monitor active identity contexts, inspect cryptographically signed logs, and enforce runtime guardrails.
            </p>
          </div>
          <div className="flex gap-sm font-mono text-xs bg-surface-container/30 px-md py-sm rounded-lg border border-outline-variant/30">
            <span className="text-tertiary">Node: santrix-node-01</span>
            <span className="text-on-surface-variant/55">•</span>
            <span className="text-primary">Status: SECURE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-md">
          {/* Left Column: Audit Logs & RBAC Matrix */}
          <div className="xl:col-span-8 space-y-md">
            
            {/* Real-time Centralized Layer 7 Audit Logs */}
            <div className="glass-panel rounded-xl p-md flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">assignment_turned_in</span>
                  Layer 7 Governance Logs
                </h3>
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-ping"></span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-xs select-all">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-sm bg-surface-container-lowest/30 rounded border border-outline-variant/35 text-on-surface-variant flex gap-sm items-start hover:border-primary/25 transition-all">
                    <span className={`px-2 py-0.5 rounded font-bold text-[8px] mt-0.5 ${
                      log.status === "SUCCESS" ? "text-tertiary bg-tertiary/10" : "text-error bg-error/10"
                    }`}>
                      {log.status}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-on-surface truncate"><strong className="text-primary">{log.action}</strong>: {log.details}</p>
                      <div className="flex justify-between text-[8px] text-on-surface-variant/60 mt-1">
                        <span>ACTOR: {log.userEmail} ({log.role})</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()} • IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Based Access Control (RBAC) Matrix */}
            <div className="glass-panel rounded-xl p-md">
              <div className="mb-md border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">policy</span>
                  Access Control Policy Matrix (RBAC)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-on-surface-variant">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-on-surface text-[10px] uppercase font-bold">
                      <th className="p-sm">Policy Target</th>
                      <th className="p-sm text-center">Admin</th>
                      <th className="p-sm text-center">Exec</th>
                      <th className="p-sm text-center">Analyst</th>
                      <th className="p-sm text-center">Viewer</th>
                      <th className="p-sm hidden md:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {rbacRules.map((rule) => (
                      <tr key={rule.action} className="hover:bg-surface-container-highest/20 transition-colors">
                        <td className="p-sm font-bold text-white">{rule.action}</td>
                        <td className="p-sm text-center">
                          <span className={`material-symbols-outlined text-sm ${rule.admin ? "text-tertiary" : "text-error/40"}`}>
                            {rule.admin ? "check_circle" : "cancel"}
                          </span>
                        </td>
                        <td className="p-sm text-center">
                          <span className={`material-symbols-outlined text-sm ${rule.exec ? "text-tertiary" : "text-error/40"}`}>
                            {rule.exec ? "check_circle" : "cancel"}
                          </span>
                        </td>
                        <td className="p-sm text-center">
                          <span className={`material-symbols-outlined text-sm ${rule.analyst ? "text-tertiary" : "text-error/40"}`}>
                            {rule.analyst ? "check_circle" : "cancel"}
                          </span>
                        </td>
                        <td className="p-sm text-center">
                          <span className={`material-symbols-outlined text-sm ${rule.viewer ? "text-tertiary" : "text-error/40"}`}>
                            {rule.viewer ? "check_circle" : "cancel"}
                          </span>
                        </td>
                        <td className="p-sm hidden md:table-cell text-on-surface-variant/80 text-[11px] font-sans">
                          {rule.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Governance Controls & Active Toggles */}
          <div className="xl:col-span-4 space-y-md">
            
            {/* Active Session Role Overrider */}
            <div className="glass-panel rounded-xl p-md border-2 border-primary/20">
              <h3 className="font-display text-md text-on-surface mb-xs font-bold text-[16px] text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined text-sm">shield</span> Runtime Identity Override
              </h3>
              <p className="font-sans text-xs text-on-surface-variant mb-md leading-relaxed">
                Dynamically switch roles in this simulation sandbox to test permissions of other users.
              </p>
              
              <div className="bg-surface-container p-sm rounded-xl border border-outline-variant">
                <label className="block font-sans text-[10px] text-on-surface-variant uppercase font-semibold mb-1">
                  Active User Role Scope
                </label>
                <select
                  value={currentUser.role}
                  onChange={(e) => {
                    const nextRole = e.target.value as UserRole;
                    setRole(nextRole);
                    addAuditLog("user.role_override", `Manually overrode local session role scope to '${nextRole}'`, "SUCCESS");
                  }}
                  className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-tertiary font-bold focus:border-primary outline-none"
                >
                  <option value="Admin">Admin (Full System Permissions)</option>
                  <option value="Executive">Executive (Simulate Models, Scoped API Keys)</option>
                  <option value="Analyst">Analyst (Trigger Telemetry, restricted boardroom)</option>
                  <option value="Viewer">Viewer (Read-Only access limiters)</option>
                </select>
                <div className="mt-sm flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Actor Node: {currentUser.id}</span>
                  <span>Scope: {currentUser.role === "Admin" ? "Full Access" : "Scoped Actions"}</span>
                </div>
              </div>
            </div>

            {/* Security Policy Flags */}
            <div className="glass-panel rounded-xl p-md space-y-md">
              <div className="border-b border-outline-variant/30 pb-sm">
                <h3 className="font-display text-base text-on-surface font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-secondary-fixed-dim">gavel</span>
                  Runtime Governance Guards
                </h3>
              </div>
              <div className="space-y-md">
                
                {/* Policy 1 */}
                <div className="flex justify-between items-start gap-md">
                  <div>
                    <span className="block font-sans text-xs font-bold text-white">AI Direct Asset Trading</span>
                    <span className="block font-sans text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                      Allow autonomous intelligence agents to trigger programmatic asset reallocations.
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePolicy("AI_DIRECT_TRADES", allowAiTrades, setAllowAiTrades)}
                    className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer shrink-0 mt-1 ${
                      allowAiTrades ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                        allowAiTrades ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Policy 2 */}
                <div className="flex justify-between items-start gap-md">
                  <div>
                    <span className="block font-sans text-xs font-bold text-white">Hardware 2FA Policies</span>
                    <span className="block font-sans text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                      Require physical security keys (YubiKey) for all core database mutations.
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePolicy("YUBIKEY_MUTATIONS", require2FA, setRequire2FA)}
                    className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer shrink-0 mt-1 ${
                      require2FA ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                        require2FA ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Policy 3 */}
                <div className="flex justify-between items-start gap-md">
                  <div>
                    <span className="block font-sans text-xs font-bold text-white">Corporate IP Whitelisting</span>
                    <span className="block font-sans text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                      Restrict platform mutations exclusively to registered enterprise CIDR blocks.
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePolicy("IP_WHITELIST", ipRestrictedMode, setIpRestrictedMode)}
                    className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer shrink-0 mt-1 ${
                      ipRestrictedMode ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                        ipRestrictedMode ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Policy 4 */}
                <div className="flex justify-between items-start gap-md">
                  <div>
                    <span className="block font-sans text-xs font-bold text-white">XSS Ingestion Sanitization Logs</span>
                    <span className="block font-sans text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                      Record all DOMPurify input filter triggers in centralized system status feed.
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePolicy("DOMPURIFY_LOGS", dataSanitizationLog, setDataSanitizationLog)}
                    className={`w-10 h-6 rounded-full relative border transition-all cursor-pointer shrink-0 mt-1 ${
                      dataSanitizationLog ? "bg-primary/20 border-primary" : "bg-surface-container-highest border-outline-variant"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${
                        dataSanitizationLog ? "bg-primary right-0.5 glow-button" : "bg-on-surface-variant left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
