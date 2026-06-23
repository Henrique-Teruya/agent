"use client";

import { useState } from "react";
import { KeyRound, CheckCircle2, ShieldAlert } from "lucide-react";
import { saveApiToken } from "@/app/actions/user";

export default function ConfigPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setStatus("loading");
    
    const result = await saveApiToken(token);
    
    if (result.success) {
      setStatus("success");
      setToken(""); // clear after saving
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Configurações
        </h1>
        <p className="text-lg text-zinc-400">
          Gerencie chaves de acesso e integrações.
        </p>
      </header>

      <div className="max-w-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <KeyRound className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Token da API Externa (JWT)</h2>
            <p className="text-sm text-zinc-400">Insira seu JWT para que o sistema possa realizar chamadas autenticadas em seu nome nas rotinas.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="token" className="block text-sm font-medium text-zinc-300">
              Chave de Acesso (JWT)
            </label>
            <div className="relative">
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
              />
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Esta chave será guardada de forma encriptada no backend do Clerk (privateMetadata).
            </p>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "loading" || !token.trim()}
              className="bg-white text-black font-semibold px-6 py-2.5 rounded-xl transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {status === "loading" ? "Salvando..." : "Salvar Token"}
            </button>
            
            {status === "success" && (
              <span className="text-emerald-400 text-sm font-medium flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
              </span>
            )}
            {status === "error" && (
              <span className="text-red-400 text-sm font-medium animate-in fade-in zoom-in duration-300">
                Erro ao salvar. Tente novamente.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
