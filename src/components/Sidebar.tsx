"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSecurity } from "@/context/SecurityContext";

interface SidebarProps {
  onOpenPalette: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPalette }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useSecurity();

  const handleLogout = () => {
    logout();
    router.push("/logout");
  };

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
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-white/5 bg-[#10131b] py-6 px-4 z-50">
      <div className="mb-8 flex justify-center">
        <Link href="/dashboard" className="flex items-center group">
          <img
            src="/branding/Sanktrix_logo_transparent.png"
            className="h-9 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
            alt="Sanktrix Logo"
          />
        </Link>
      </div>

      {/* AI Command Palette Quick Trigger */}
      <button
        onClick={onOpenPalette}
        className="w-full bg-primary hover:bg-[#c2d6ff] text-[#001945] text-[11px] font-bold py-2.5 px-4 rounded-lg mb-8 transition-all duration-300 shadow-[0_0_15px_rgba(176,198,255,0.2)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">terminal</span>
        AI Command Palette
      </button>

      {/* Sidebar Navigation Items */}
      <div className="flex-grow overflow-y-auto space-y-1 pr-1">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/5 ${
                isActive
                  ? "text-primary font-bold bg-primary/5 border-r-2 border-primary"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-sans tracking-wider uppercase font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* System Status and User Role Indicator */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
        <Link
          href="/status"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/5 ${
            pathname === "/status"
              ? "text-primary font-bold bg-primary/5 border-r-2 border-primary"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          <span className="font-sans tracking-wider uppercase font-semibold">
            System Status
          </span>
        </Link>
        <div className="flex items-center justify-between px-3 py-2 bg-[#050505]/40 border border-white/5 rounded-lg text-[9px] text-on-surface-variant font-mono">
          <span>ROLE: <span className="text-tertiary font-bold">{currentUser.role.toUpperCase()}</span></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[#ffb4ab] hover:text-white hover:bg-red-950/20 transition-all cursor-pointer border border-transparent hover:border-red-900/30"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-sans tracking-wider uppercase font-semibold text-left">
            Sign Out
          </span>
        </button>
      </div>
    </nav>
  );
};
export default Sidebar;
