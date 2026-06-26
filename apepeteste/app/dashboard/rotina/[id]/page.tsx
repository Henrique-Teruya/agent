"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Package,
  CheckCircle2,
  Clock,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { executeStockUpdate } from "@/app/actions/routines";

type RoutineConfig = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  marketOptions: { value: string; label: string }[];
};

const MARKETS = [
  { value: "eo0JNk1PPdHqDOxmhAMn", label: "Chronos" },
  { value: "QVn3J6bMOnhXu5BRgOys", label: "Emiie" },
  { value: "kMG44K5GvHRCM9NfBwYl", label: "Higienopolis" },
  { value: "jt9QfZzxfUp6UIjSvFBb", label: "Latitude Studio" },
  { value: "oPypMCGm9ScUYWPWUAmt", label: "Moou" },
  { value: "neAKJ8bsIlWYCW75h49H", label: "Nomad" },
];

const ROUTINES: RoutineConfig[] = [
  {
    id: "estoque",
    name: "Atualização de Estoque",
    description: "Sincroniza os produtos e quantidades com o ERP em tempo real.",
    icon: Package,
    marketOptions: MARKETS,
  },
];

type ExecutionStatus = "idle" | "running" | "success" | "error";

type LogEntry = {
  time: string;
  message: string;
};

export default function RotinaPage() {
  const params = useParams();
  const [status, setStatus] = useState<ExecutionStatus>("idle");
  const [marketId, setMarketId] = useState("eo0JNk1PPdHqDOxmhAMn");
  const [csvText, setCsvText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState("");

  const routineId = params.id as string;
  const routine = ROUTINES.find((r) => r.id === routineId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setCsvText(text);
        const lines = text.trim().split("\n");
        setProductCount(Math.max(0, lines.length - 1));
      }
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setCsvText("");
    setCsvFileName("");
    setProductCount(0);
  };

  const handleExecute = async () => {
    if (!csvText.trim()) return;

    setStatus("running");
    setLogs([]);
    setError("");
    setResultData(null);

    try {
      const result = await executeStockUpdate(marketId, csvText);
      setLogs(result.logs);

      if (result.success) {
        setStatus("success");
        setResultData(result.data);
      } else {
        setStatus("error");
        setError(result.error || "Erro desconhecido");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Erro inesperado");
      setLogs([
        {
          time: new Date().toTimeString().split(" ")[0],
          message: err.message || "Erro inesperado",
        },
      ]);
    }
  };

  if (!routine) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#b8b8bb] hover:text-[#fefefe] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Rotinas
        </Link>
        <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-12 text-center">
          <p className="text-[#b8b8bb] text-lg font-medium">
            Rotina não encontrada
          </p>
        </div>
      </div>
    );
  }

  const Icon = routine.icon;
  const isReady = csvText.trim();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[#b8b8bb] hover:text-[#fefefe] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Rotinas
      </Link>

      {/* Routine Header */}
      <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] p-6 flex items-start gap-5">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#fee250] to-[#e6cc30] flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 text-[#1a1a1a]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#fefefe] mb-1">
            {routine.name}
          </h1>
          <p className="text-[#b8b8bb]">{routine.description}</p>
        </div>
      </div>

      {/* Parameters Form */}
      <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#5a5a5d]">
          <h2 className="text-lg font-semibold text-[#fefefe]">Parâmetros</h2>
          <p className="text-sm text-[#99999c] mt-0.5">
            Configure os parâmetros antes de executar.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Market Select */}
          <div>
            <label className="block text-sm font-medium text-[#fefefe] mb-2">
              Mercado <span className="text-[#ff4d4d]">*</span>
            </label>
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full bg-[#3a3a3d] border border-[#5a5a5d] rounded-lg px-4 py-3 text-[#fefefe] focus:outline-none focus:ring-2 focus:ring-[#fee250]/50 appearance-none cursor-pointer"
            >
              {routine.marketOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* CSV Upload */}
          <div>
            <label className="block text-sm font-medium text-[#fefefe] mb-2">
              Arquivo CSV <span className="text-[#ff4d4d]">*</span>
            </label>
            <div className="relative">
              {!csvFileName ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#5a5a5d] rounded-lg bg-[#3a3a3d]/50 hover:bg-[#3a3a3d] hover:border-[#fee250]/30 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-[#99999c] mb-2" />
                  <span className="text-sm text-[#b8b8bb]">
                    Clique ou arraste o arquivo CSV
                  </span>
                  <span className="text-xs text-[#99999c] mt-1">
                    Apenas arquivos .csv
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between w-full bg-[#3a3a3d] border border-[#5a5a5d] rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UploadCloud className="w-5 h-5 text-[#fee250]" />
                    <div>
                      <span className="text-sm text-[#fefefe] font-medium">
                        {csvFileName}
                      </span>
                      <span className="block text-xs text-[#99999c]">
                        {productCount} produtos carregados
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-[#99999c] hover:text-[#ff4d4d] transition-colors p-1"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="px-6 py-4 border-t border-[#5a5a5d] flex items-center gap-4">
          <button
            onClick={handleExecute}
            disabled={status === "running" || !isReady}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-[#fee250] text-[#1a1a1a] transition-all hover:bg-[#e6cc30] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {status === "running" ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="currentColor" />
                Executar Rotina
              </>
            )}
          </button>

          {status === "success" && (
            <span className="text-[#33d17a] text-sm font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Rotina executada com sucesso!
            </span>
          )}
          {status === "error" && (
            <span className="text-[#ff4d4d] text-sm font-medium flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              {error}
            </span>
          )}
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="rounded-xl border border-[#5a5a5d] bg-[#4d4d50] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#5a5a5d] flex items-center gap-2">
            <span className="text-sm font-medium text-[#fefefe]">
              Logs de Execução
            </span>
            <span className="text-xs text-[#99999c]">•</span>
            <span className="text-xs text-[#99999c]">{logs.length} entradas</span>
          </div>
          <div className="p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {logs.map((logEntry, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[#99999c] shrink-0">
                  [{logEntry.time}]
                </span>
                <span className="text-[#b8b8bb]">{logEntry.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
