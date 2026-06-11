"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/lib/SecurityContext";

interface ReportItem {
  id: string;
  name: string;
  type: "PDF" | "CSV" | "XLSX" | "JSON" | "TXT";
  status: "COMPLETED" | "COMPILING" | "FAILED";
  time: string;
  progress?: number;
  variance?: string;
  dataPoints?: number[];
  author?: string;
}

interface ConnectedSystem {
  id: string;
  name: string;
  category: string;
  status: "LIVE" | "SYNCING" | "PAUSED" | "DISCONNECTED";
  lastSync: string;
  percent?: number;
  color: string;
  icon: string;
}

export default function ReportsPage() {
  const { addAuditLog, checkPermission, sanitizeInput, rateLimitCheck } = useSecurity();
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Reports State
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep_1",
      name: "Q3 Board Report",
      type: "PDF",
      status: "COMPLETED",
      time: "2 hrs ago",
      author: "JD",
    },
    {
      id: "rep_2",
      name: "Investor Summary",
      type: "PDF",
      status: "COMPILING",
      time: "Compiling Data...",
      progress: 65,
      author: "AK",
    },
    {
      id: "rep_3",
      name: "FY24 Forecast Audit",
      type: "CSV",
      status: "COMPLETED",
      time: "Analyzed against 4 data sets",
      variance: "Variance Nominal",
      dataPoints: [30, 45, 35, 70, 85, 95],
      author: "JD",
    }
  ]);

  // Connected Systems State
  const [systems, setSystems] = useState<ConnectedSystem[]>([
    {
      id: "sys_1",
      name: "Salesforce",
      category: "CRM Data",
      status: "LIVE",
      lastSync: "2m ago",
      color: "text-[#00a1e0]",
      icon: "cloud"
    },
    {
      id: "sys_2",
      name: "PostgreSQL",
      category: "Core DB",
      status: "LIVE",
      lastSync: "5s ago",
      color: "text-[#336791]",
      icon: "data_object"
    },
    {
      id: "sys_3",
      name: "Jira",
      category: "Issues",
      status: "SYNCING",
      lastSync: "Syncing",
      percent: 85,
      color: "text-[#0052CC]",
      icon: "bug_report"
    },
    {
      id: "sys_4",
      name: "Slack",
      category: "Comms",
      status: "PAUSED",
      lastSync: "Manual",
      color: "text-[#E01E5A]",
      icon: "forum"
    }
  ]);

  // Compile Progress Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setReports(prev =>
        prev.map(r => {
          if (r.status === "COMPILING" && r.progress !== undefined) {
            const nextProgress = r.progress + 5;
            if (nextProgress >= 100) {
              return {
                ...r,
                status: "COMPLETED",
                progress: undefined,
                time: "Just now"
              };
            }
            return {
              ...r,
              progress: nextProgress
            };
          }
          return r;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Secure File Upload Handlers (Layer 3 & 4)
  const validateAndAddReport = (fileName: string, fileSize: number, fileType: string) => {
    // Check role permission
    if (!checkPermission("file:upload")) {
      alert("Access Denied: Viewer/Analyst credentials lack document ingestion permissions.");
      return;
    }

    // Rate Limit check
    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Try again in a minute.");
      return;
    }

    // Max Size Validation (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileSize > MAX_SIZE) {
      alert(`Security Blocked: File size (${(fileSize / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit.`);
      addAuditLog("upload.rejected", `Size violation for file ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)}MB)`, "FAILED");
      return;
    }

    // Allowed Extensions Filter
    const allowedExtensions = [".pdf", ".csv", ".xlsx", ".json", ".txt"];
    const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      alert(`Security Blocked: Unauthorized extension "${fileExt}". Only PDF, CSV, XLSX, JSON, and TXT files are permitted.`);
      addAuditLog("upload.rejected", `Extension violation for file: ${fileName}`, "FAILED");
      return;
    }

    // Filename Sanitization & XSS Mitigation
    const sanitizedName = sanitizeInput(fileName).replace(/[^a-zA-Z0-9_.-]/g, "_");

    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      name: sanitizedName.replace(/\.[^/.]+$/, ""), // remove ext for display name
      type: fileExt.substring(1).toUpperCase() as "PDF" | "CSV" | "XLSX" | "JSON" | "TXT",
      status: "COMPILING",
      time: "Analyzing schema...",
      progress: 20,
      author: "JD"
    };

    setReports(prev => [newReport, ...prev]);
    addAuditLog("report.ingest", `Ingested file: ${sanitizedName} for processing`, "SUCCESS");

    // Simulate analysis timeline
    setTimeout(() => {
      setReports(currentReports =>
        currentReports.map(r => {
          if (r.id === newReport.id) {
            return {
              ...r,
              status: "COMPLETED",
              progress: undefined,
              time: "Just now"
            };
          }
          return r;
        })
      );
      addAuditLog("report.compile_success", `Successfully verified schema and created report: ${sanitizedName}`, "SUCCESS");
    }, 5000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndAddReport(file.name, file.size, file.type);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndAddReport(file.name, file.size, file.type);
    }
  };

  // Sync System Action
  const triggerSync = (systemId: string) => {
    if (!checkPermission("config:write")) {
      alert("Unauthorized: Executive or Admin credentials required to trigger system syncs.");
      return;
    }

    setSystems(prev =>
      prev.map(s => {
        if (s.id === systemId) {
          addAuditLog("system.sync_start", `Triggered manual sync for data connector: ${s.name}`, "SUCCESS");
          
          // Complete mock sync in 3s
          setTimeout(() => {
            setSystems(currentSystems =>
              currentSystems.map(cs => {
                if (cs.id === systemId) {
                  addAuditLog("system.sync_complete", `Sync completed for connector: ${cs.name}`, "SUCCESS");
                  return {
                    ...cs,
                    status: "LIVE",
                    lastSync: "Just now",
                    percent: undefined
                  };
                }
                return cs;
              })
            );
          }, 3000);

          return {
            ...s,
            status: "SYNCING",
            percent: 5,
            lastSync: "Syncing..."
          };
        }
        return s;
      })
    );
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md streaming-pulse">
        <div>
          <h2 className="font-display text-4xl text-on-surface">Intelligence Hub</h2>
          <p className="font-mono text-xs text-on-surface-variant">System synchronization optimal. 42 Active pipelines.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => alert("Filter overlays enabled.")}
            className="border border-outline-variant text-on-surface px-md py-sm rounded-lg font-sans text-xs uppercase font-bold hover:bg-surface-container-high transition-colors flex items-center gap-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span> Filter
          </button>
          <label
            htmlFor="header-upload-input"
            className="bg-primary text-on-primary px-md py-sm rounded-lg font-sans text-xs uppercase font-bold hover:opacity-90 transition-opacity flex items-center gap-xs glow-active cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span> New Report
            <input
              type="file"
              id="header-upload-input"
              className="hidden"
              accept=".pdf,.csv,.xlsx,.json,.txt"
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md pb-8">
        {/* Reports panel (Spans 8 columns on desktop) */}
        <div className="lg:col-span-8 space-y-md">
          <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">assessment</span> Generated Reports
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`glass-panel p-md relative overflow-hidden rounded-xl group hover:border-primary transition-colors cursor-pointer flex flex-col justify-between min-h-[160px] ${
                  report.status === "COMPILING" ? "streaming-pulse" : ""
                }`}
              >
                {report.status === "COMPLETED" ? (
                  <div className="absolute top-0 right-0 p-sm text-tertiary">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 p-sm text-secondary">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  </div>
                )}

                <div className="mb-md">
                  <span className="material-symbols-outlined text-on-surface-variant mb-xs">
                    {report.type === "PDF" ? "pie_chart" : report.type === "CSV" ? "show_chart" : "description"}
                  </span>
                  <h4 className="font-display text-md text-on-surface font-semibold">{report.name}</h4>
                  <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">
                    {report.status === "COMPILING" ? report.time : `Generated: ${report.time}`}
                  </p>
                </div>

                {report.status === "COMPILING" && report.progress !== undefined && (
                  <div className="w-full mb-md">
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${report.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[9px] text-secondary mt-1 block">{report.progress}% Complete</span>
                  </div>
                )}

                {/* Render sparkline if fy24 forecast / dataPoints */}
                {report.dataPoints && (
                  <div className="h-16 bg-surface-container-low rounded border border-outline-variant/50 flex items-end justify-between p-1.5 mt-sm mb-md">
                    {report.dataPoints.map((dp, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${dp}%` }}
                        className="w-[14%] bg-primary/40 rounded-t hover:bg-primary transition-all cursor-pointer"
                        title={`Variance score: ${dp}`}
                      ></div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-outline-variant/30 pt-sm mt-sm">
                  {report.author && (
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-surface-container-high border border-surface flex items-center justify-center text-[8px] text-on-surface font-bold">
                        {report.author}
                      </div>
                    </div>
                  )}
                  {report.variance && (
                    <span className="text-[10px] font-mono text-tertiary bg-tertiary/10 border border-tertiary/20 px-1.5 py-0.5 rounded">
                      {report.variance}
                    </span>
                  )}
                  <span className="font-sans text-[10px] font-bold text-primary group-hover:underline uppercase tracking-wider">
                    {report.status === "COMPLETED" ? `View ${report.type}` : "Processing"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Secure File Ingestion widget */}
          <div className="pt-md border-t border-outline-variant/30">
            <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-xs mb-sm">
              <span className="material-symbols-outlined text-sm">cloud_upload</span> File Schema Ingestion (Layer 3 Security)
            </h3>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-lg flex flex-col items-center justify-center transition-all cursor-pointer min-h-[160px] ${
                dragActive ? "border-primary bg-primary/10" : "border-outline-variant hover:border-primary/50 bg-surface-container-lowest/50"
              }`}
            >
              <input
                type="file"
                id="sec-upload-input"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.json,.txt"
                onChange={handleFileInputChange}
              />
              <label htmlFor="sec-upload-input" className="cursor-pointer flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary mb-sm">
                  file_upload
                </span>
                <p className="font-sans text-sm text-on-surface font-bold">Drag &amp; drop data reports or click to upload</p>
                <p className="font-mono text-[9px] text-on-surface-variant mt-xs">
                  Supported extensions: PDF, CSV, XLSX, JSON, TXT (Maximum limit 10MB)
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Systems sync status (Spans 4 columns on desktop) */}
        <div className="lg:col-span-4 space-y-md">
          <h3 className="font-sans text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">database</span> Connected Systems
          </h3>

          <div className="glass-panel rounded-xl flex flex-col h-full border border-outline-variant/60">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-[#090D1A]/50 rounded-t-xl">
              <span className="font-sans text-xs uppercase font-bold text-on-surface">Data Connectors</span>
              <span className="material-symbols-outlined text-on-surface-variant text-md">hub</span>
            </div>

            <div className="flex-1 p-sm space-y-sm">
              {systems.map((sys) => (
                <div
                  key={sys.id}
                  className="flex items-center justify-between p-sm hover:bg-surface-container rounded-xl transition-all border border-transparent hover:border-outline-variant/30 group"
                >
                  <div className="flex items-center gap-md">
                    <div className={`w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center ${sys.color}`}>
                      <span className="material-symbols-outlined text-lg">{sys.icon}</span>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase font-bold text-on-surface">{sys.name}</p>
                      <p className="font-mono text-[9px] text-on-surface-variant">{sys.category}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    {sys.status === "LIVE" && (
                      <div className="flex items-center gap-1 text-tertiary">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        <span className="font-mono text-[10px]">Live</span>
                      </div>
                    )}
                    {sys.status === "SYNCING" && (
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                        <span className="font-mono text-[10px]">Syncing</span>
                      </div>
                    )}
                    {sys.status === "PAUSED" && (
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[12px]">pause_circle</span>
                        <span className="font-mono text-[10px]">Paused</span>
                      </div>
                    )}
                    <span className="font-mono text-[9px] text-on-surface-variant mt-0.5">
                      {sys.percent ? `${sys.percent}% complete` : `Last sync: ${sys.lastSync}`}
                    </span>

                    {/* Sync Trigger button */}
                    <button
                      onClick={() => triggerSync(sys.id)}
                      disabled={sys.status === "SYNCING"}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-primary font-bold uppercase tracking-wider hover:underline mt-1 transition-opacity cursor-pointer disabled:opacity-30"
                    >
                      Sync Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-md border-t border-outline-variant/50 bg-[#090D1A]/50 rounded-b-xl">
              <button
                onClick={() => alert("Activity logs loaded.")}
                className="w-full text-center font-sans text-xs uppercase font-bold text-primary hover:text-primary-container transition-colors py-1 cursor-pointer"
              >
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
