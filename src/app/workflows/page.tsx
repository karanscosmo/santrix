"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSecurity } from "@/context/SecurityContext";

interface NodeData {
  id: string;
  type: "trigger" | "agent" | "action";
  name: string;
  x: number;
  y: number;
  data: Record<string, string>;
}

interface LogLine {
  time: string;
  type: "INFO" | "EXEC" | "ACT" | "SUCCESS" | "ERROR";
  text: string;
}

export default function WorkflowsPage() {
  const { addAuditLog, checkPermission, rateLimitCheck, sanitizeInput } = useSecurity();

  // Nodes state
  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: "anomaly_trigger",
      type: "trigger",
      name: "Anomaly Trigger",
      x: 50,
      y: 100,
      data: {
        stream: "GL_TRANSACTIONS",
        threshold: "> 3.5σ",
      },
    },
    {
      id: "finance_agent",
      type: "agent",
      name: "Finance Agent",
      x: 420,
      y: 180,
      data: {
        task: "Analyze Variance",
        model: "Sanktrix-Fin-v4 (Recommended)",
        prompt: "You are a senior financial analyst. Analyze the anomaly in the GL data provided. Determine if it is a structural error or a valid variance based on historical Q3 patterns. Format output as a brief executive summary.",
        variables: "trigger.amount, trigger.account_id"
      },
    },
    {
      id: "slack_alert",
      type: "action",
      name: "Slack Alert",
      x: 800,
      y: 100,
      data: {
        channel: "#fin-ops-alerts",
        priority: "High",
      },
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>("finance_agent");
  const [activeTab, setActiveTab] = useState<"properties" | "library">("properties");
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<LogLine[]>([
    { time: "10:42:01", type: "INFO", text: "Workflow initialized." },
    { time: "10:42:02", type: "INFO", text: "Ready for telemetry triggers." },
  ]);

  // Dragging state
  const dragInfo = useRef<{ nodeId: string; startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    dragInfo.current = {
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: node.x,
      nodeStartY: node.y
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragInfo.current) return;
    const { nodeId, startX, startY, nodeStartX, nodeStartY } = dragInfo.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          x: Math.max(10, Math.min(1200, nodeStartX + dx)),
          y: Math.max(10, Math.min(600, nodeStartY + dy))
        };
      }
      return node;
    }));
  };

  const handleMouseUp = () => {
    dragInfo.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Node input state modifications (updates nodes state)
  const updateNodeData = (nodeId: string, key: string, val: string) => {
    // Check RBAC permission for configuration modification
    if (!checkPermission("config:write")) {
      alert("Unauthorized action. Executive or Admin credentials required to modify workflow node settings.");
      return;
    }

    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            [key]: val
          }
        };
      }
      return node;
    }));
  };

  // Run Workflow Simulation
  const executeWorkflow = () => {
    if (!checkPermission("simulation:run")) {
      alert("Access Denied: Viewer role cannot run active workflows.");
      return;
    }

    if (!rateLimitCheck()) {
      alert("Rate limit exceeded. Too many requests. Try again in a minute.");
      return;
    }

    if (isExecuting) return;

    setIsExecuting(true);
    setTerminalLogs([]);

    const runLogs: Omit<LogLine, "time">[] = [
      { type: "INFO", text: `Triggering workflow from stream ${nodes[0]?.data.stream || "GL_TRANSACTIONS"}...` },
      { type: "INFO", text: `Evaluating condition: threshold matches ${nodes[0]?.data.threshold || "> 3.5σ"}` },
      { type: "EXEC", text: `Routing execution payload to ${nodes[1]?.name || "Finance Agent"}...` },
      { type: "EXEC", text: `Model ${nodes[1]?.data.model || "Sanktrix-Fin-v4"} response compiled.` },
      { type: "ACT", text: `Posting Slack alert alert to ${nodes[2]?.data.channel || "#fin-ops-alerts"} (Priority: ${nodes[2]?.data.priority || "High"})` },
      { type: "SUCCESS", text: "Workflow run completed successfully. Zero exceptions." }
    ];

    let currentLogIndex = 0;

    const interval = setInterval(() => {
      if (currentLogIndex < runLogs.length) {
        const item = runLogs[currentLogIndex];
        const newLog: LogLine = {
          time: new Date().toTimeString().split(" ")[0],
          ...item
        };
        setTerminalLogs(prev => [...prev, newLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsExecuting(false);
        addAuditLog(
          "workflow.execute",
          `Executed workflow orchestration pipeline [${nodes.map(n => n.name).join(" -> ")}]`,
          "SUCCESS"
        );
      }
    }, 1200);
  };

  // Adding a new node from Library
  const addNodeFromLibrary = (nodeType: "trigger" | "agent" | "action", name: string) => {
    if (!checkPermission("config:write")) {
      alert("Unauthorized action. Executive or Admin credentials required to add components.");
      return;
    }

    const id = `node_${Date.now()}`;
    const x = 300 + Math.random() * 200;
    const y = 100 + Math.random() * 200;

    let initialData = {};
    if (nodeType === "trigger") {
      initialData = { stream: "NEW_DB_LOGS", threshold: "status == 'ERROR'" };
    } else if (nodeType === "agent") {
      initialData = { task: "Generic analysis", model: "Claude-3.5-Sonnet", prompt: "Summarize alerts." };
    } else {
      initialData = { channel: "#ops-alerts", priority: "Medium" };
    }

    const newNode: NodeData = {
      id,
      type: nodeType,
      name,
      x,
      y,
      data: initialData
    };

    setNodes(prev => [...prev, newNode]);
    addAuditLog("workflow.node_add", `Added node: ${name} (${nodeType}) to workspace.`, "SUCCESS");
  };

  // Draw smooth curves connecting nodes dynamically based on positions
  // Sort nodes by X coordinate to draw connections in order
  const sortedNodes = [...nodes].sort((a, b) => a.x - b.x);

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md mb-md">
        <div>
          <h2 className="font-display text-4xl text-on-surface">Workflow Orchestration</h2>
          <p className="font-mono text-xs text-on-surface-variant">Visual n8n & Temporal Orchestrator. 3 Active pipelines.</p>
        </div>
        <button
          onClick={executeWorkflow}
          disabled={isExecuting}
          className={`flex items-center gap-xs px-md py-sm rounded font-sans text-xs uppercase font-bold transition-all shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer ${
            isExecuting
              ? "bg-outline-variant text-on-surface-variant"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          {isExecuting ? "Executing..." : "Execute Workflow"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low h-[calc(100vh-220px)] relative">
        {/* Canvas Area */}
        <div className="flex-1 bg-surface-dim grid-bg relative overflow-hidden h-full">
          {/* Zoom controls */}
          <div className="absolute bottom-md right-md flex gap-xs bg-surface-container border border-outline-variant rounded-lg p-xs z-10">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded">
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <div className="w-px bg-outline-variant my-xs mx-xs"></div>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded">
              <span className="material-symbols-outlined text-[18px]">fit_screen</span>
            </button>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {sortedNodes.map((node, index) => {
              if (index === sortedNodes.length - 1) return null;
              const nextNode = sortedNodes[index + 1];

              // Coordinates are offset to align with center/connection points
              const startX = node.x + 256; // width of node is 256px (w-64)
              const startY = node.y + 50;  // approximate center height
              const endX = nextNode.x;
              const endY = nextNode.y + 50;

              const cp1X = startX + 100;
              const cp1Y = startY;
              const cp2X = endX - 100;
              const cp2Y = endY;

              const pathColor = 
                node.type === "trigger" ? "#4edea3" :
                node.type === "agent" ? "#b0c6ff" : "#ffb955";

              return (
                <path
                  key={`line-${node.id}-${nextNode.id}`}
                  className="connection-line"
                  d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                  fill="none"
                  stroke={pathColor}
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Nodes list */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const themeClass = 
              node.type === "trigger" ? "border-tertiary/30 bg-tertiary/10 text-tertiary" :
              node.type === "agent" ? "border-primary/30 bg-primary/10 text-primary" :
              "border-secondary/30 bg-secondary/10 text-secondary";

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onClick={() => setSelectedNodeId(node.id)}
                className={`absolute w-64 bg-surface-container-low border rounded-xl z-10 cursor-pointer transition-shadow ${
                  isSelected ? "ring-2 ring-primary border-primary node-glow" : "border-outline-variant/60 shadow-lg"
                }`}
              >
                {/* Node Titlebar / Drag Handle */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  className={`p-sm flex items-center gap-sm rounded-t-xl cursor-move border-b border-outline-variant ${themeClass}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {node.type === "trigger" ? "bolt" : node.type === "agent" ? "support_agent" : "chat"}
                  </span>
                  <span className="font-sans text-xs uppercase font-bold tracking-wide">{node.name}</span>
                  {node.type === "trigger" && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-tertiary pulse-indicator"></span>
                  )}
                </div>

                {/* Node details */}
                <div className="p-md font-mono text-[10px] space-y-1 text-on-surface-variant">
                  {Object.entries(node.data).map(([k, v]) => {
                    if (k === "prompt" || k === "variables") return null; // hide long items in card
                    return (
                      <div key={k} className="flex justify-between">
                        <span className="text-on-surface-variant/70 capitalize">{k}:</span>
                        <span className="text-on-surface font-semibold text-right max-w-[150px] truncate">{v}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar (Properties & Library) */}
        <div className="w-full lg:w-80 bg-surface-container-low border-t lg:border-t-0 lg:border-l border-outline-variant flex flex-col h-full z-20">
          {/* Tab buttons */}
          <div className="flex border-b border-outline-variant p-sm gap-xs bg-surface-container-lowest">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 py-xs font-sans text-xs uppercase font-bold rounded border transition-colors cursor-pointer text-center ${
                activeTab === "properties"
                  ? "text-primary bg-primary-container/10 border-primary/20"
                  : "text-on-surface-variant hover:bg-surface-container-highest border-transparent"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-xs font-sans text-xs uppercase font-bold rounded border transition-colors cursor-pointer text-center ${
                activeTab === "library"
                  ? "text-primary bg-primary-container/10 border-primary/20"
                  : "text-on-surface-variant hover:bg-surface-container-highest border-transparent"
              }`}
            >
              Library
            </button>
          </div>

          {/* Properties tab panel */}
          {activeTab === "properties" && (
            <div className="flex-1 overflow-y-auto p-md space-y-md">
              {selectedNode ? (
                <div>
                  <div className="flex items-center gap-sm mb-md pb-xs border-b border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {selectedNode.type === "trigger" ? "bolt" : selectedNode.type === "agent" ? "support_agent" : "chat"}
                    </span>
                    <h3 className="font-display text-md text-on-surface">{selectedNode.name}</h3>
                  </div>

                  <div className="space-y-sm">
                    {/* Node Name input */}
                    <div>
                      <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                        Node Custom Label
                      </label>
                      <input
                        type="text"
                        value={selectedNode.name}
                        onChange={(e) => {
                          if (!checkPermission("config:write")) {
                            alert("Unauthorized action. Executive or Admin credentials required.");
                            return;
                          }
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, name: e.target.value } : n));
                        }}
                        className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    {/* Specific inputs depending on node type */}
                    {selectedNode.type === "trigger" && (
                      <>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Data Stream Source
                          </label>
                          <select
                            value={selectedNode.data.stream}
                            onChange={(e) => updateNodeData(selectedNode.id, "stream", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="GL_TRANSACTIONS">GL_TRANSACTIONS</option>
                            <option value="STRIPE_EVENTS">STRIPE_EVENTS</option>
                            <option value="MARKETING_PIPELINE">MARKETING_PIPELINE</option>
                            <option value="APIS_LOG_TELEMETRY">APIS_LOG_TELEMETRY</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Anomaly Threshold
                          </label>
                          <input
                            type="text"
                            value={selectedNode.data.threshold}
                            onChange={(e) => updateNodeData(selectedNode.id, "threshold", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      </>
                    )}

                    {selectedNode.type === "agent" && (
                      <>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Model Selection
                          </label>
                          <select
                            value={selectedNode.data.model}
                            onChange={(e) => updateNodeData(selectedNode.id, "model", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="Sanktrix-Fin-v4 (Recommended)">Sanktrix-Fin-v4 (Recommended)</option>
                            <option value="GPT-4o-Enterprise">GPT-4o-Enterprise</option>
                            <option value="Claude-3.5-Sonnet">Claude-3.5-Sonnet</option>
                            <option value="Wolfram-Alpha-LLM">Wolfram-Alpha-LLM</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Task Description
                          </label>
                          <input
                            type="text"
                            value={selectedNode.data.task}
                            onChange={(e) => updateNodeData(selectedNode.id, "task", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            System Prompt Template
                          </label>
                          <textarea
                            value={selectedNode.data.prompt}
                            onChange={(e) => updateNodeData(selectedNode.id, "prompt", e.target.value)}
                            className="w-full h-24 bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                          />
                        </div>
                      </>
                    )}

                    {selectedNode.type === "action" && (
                      <>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Slack Destination Channel
                          </label>
                          <input
                            type="text"
                            value={selectedNode.data.channel}
                            onChange={(e) => updateNodeData(selectedNode.id, "channel", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-[10px] text-on-surface-variant uppercase font-semibold block mb-1">
                            Message Priority
                          </label>
                          <select
                            value={selectedNode.data.priority}
                            onChange={(e) => updateNodeData(selectedNode.id, "priority", e.target.value)}
                            className="w-full bg-surface-dim border border-outline-variant rounded p-sm font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="font-mono text-xs text-on-surface-variant text-center pt-xl">Select a node to inspect properties.</p>
              )}

              {/* Execution logs */}
              <div className="pt-md border-t border-outline-variant/30">
                <div className="flex justify-between items-center mb-sm">
                  <h4 className="font-sans text-[10px] uppercase font-bold text-on-surface-variant">Live Execution Log</h4>
                  <span className="w-2 h-2 rounded-full bg-tertiary pulse-indicator"></span>
                </div>
                <div className="bg-[#050505] border border-outline-variant rounded-lg p-sm h-36 overflow-y-auto font-mono text-[10px] space-y-1 select-all">
                  {terminalLogs.length === 0 ? (
                    <div className="text-outline">Initializing execution...</div>
                  ) : (
                    terminalLogs.map((log, index) => {
                      const typeColor = 
                        log.type === "INFO" ? "text-tertiary" :
                        log.type === "EXEC" ? "text-primary" :
                        log.type === "ACT" ? "text-secondary" :
                        log.type === "SUCCESS" ? "text-tertiary font-bold" : "text-error";

                      return (
                        <div key={index} className="text-on-surface-variant leading-tight">
                          [{log.time}] <span className={typeColor}>{log.type}:</span> {log.text}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Library tab panel */}
          {activeTab === "library" && (
            <div className="flex-1 overflow-y-auto p-md space-y-md">
              <h3 className="font-display text-md text-on-surface mb-xs border-b border-outline-variant/30 pb-xs">Pipeline Node Templates</h3>
              <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed">
                Click any component below to instantiate and drop it into the visual orchestrator canvas.
              </p>

              <div className="space-y-sm pt-sm">
                <button
                  onClick={() => addNodeFromLibrary("trigger", "DB Write Listener")}
                  className="w-full text-left p-sm rounded border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-highest hover:border-tertiary/50 transition-all flex items-center gap-sm cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-tertiary">bolt</span>
                  <div>
                    <span className="font-sans text-xs uppercase font-bold text-on-surface block">Database Write Trigger</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">Triggers workflow on database change.</span>
                  </div>
                </button>

                <button
                  onClick={() => addNodeFromLibrary("agent", "Wolfram Math Agent")}
                  className="w-full text-left p-sm rounded border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-highest hover:border-primary/50 transition-all flex items-center gap-sm cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-primary">functions</span>
                  <div>
                    <span className="font-sans text-xs uppercase font-bold text-on-surface block">Wolfram Engine Agent</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">Solves equation constraints or models outputs.</span>
                  </div>
                </button>

                <button
                  onClick={() => addNodeFromLibrary("agent", "Risk Auditor Agent")}
                  className="w-full text-left p-sm rounded border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-highest hover:border-primary/50 transition-all flex items-center gap-sm cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  <div>
                    <span className="font-sans text-xs uppercase font-bold text-on-surface block">Risk Auditor Agent</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">Evaluates transaction compliance rules.</span>
                  </div>
                </button>

                <button
                  onClick={() => addNodeFromLibrary("action", "Slack Notification")}
                  className="w-full text-left p-sm rounded border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-highest hover:border-secondary/50 transition-all flex items-center gap-sm cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-secondary">chat</span>
                  <div>
                    <span className="font-sans text-xs uppercase font-bold text-on-surface block">Slack Push Notification</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">Sends custom payload to Slack room.</span>
                  </div>
                </button>

                <button
                  onClick={() => addNodeFromLibrary("action", "Webhook Dispatch")}
                  className="w-full text-left p-sm rounded border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-highest hover:border-secondary/50 transition-all flex items-center gap-sm cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-secondary">send</span>
                  <div>
                    <span className="font-sans text-xs uppercase font-bold text-on-surface block">Webhook Dispatcher</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">POST JSON payload to any external API.</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
