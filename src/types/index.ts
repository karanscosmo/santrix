// TypeScript definitions for Sanktrix OS

export type UserRole = "Admin" | "Executive" | "Analyst" | "Viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO String
  userId: string;
  userEmail: string;
  role: UserRole;
  action: string; // e.g. "simulation.run", "report.generate", "api_key.create"
  details: string;
  status: "SUCCESS" | "FAILED";
  ipAddress: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  targetPath: string; // Target dashboard page path
  parameters: { [key: string]: number | string | boolean };
}

export interface WolframEngineStatus {
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  activeKernels: number;
  memoryUsageMb: number;
  lastSync: string;
}
