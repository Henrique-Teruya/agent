import { currentUser } from "@clerk/nextjs/server";
import { Play, Lock, Package, FileText, Settings, ShieldAlert } from "lucide-react";

type Routine = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

const ALL_ROUTINES: Routine[] = [
  {
    id: "estoque",
    name: "Atualização de Estoque",
    description: "Sincroniza os produtos e quantidades com o ERP em tempo real.",
    icon: Package,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "relatorios",
    name: "Geração de Relatórios",
    description: "Compila dados de vendas e exporta faturamento semanal.",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "manutencao",
    name: "Limpeza de Logs",
    description: "Exclui logs temporários antigos para liberar espaço.",
    icon: Settings,
    color: "from-emerald-500 to-teal-400",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();

  // Read feature flags from user metadata
  // We expect an array of strings like: { allowed_routines: ["estoque", "relatorios"] }
  const metadata = user?.publicMetadata as { allowed_routines?: string[] } | null;
  const allowedRoutines = metadata?.allowed_routines || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Rotinas Disponíveis
        </h1>
        <p className="text-lg text-zinc-400">
          Execute seus scripts e automatizações de forma centralizada.
        </p>
      </header>

      {allowedRoutines.length === 0 && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6 flex gap-4 items-start">
          <ShieldAlert className="text-yellow-500 w-6 h-6 shrink-0 mt-1" />
          <div>
            <h3 className="text-yellow-500 font-semibold text-lg">Nenhuma rotina liberada</h3>
            <p className="text-yellow-200/70 mt-1">
              Sua conta ainda não possui permissão para executar nenhuma rotina.
              Vá ao painel do Clerk e adicione <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-100">&#123;"allowed_routines": ["estoque"]&#125;</code> no Public Metadata do seu usuário.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ROUTINES.map((routine) => {
          const isAllowed = allowedRoutines.includes(routine.id);

          return (
            <div
              key={routine.id}
              className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                isAllowed
                  ? "bg-white/5 border-white/10 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/5"
                  : "bg-white/5 border-white/5 opacity-50 grayscale"
              }`}
            >
              {!isAllowed && (
                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10">
                  <Lock className="w-4 h-4 text-zinc-400" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${routine.color} flex items-center justify-center mb-6 shadow-lg`}>
                <routine.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{routine.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                {routine.description}
              </p>

              <button
                disabled={!isAllowed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  isAllowed
                    ? "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-95"
                    : "bg-white/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {isAllowed ? (
                  <>
                    <Play className="w-4 h-4" fill="currentColor" />
                    Executar Rotina
                  </>
                ) : (
                  "Acesso Restrito"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
