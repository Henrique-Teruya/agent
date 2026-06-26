import Link from "next/link";
import { Play, Package } from "lucide-react";

type Routine = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
};

const ALL_ROUTINES: Routine[] = [
  {
    id: "estoque",
    name: "Atualização de Estoque",
    description: "Sincroniza os produtos e quantidades com o ERP em tempo real.",
    icon: Package,
  },
];

export default function DashboardPage() {
  const routines = ALL_ROUTINES;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-[#fefefe] mb-2">
          Rotinas
        </h1>
        <p className="text-lg text-[#b8b8bb]">
          Execute seus scripts e automatizações de forma centralizada.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="relative overflow-hidden rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-6 transition-all duration-300 hover:bg-[#555558] hover:-translate-y-1 hover:border-[#fee250]/30"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#fee250] to-[#e6cc30] flex items-center justify-center mb-6">
              <routine.icon className="w-6 h-6 text-[#1a1a1a]" />
            </div>

            <h3 className="text-xl font-semibold text-[#fefefe] mb-2">{routine.name}</h3>
            <p className="text-[#b8b8bb] text-sm leading-relaxed mb-8">
              {routine.description}
            </p>

            <Link
              href={`/dashboard/rotina/${routine.id}`}
              className="block w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium bg-[#fee250] text-[#1a1a1a] transition-all hover:bg-[#e6cc30] hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Executar Rotina
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
