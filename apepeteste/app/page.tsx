import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#434346] font-sans min-h-screen">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 text-center">
        <Show when="signed-in">
          <h1 className="text-4xl font-bold text-[#fefefe] mb-6">
            Olá! Bem-vindo(a) de volta.
          </h1>
          <p className="text-lg text-[#b8b8bb] mb-8">
            Você já está logado na sua conta.
          </p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#fee250] text-[#1a1a1a] px-6 py-3 font-semibold transition-all hover:bg-[#e6cc30] hover:scale-[1.02] active:scale-95"
          >
            Ir para o Dashboard
          </Link>
        </Show>

        <Show when="signed-out">
          <h1 className="text-4xl font-bold text-[#fefefe] mb-6">
            Acesse sua conta
          </h1>
          <p className="text-lg text-[#b8b8bb] mb-8">
            Faça login para continuar e acessar o dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-[#fee250] text-[#1a1a1a] px-8 py-3 font-semibold transition-all hover:bg-[#e6cc30] hover:scale-[1.02] active:scale-95">
              Entrar
            </button>
          </SignInButton>
        </Show>
      </main>
    </div>
  );
}
