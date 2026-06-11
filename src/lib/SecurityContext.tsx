"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuditLogEntry } from "@/types";
import DOMPurify from "dompurify";

interface SecurityContextProps {
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, org: string, password?: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, details: string, status?: "SUCCESS" | "FAILED") => void;
  checkPermission: (action: string) => boolean;
  rateLimitCheck: () => boolean;
  sanitizeInput: (input: string) => string;
}

const defaultUser: User = {
  id: "usr_1001",
  name: "Karan A Sharma",
  email: "karan.sharma@sanktrix.ai",
  role: "Admin", // default to Admin for easy testing
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhpbsFfTYDxF8SyOrnGEDdfvnYrcbkB7E32VU0EcQ0h4d3ja8RHD-pknFJJ0UkJgdccJIN2nOCwAB5gKdWqxpFFA4CDZZRGexiJ8UycSQ_r6s0207_o3XnN5t7-cDDQA_vkNm1ZEKXc51l94QCX18E-zQQuIIiZOKDlB5HZXPE44C0VAQZvO1jdc7L9kyUfQfLrH-GFfA9U8tFL0bRmZRNA0cYXGKF8Me60NECzaTsk4Jxik8lFVUwHcmrDi-XLkB_dzkBsDLzeVv_"
};

const SecurityContext = createContext<SecurityContextProps | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("sanktrix_user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {}
      }
    }
    return defaultUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("sanktrix_auth");
      return storedAuth !== "false";
    }
    return true;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => [
    {
      id: "evt_001",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: defaultUser.id,
      userEmail: defaultUser.email,
      role: "Admin",
      action: "system.login",
      details: "User successfully authenticated into Sanktrix OS Command Center",
      status: "SUCCESS",
      ipAddress: "192.168.1.45"
    },
    {
      id: "evt_002",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      userId: defaultUser.id,
      userEmail: defaultUser.email,
      role: "Admin",
      action: "wolfram.kernel_sync",
      details: "Synced 12 active computational kernels from Wolfram Cloud endpoint",
      status: "SUCCESS",
      ipAddress: "127.0.0.1"
    }
  ]);
  const [rateLimitCounter, setRateLimitCounter] = useState(0);

  // Reset rate limit count every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setRateLimitCounter(0);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const login = async (email: string, password?: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const name = email.split("@")[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const loggedInUser: User = {
      id: `usr_${Math.floor(Math.random() * 9000 + 1000)}`,
      name: email === defaultUser.email ? defaultUser.name : `${formattedName} (Executive)`,
      email: email,
      role: email === defaultUser.email ? "Admin" : "Executive",
      avatarUrl: defaultUser.avatarUrl
    };
    
    setCurrentUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem("sanktrix_auth", "true");
    localStorage.setItem("sanktrix_user", JSON.stringify(loggedInUser));
    
    const newEntry: AuditLogEntry = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: loggedInUser.id,
      userEmail: loggedInUser.email,
      role: loggedInUser.role,
      action: "system.login",
      details: `User successfully authenticated into Sanktrix OS Command Center (${loggedInUser.role})`,
      status: "SUCCESS",
      ipAddress: "192.168.1.100"
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    return true;
  };

  const signup = async (name: string, email: string, org: string, password?: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: `usr_${Math.floor(Math.random() * 9000 + 1000)}`,
      name: name,
      email: email,
      role: "Executive",
      avatarUrl: defaultUser.avatarUrl
    };
    
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("sanktrix_auth", "true");
    localStorage.setItem("sanktrix_user", JSON.stringify(newUser));
    
    const newEntry: AuditLogEntry = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: newUser.id,
      userEmail: newUser.email,
      role: newUser.role,
      action: "system.signup",
      details: `New user registered and authenticated: ${name} (${org})`,
      status: "SUCCESS",
      ipAddress: "192.168.1.100"
    };
    setAuditLogs(prev => [newEntry, ...prev]);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("sanktrix_auth", "false");
    localStorage.removeItem("sanktrix_user");
    
    const newEntry: AuditLogEntry = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      role: currentUser.role,
      action: "system.logout",
      details: "User successfully signed out from Sanktrix OS",
      status: "SUCCESS",
      ipAddress: "192.168.1.100"
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const setRole = (role: UserRole) => {
    setCurrentUser(prev => {
      const updated = { ...prev, role };
      addAuditLog("role.change", `Changed role to ${role}`, "SUCCESS");
      return updated;
    });
  };

  const addAuditLog = (action: string, details: string, status: "SUCCESS" | "FAILED" = "SUCCESS") => {
    const newEntry: AuditLogEntry = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      role: currentUser.role,
      action,
      details,
      status,
      ipAddress: "192.168.1.100"
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const checkPermission = (action: string): boolean => {
    const role = currentUser.role;

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
  };

  const rateLimitCheck = (): boolean => {
    const maxReq = parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_MAX_REQUESTS || "10", 10);
    if (rateLimitCounter >= maxReq) {
      addAuditLog("system.rate_limit_violation", `Rate limit hit: ${rateLimitCounter} requests/min`, "FAILED");
      return false;
    }
    setRateLimitCounter(prev => prev + 1);
    return true;
  };

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input);
  };

  return (
    <SecurityContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        setRole,
        auditLogs,
        addAuditLog,
        checkPermission,
        rateLimitCheck,
        sanitizeInput
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
};
