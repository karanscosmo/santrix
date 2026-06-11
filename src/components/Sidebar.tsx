"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";

interface SidebarProps {
  onOpenPalette: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPalette }) => {
  const pathname = usePathname();
  const { currentUser } = useSecurity();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "dashboard" },
    { name: "Executive Copilot", href: "/copilot", icon: "smart_toy" },
    { name: "Wolfram Center", href: "/wolfram", icon: "functions" },
    { name: "Strategy Center", href: "/strategy", icon: "verified" },
    { name: "Digital Twin", href: "/twin", icon: "donut_large" },
    { name: "Knowledge Graph", href: "/graph", icon: "hub" },
    { name: "Agent Observatory", href: "/observatory", icon: "visibility" },
    { name: "Event Fabric", href: "/fabric", icon: "stream" },
    { name: "Boardroom", href: "/boardroom", icon: "summarize" },
    { name: "Simulations", href: "/simulations", icon: "model_training" },
    { name: "Agents", href: "/agents", icon: "support_agent" },
    { name: "Intelligence Feed", href: "/feed", icon: "dynamic_feed" },
    { name: "Knowledge Hub", href: "/knowledge", icon: "menu_book" },
    { name: "Workflows", href: "/workflows", icon: "account_tree" },
    { name: "Reports", href: "/reports", icon: "assessment" },
    { name: "Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface-container-low py-lg px-md z-50">
      {/* Brand logo section */}
      <div className="mb-xl">
        <Link href="/dashboard" className="flex items-center gap-sm">
          <img
            src="/Santrix_logo.jpeg"
            className="w-10 h-10 rounded object-cover border border-primary/30"
            alt="Sanktrix Logo"
          />
          <div>
            <h1 className="font-display text-[20px] font-bold text-primary tracking-tighter uppercase leading-none">
              SANKTRIX
            </h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
              Computational OS
            </p>
          </div>
        </Link>
      </div>

      {/* AI Command Palette Quick Trigger */}
      <button
        onClick={onOpenPalette}
        className="w-full bg-primary text-on-primary text-[12px] font-semibold py-sm px-md rounded mb-xl hover:bg-primary-container transition-colors shadow-[0_0_15px_rgba(176,198,255,0.3)] cursor-pointer"
      >
        AI Command Palette
      </button>

      {/* Sidebar Navigation Items */}
      <div className="flex-grow overflow-y-auto space-y-xs">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-md px-sm py-sm rounded text-sm transition-all hover:bg-surface-container-highest ${
                isActive
                  ? "text-primary font-bold bg-primary-container/10 border-r-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-sans tracking-wide text-xs uppercase font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* System Status and User Role Indicator */}
      <div className="mt-auto pt-md border-t border-outline-variant space-y-sm">
        <Link
          href="/status"
          className={`flex items-center gap-md px-sm py-sm rounded text-sm transition-all hover:bg-surface-container-highest ${
            pathname === "/status"
              ? "text-primary font-bold bg-primary-container/10 border-r-2 border-primary"
              : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">analytics</span>
          <span className="font-sans tracking-wide text-xs uppercase font-semibold">
            System Status
          </span>
        </Link>
        <div className="flex items-center justify-between px-sm py-1 bg-surface-container-lowest/50 border border-outline-variant/30 rounded text-[10px] text-on-surface-variant">
          <span>ROLE: <span className="font-mono text-tertiary font-bold">{currentUser.role.toUpperCase()}</span></span>
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
        </div>
      </div>
    </nav>
  );
};
export default Sidebar;
