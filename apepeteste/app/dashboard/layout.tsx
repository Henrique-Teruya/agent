"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      <aside className="relative z-10 w-72 border-r border-[#5a5a5d] bg-[#3a3a3d]/60 backdrop-blur-xl flex flex-col">
        <div className="p-6 pb-2">
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-[#fee250]/10 text-[#fee250] border border-[#fee250]/20"
                    : "text-[#b8b8bb] hover:text-[#fefefe] hover:bg-[#555558] border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
