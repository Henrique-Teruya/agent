"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveApiToken(token: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  try {
    // Fetch the Clerk client and update the user's private metadata
    const client = await clerkClient();
    
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        externalApiToken: token,
      },
    });

    // Revalidate the dashboard page to reflect any changes if needed
    revalidatePath("/dashboard/configuracoes");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar token no Clerk:", error);
    return { success: false, error: "Falha ao salvar o token" };
  }
}
