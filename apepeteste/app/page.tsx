import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 text-center">
        <Show when="signed-in">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
            Olá! Bem-vindo(a) de volta.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Você já está logado na sua conta.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-semibold transition-transform hover:scale-105"
          >
            Ir para o Dashboard
          </Link>
        </Show>

        <Show when="signed-out">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
            Acesse sua conta
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Faça login para continuar e acessar o dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-full bg-blue-600 text-white px-8 py-3 font-semibold transition-colors hover:bg-blue-700">
              Entrar
            </button>
          </SignInButton>
        </Show>
      </main>
    </div>
  );
}
