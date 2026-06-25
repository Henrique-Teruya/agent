"use client";

import { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  FilterX,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";

type ExecutionStatus = "success" | "error" | "running";

type ExecutionLog = {
  time: string;
  message: string;
};

type Execution = {
  id: string;
  routineId: string;
  routineName: string;
  status: ExecutionStatus;
  statusCode: number;
  duration: string;
  durationSeconds: number;
  date: string;
  time: string;
  logs: ExecutionLog[];
};

const ALL_ROUTINES = [
  { id: "estoque", name: "Atualização de Estoque" },
  { id: "relatorios", name: "Geração de Relatórios" },
  { id: "manutencao", name: "Limpeza de Logs" },
];

const MOCK_EXECUTIONS: Execution[] = [
  {
    id: "exec-001",
    routineId: "estoque",
    routineName: "Atualização de Estoque",
    status: "success",
    statusCode: 200,
    duration: "2min 14s",
    durationSeconds: 134,
    date: "25/06/2025",
    time: "14:32",
    logs: [
      { time: "14:32:01", message: "Inicializando rotina..." },
      { time: "14:32:03", message: "Conectando ao ERP..." },
      { time: "14:32:15", message: "Sincronizando 1.247 produtos..." },
      { time: "14:33:40", message: "Atualizando quantidades em estoque..." },
      { time: "14:34:15", message: "Concluído com sucesso. 1.247 produtos atualizados." },
    ],
  },
  {
    id: "exec-002",
    routineId: "relatorios",
    routineName: "Geração de Relatórios",
    status: "error",
    statusCode: 405,
    duration: "0s 42s",
    durationSeconds: 42,
    date: "25/06/2025",
    time: "11:05",
    logs: [
      { time: "11:05:01", message: "Inicializando geração de relatórios..." },
      { time: "11:05:05", message: "Buscando dados de vendas..." },
      { time: "11:05:18", message: "Erro: Endpoint /api/v2/sales retornou 405 Method Not Allowed" },
      { time: "11:05:42", message: "Falha na execução. Verifique a configuração da API." },
    ],
  },
  {
    id: "exec-003",
    routineId: "manutencao",
    routineName: "Limpeza de Logs",
    status: "success",
    statusCode: 200,
    duration: "1min 08s",
    durationSeconds: 68,
    date: "24/06/2025",
    time: "22:17",
    logs: [
      { time: "22:17:01", message: "Escaneando logs temporários..." },
      { time: "22:17:12", message: "Encontrados 342 arquivos com mais de 30 dias" },
      { time: "22:17:45", message: "Excluindo arquivos antigos..." },
      { time: "22:18:09", message: "Liberados 1.4 GB de espaço." },
    ],
  },
  {
    id: "exec-004",
    routineId: "estoque",
    routineName: "Atualização de Estoque",
    status: "success",
    statusCode: 200,
    duration: "3min 01s",
    durationSeconds: 181,
    date: "24/06/2025",
    time: "08:45",
    logs: [
      { time: "08:45:01", message: "Inicializando rotina..." },
      { time: "08:45:04", message: "Conectando ao ERP..." },
      { time: "08:45:22", message: "Sincronizando 1.305 produtos..." },
      { time: "08:47:30", message: "Concluído com sucesso. 1.305 produtos atualizados." },
    ],
  },
  {
    id: "exec-005",
    routineId: "relatorios",
    routineName: "Geração de Relatórios",
    status: "error",
    statusCode: 500,
    duration: "1min 20s",
    durationSeconds: 80,
    date: "23/06/2025",
    time: "16:22",
    logs: [
      { time: "16:22:01", message: "Inicializando geração de relatórios..." },
      { time: "16:22:08", message: "Buscando dados de vendas..." },
      { time: "16:22:35", message: "Erro: Timeout ao conectar com banco de dados" },
      { time: "16:23:20", message: "Falha na execução. Tente novamente mais tarde." },
    ],
  },
  {
    id: "exec-006",
    routineId: "estoque",
    routineName: "Atualização de Estoque",
    status: "error",
    statusCode: 503,
    duration: "0s 15s",
    durationSeconds: 15,
    date: "23/06/2025",
    time: "09:10",
    logs: [
      { time: "09:10:01", message: "Inicializando rotina..." },
      { time: "09:10:05", message: "Erro: ERP indisponível (503 Service Unavailable)" },
      { time: "09:10:15", message: "Falha na execução. Serviço externo fora do ar." },
    ],
  },
  {
    id: "exec-007",
    routineId: "manutencao",
    routineName: "Limpeza de Logs",
    status: "success",
    statusCode: 200,
    duration: "0min 45s",
    durationSeconds: 45,
    date: "22/06/2025",
    time: "03:00",
    logs: [
      { time: "03:00:01", message: "Execução agendada iniciada..." },
      { time: "03:00:10", message: "Encontrados 128 arquivos com mais de 30 dias" },
      { time: "03:00:38", message: "Excluindo arquivos antigos..." },
      { time: "03:00:45", message: "Liberados 520 MB de espaço." },
    ],
  },
  {
    id: "exec-008",
    routineId: "relatorios",
    routineName: "Geração de Relatórios",
    status: "success",
    statusCode: 200,
    duration: "4min 33s",
    durationSeconds: 273,
    date: "21/06/2025",
    time: "10:15",
    logs: [
      { time: "10:15:01", message: "Inicializando geração de relatórios..." },
      { time: "10:15:10", message: "Buscando dados de vendas da semana..." },
      { time: "10:18:20", message: "Compilando faturamento semanal..." },
      { time: "10:19:15", message: "Exportando PDF..." },
      { time: "10:19:33", message: "Relatório gerado com sucesso. 84 vendas processadas." },
    ],
  },
  {
    id: "exec-009",
    routineId: "estoque",
    routineName: "Atualização de Estoque",
    status: "success",
    statusCode: 200,
    duration: "2min 48s",
    durationSeconds: 168,
    date: "20/06/2025",
    time: "14:00",
    logs: [
      { time: "14:00:01", message: "Inicializando rotina..." },
      { time: "14:00:05", message: "Conectando ao ERP..." },
      { time: "14:00:30", message: "Sincronizando 1.290 produtos..." },
      { time: "14:02:48", message: "Concluído com sucesso. 1.290 produtos atualizados." },
    ],
  },
  {
    id: "exec-010",
    routineId: "manutencao",
    routineName: "Limpeza de Logs",
    status: "error",
    statusCode: 403,
    duration: "0s 08s",
    durationSeconds: 8,
    date: "19/06/2025",
    time: "03:00",
    logs: [
      { time: "03:00:01", message: "Execução agendada iniciada..." },
      { time: "03:00:05", message: "Erro: Permissão negada (403) ao acessar diretório de logs" },
      { time: "03:00:08", message: "Falha na execução. Verifique as permissões do sistema." },
    ],
  },
];

function getStatusConfig(status: ExecutionStatus) {
  switch (status) {
    case "success":
      return {
        label: "Sucesso",
        icon: CheckCircle2,
        bg: "bg-[#33d17a]/10",
        border: "border-[#33d17a]/20",
        text: "text-[#33d17a]",
        logBg: "bg-[#33d17a]/5",
      };
    case "error":
      return {
        label: "Erro",
        icon: XCircle,
        bg: "bg-[#ff4d4d]/10",
        border: "border-[#ff4d4d]/20",
        text: "text-[#ff4d4d]",
        logBg: "bg-[#ff4d4d]/5",
      };
    case "running":
      return {
        label: "Em andamento",
        icon: Clock,
        bg: "bg-[#fee250]/10",
        border: "border-[#fee250]/20",
        text: "text-[#fee250]",
        logBg: "bg-[#fee250]/5",
      };
  }
}

function getStatusCodeColor(code: number) {
  if (code >= 200 && code < 300) return "text-[#33d17a]";
  if (code >= 400 && code < 500) return "text-[#fee250]";
  if (code >= 500) return "text-[#ff4d4d]";
  return "text-[#99999c]";
}

export default function RelatoriosPage() {
  const [filterRoutine, setFilterRoutine] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const total = MOCK_EXECUTIONS.length;
  const successes = MOCK_EXECUTIONS.filter((e) => e.status === "success").length;
  const errors = MOCK_EXECUTIONS.filter((e) => e.status === "error").length;

  const hasActiveFilters = filterRoutine !== "all" || filterStatus !== "all";

  const filtered = MOCK_EXECUTIONS.filter((exec) => {
    if (filterRoutine !== "all" && exec.routineId !== filterRoutine) return false;
    if (filterStatus !== "all" && exec.status !== filterStatus) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearFilters = () => {
    setFilterRoutine("all");
    setFilterStatus("all");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-[#fefefe] mb-2">
          Relatórios
        </h1>
        <p className="text-lg text-[#b8b8bb]">
          Histórico de execuções e logs das rotinas.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#fee250]/10 border border-[#fee250]/20 flex items-center justify-center">
            <BarChart3 className="text-[#fee250] w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#fefefe]">{total}</p>
            <p className="text-sm text-[#b8b8bb]">Total de execuções</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#33d17a]/20 bg-[#33d17a]/5 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#33d17a]/10 border border-[#33d17a]/20 flex items-center justify-center">
            <CheckCircle2 className="text-[#33d17a] w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#33d17a]">{successes}</p>
            <p className="text-sm text-[#b8b8bb]">Sucesso</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#ff4d4d]/20 bg-[#ff4d4d]/5 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 flex items-center justify-center">
            <XCircle className="text-[#ff4d4d] w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#ff4d4d]">{errors}</p>
            <p className="text-sm text-[#b8b8bb]">Erros</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#b8b8bb]">
            <FilterX className="w-4 h-4" />
            <span className="font-medium">Filtros</span>
          </div>

          <div className="flex-1" />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterRoutine}
              onChange={(e) => setFilterRoutine(e.target.value)}
              className="bg-[#3a3a3d] border border-[#5a5a5d] rounded-lg px-3 py-2 text-sm text-[#fefefe] focus:outline-none focus:ring-2 focus:ring-[#fee250]/50 appearance-none cursor-pointer"
            >
              <option value="all">Todas as rotinas</option>
              {ALL_ROUTINES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#3a3a3d] border border-[#5a5a5d] rounded-lg px-3 py-2 text-sm text-[#fefefe] focus:outline-none focus:ring-2 focus:ring-[#fee250]/50 appearance-none cursor-pointer"
            >
              <option value="all">Todos os status</option>
              <option value="success">Sucesso</option>
              <option value="error">Erro</option>
              <option value="running">Em andamento</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#b8b8bb] hover:text-[#fefefe] transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#555558]"
              >
                <FilterX className="w-3.5 h-3.5" />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Execution List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-12 text-center">
            <FileText className="w-12 h-12 text-[#99999c] mx-auto mb-4" />
            <p className="text-[#b8b8bb] text-lg font-medium">Nenhuma execução encontrada</p>
            <p className="text-[#99999c] text-sm mt-1">
              {hasActiveFilters
                ? "Tente ajustar os filtros."
                : "As execuções das rotinas aparecerão aqui."}
            </p>
          </div>
        )}

        {filtered.map((exec) => {
          const statusConfig = getStatusConfig(exec.status);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedId === exec.id;

          return (
            <div
              key={exec.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? `${statusConfig.bg} ${statusConfig.border}`
                  : "border-[#5a5a5d] bg-[#4d4d50] hover:bg-[#555558]"
              }`}
            >
              {/* Summary Row */}
              <button
                onClick={() => toggleExpand(exec.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center shrink-0`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[#fefefe] font-semibold text-sm truncate">
                      {exec.routineName}
                    </h3>
                    <span className={`text-xs font-mono font-bold ${getStatusCodeColor(exec.statusCode)}`}>
                      {exec.statusCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#99999c]">
                    <span>{exec.date}</span>
                    <span>{exec.time}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exec.duration}
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </div>

                <div className="text-[#99999c]">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Expanded Logs */}
              {isExpanded && (
                <div className={`mx-5 mb-5 rounded-lg ${statusConfig.logBg} border ${statusConfig.border} overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-[#5a5a5d] flex items-center gap-2">
                    <span className="text-xs font-medium text-[#b8b8bb]">Logs de saída</span>
                    <span className="text-xs text-[#99999c]">•</span>
                    <span className="text-xs text-[#99999c]">{exec.logs.length} entradas</span>
                  </div>
                  <div className="p-4 font-mono text-xs space-y-2">
                    {exec.logs.map((log, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-[#99999c] shrink-0">[{log.time}]</span>
                        <span className="text-[#b8b8bb]">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
