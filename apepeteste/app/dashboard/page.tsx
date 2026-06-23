import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Esta é uma rota protegida. Apenas usuários logados podem ver isso!
        </p>
        
        <div className="mb-8">
          <UserButton afterSignOutUrl="/" />
        </div>

        <Link
          href="/"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Voltar para a Home
        </Link>
      </main>
    </div>
  );
}
