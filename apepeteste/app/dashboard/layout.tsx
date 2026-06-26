"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, BarChart3, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Rotinas", href: "/dashboard", icon: LayoutDashboard },
    { name: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#434346] text-[#fefefe] flex font-sans selection:bg-[#fee250]/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fee250]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#fee250]/5 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className={`relative z-10 border border-[#5a5a5d] bg-[#3a3a3d]/60 backdrop-blur-xl flex flex-col transition-all duration-300 rounded-xl m-3 ${collapsed ? "w-[73px]" : "w-[305px]"}`}>
        {/* Collapse Toggle */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-11 h-11 rounded-lg text-[#b8b8bb] hover:text-[#fefefe] hover:bg-[#555558] border border-transparent transition-all duration-300"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg transition-all duration-300 ${
                  collapsed ? "px-3 py-3" : "px-4 py-3"
                } ${
                  isActive
                    ? "bg-[#fee250]/10 text-[#fee250] border border-[#fee250]/20"
                    : "text-[#b8b8bb] hover:text-[#fefefe] hover:bg-[#555558] border border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`p-3 border-t border-[#5a5a5d] ${collapsed ? "flex justify-center" : ""}`}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col mr-3">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
