import { describe, it, expect } from "vitest";

// Ported checkPermission logic from SecurityContext.tsx for unit testing validation
function checkRolePermission(role: string, action: string): boolean {
  if (action.startsWith("read:") || action.startsWith("navigation:")) {
    return true;
  }

  if (role === "Admin") return true;

  if (role === "Executive") {
    return !action.startsWith("admin:") && !action.startsWith("config:write");
  }

  if (role === "Analyst") {
    return (
      action.startsWith("simulation:run") ||
      action.startsWith("model:run") ||
      action.startsWith("file:upload") ||
      action.startsWith("notes:edit")
    );
  }

  if (role === "Viewer") {
    return false;
  }

  return false;
}

describe("Sanktrix Role-Based Access Control (RBAC) Gating Policy", () => {
  describe("Admin Role", () => {
    it("should allow any action", () => {
      expect(checkRolePermission("Admin", "admin:api_keys")).toBe(true);
      expect(checkRolePermission("Admin", "config:write")).toBe(true);
      expect(checkRolePermission("Admin", "simulation:run")).toBe(true);
      expect(checkRolePermission("Admin", "boardroom:export")).toBe(true);
    });
  });

  describe("Executive Role", () => {
    it("should allow simulation running and exports", () => {
      expect(checkRolePermission("Executive", "simulation:run")).toBe(true);
      expect(checkRolePermission("Executive", "boardroom:export")).toBe(true);
    });

    it("should deny system administration and config modifications", () => {
      expect(checkRolePermission("Executive", "admin:api_keys")).toBe(false);
      expect(checkRolePermission("Executive", "config:write")).toBe(false);
    });
  });

  describe("Analyst Role", () => {
    it("should allow simulations, model executions, notes edits, and file uploads", () => {
      expect(checkRolePermission("Analyst", "simulation:run")).toBe(true);
      expect(checkRolePermission("Analyst", "model:run")).toBe(true);
      expect(checkRolePermission("Analyst", "file:upload")).toBe(true);
      expect(checkRolePermission("Analyst", "notes:edit")).toBe(true);
    });

    it("should deny boardroom exports, admin keys, and direct config writing", () => {
      expect(checkRolePermission("Analyst", "boardroom:export")).toBe(false);
      expect(checkRolePermission("Analyst", "admin:api_keys")).toBe(false);
      expect(checkRolePermission("Analyst", "config:write")).toBe(false);
    });
  });

  describe("Viewer Role", () => {
    it("should allow reading and navigation", () => {
      expect(checkRolePermission("Viewer", "read:dashboard")).toBe(true);
      expect(checkRolePermission("Viewer", "navigation:twin")).toBe(true);
    });

    it("should deny all write and trigger operations", () => {
      expect(checkRolePermission("Viewer", "simulation:run")).toBe(false);
      expect(checkRolePermission("Viewer", "file:upload")).toBe(false);
      expect(checkRolePermission("Viewer", "config:write")).toBe(false);
      expect(checkRolePermission("Viewer", "admin:api_keys")).toBe(false);
    });
  });
});
