"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Activity } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Rotinas", href: "/dashboard", icon: LayoutDashboard },
    { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex font-sans selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            Nexus
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
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

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 shadow-md",
                },
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200">Minha Conta</span>
              <span className="text-xs text-zinc-500">Gerenciar perfil</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
