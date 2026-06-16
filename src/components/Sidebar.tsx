"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSecurity } from "@/lib/SecurityContext";

interface SidebarProps {
  onOpenPalette: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPalette }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useSecurity();

  // Collapsible groups state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    decisions: false,
    intelligence: false,
    monitoring: false,
  });

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLogout = () => {
    logout();
    router.push("/logout");
  };

  const groups: NavGroup[] = [
    {
      id: "decisions",
      title: "Decision Center",
      items: [
        { name: "Command Center", href: "/dashboard", icon: "space_dashboard" },
        { name: "Decision Copilot", href: "/copilot", icon: "psychology" },
        { name: "Scenario Lab", href: "/simulations", icon: "science" },
      ],
    },
    {
      id: "intelligence",
      title: "Enterprise Intelligence",
      items: [
        { name: "Impact Map", href: "/twin", icon: "account_tree" },
        { name: "Intelligence Graph", href: "/graph", icon: "hub" },
        { name: "AI Workforce", href: "/agents", icon: "smart_toy" },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring",
      items: [
        { name: "Business Events", href: "/fabric", icon: "electric_bolt" },
        { name: "Executive Feed", href: "/feed", icon: "newspaper" },
        { name: "Reports", href: "/reports", icon: "assessment" },
        { name: "Settings", href: "/settings", icon: "settings" },
      ],
    },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-white/[0.03] bg-[#07080c] py-5 px-4 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.8)]">
      {/* Brand Wordmark Logo */}
      <div className="mb-6 flex justify-center mt-2">
        <Link href="/dashboard" className="flex items-center group">
          <img
            src="/branding/Sanktrix_logo_transparent.png"
            className="h-10 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
            alt="Sanktrix Logo"
          />
        </Link>
      </div>

      {/* AI Command Quick Trigger */}
      <button
        onClick={onOpenPalette}
        className="w-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#001945] text-[10px] font-mono font-bold py-2.5 px-4 rounded-[10px] mb-6 transition-all duration-200 shadow-[0_0_15px_rgba(138,180,248,0.12)] hover:scale-[1.01] cursor-pointer flex items-center justify-between group"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          Ask Decision AI
        </span>
        <span className="text-[9px] bg-[#001945]/10 px-1.5 py-0.5 rounded border border-[#001945]/20 font-mono opacity-80">
          ⌘K
        </span>
      </button>

      {/* Navigation Groups */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {groups.map(group => {
          const isCollapsed = collapsedGroups[group.id];
          return (
            <div key={group.id} className="space-y-1">
              {/* Group Header Button */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors font-bold select-none cursor-pointer"
              >
                <span>{group.title}</span>
                <span className="material-symbols-outlined text-[12px] transition-transform duration-200">
                  {isCollapsed ? "expand_more" : "expand_less"}
                </span>
              </button>

              {/* Group Nav Items */}
              {!isCollapsed && (
                <div className="space-y-0.5 transition-all duration-300">
                  {group.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group/item flex items-center gap-3 px-3 py-1.5 rounded-[10px] text-xs transition-all relative ${
                          isActive
                            ? "text-[#8ab4f8] font-bold bg-[#8ab4f8]/5 border-r border-[#8ab4f8]"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* Slide Indicator Bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#8ab4f8] rounded-r"></span>
                        )}

                        <span
                          className="material-symbols-outlined text-[16px] text-gray-400 group-hover/item:text-[#8ab4f8] transition-colors"
                          style={isActive ? { fontVariationSettings: "'FILL' 1", color: "#8ab4f8" } : {}}
                        >
                          {item.icon}
                        </span>
                        <span className="font-sans font-medium tracking-wide">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status & Log out */}
      <div className="mt-auto pt-4 border-t border-white/[0.03] space-y-2">
        <Link
          href="/status"
          className={`flex items-center gap-3 px-3 py-1.5 rounded-[10px] text-xs transition-all ${
            pathname === "/status"
              ? "text-[#8ab4f8] font-bold bg-[#8ab4f8]/5 border-r border-[#8ab4f8]"
              : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-gray-400">monitoring</span>
          <span className="font-sans font-medium tracking-wide">Platform Health</span>
        </Link>
        <div className="flex items-center justify-between px-3 py-2 bg-[#050505]/60 border border-white/[0.03] rounded-[10px] text-[9px] text-gray-400 font-mono">
          <span>ROLE: <span className="text-amber-400 font-bold">{currentUser?.role?.toUpperCase() || "VISITOR"}</span></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-[10px] text-xs text-red-400 hover:text-red-300 hover:bg-red-950/10 transition-all cursor-pointer border border-transparent hover:border-red-900/10"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="font-sans font-medium tracking-wide text-left">
            Sign Out
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
