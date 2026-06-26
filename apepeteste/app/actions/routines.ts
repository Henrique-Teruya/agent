"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

type RoutineLog = {
  time: string;
  message: string;
};

type RoutineResult = {
  success: boolean;
  statusCode?: number;
  logs: RoutineLog[];
  data?: any;
  error?: string;
};

function log(timestamp: string, message: string): RoutineLog {
  return { time: timestamp, message };
}

function getTimestamp(): string {
  const now = new Date();
  return now.toTimeString().split(" ")[0];
}

function parseCsv(text: string): any[] {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const result: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    if (currentLine.length < headers.length) continue;

    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value: any = currentLine[j]?.trim() || "";

      if (header === "ean") {
        value = String(value);
      } else if (header === "price") {
        value = parseFloat(value);
        if (isNaN(value)) value = 0;
      } else if (header === "quantity") {
        const intVal = parseInt(value, 10);
        value = isNaN(intVal) ? value : intVal;
      }

      obj[header] = value;
    }
    result.push(obj);
  }

  return result;
}

export async function executeStockUpdate(
  marketId: string,
  csvText: string
): Promise<RoutineResult> {
  const logs: RoutineLog[] = [];
  const baseUrl = "https://api.apepe.com/v1";

  // Get current user
  const { userId } = await auth();
  if (!userId) {
    logs.push(log(getTimestamp(), "Erro: Usuário não autenticado."));
    return { success: false, logs, error: "Usuário não autenticado" };
  }

  // Get credentials from Clerk private metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.privateMetadata as
    | { apepe_client_id?: string; apepe_client_secret?: string }
    | null;

  const clientId = metadata?.apepe_client_id;
  const clientSecret = metadata?.apepe_client_secret;

  if (!clientId || !clientSecret) {
    logs.push(
      log(
        getTimestamp(),
        "Erro: Credenciais da API não configuradas. Contate o administrador."
      )
    );
    return {
      success: false,
      logs,
      error: "Credenciais da API não configuradas",
    };
  }

  // Parse CSV to JSON
  logs.push(log(getTimestamp(), "Convertendo CSV para JSON..."));
  const products = parseCsv(csvText);
  logs.push(
    log(getTimestamp(), `${products.length} produtos carregados do CSV.`)
  );

  if (products.length === 0) {
    logs.push(log(getTimestamp(), "Erro: CSV vazio ou inválido."));
    return { success: false, logs, error: "CSV vazio ou inválido" };
  }

  // Step 1: Auth — get bearer token
  let bearerToken: string | null = null;
  logs.push(log(getTimestamp(), "Autenticando na API do Apepê..."));
  try {
    const authRes = await fetch(`${baseUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      logs.push(
        log(
          getTimestamp(),
          `Erro na autenticação: ${authRes.status} ${JSON.stringify(authData)}`
        )
      );
      return {
        success: false,
        statusCode: authRes.status,
        logs,
        error: authData?.message || `Erro ${authRes.status} na autenticação`,
      };
    }

    bearerToken = authData.access_token;
    if (!bearerToken) {
      logs.push(
        log(
          getTimestamp(),
          "Erro: Token não encontrado na resposta da API."
        )
      );
      return {
        success: false,
        logs,
        error: "Token não encontrado na resposta da API",
      };
    }

    logs.push(log(getTimestamp(), "Token Bearer obtido com sucesso."));
  } catch (authError: any) {
    logs.push(
      log(getTimestamp(), `Erro na autenticação: ${authError.message}`)
    );
    return { success: false, logs, error: authError.message };
  }

  // Step 2: Update Stock
  logs.push(
    log(
      getTimestamp(),
      `Enviando atualização de estoque para mercado ${marketId}...`
    )
  );
  try {
    const stockRes = await fetch(`${baseUrl}/market/update-stock`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        market_id: marketId,
        operator: "Quitandinha",
        products: products,
      }),
    });

    const stockData = await stockRes.json();

    if (stockRes.ok) {
      logs.push(
        log(
          getTimestamp(),
          `Resposta: ${stockRes.status} ${stockRes.statusText}`
        )
      );
      logs.push(log(getTimestamp(), "Estoque atualizado com sucesso!"));
      return {
        success: true,
        statusCode: stockRes.status,
        logs,
        data: stockData,
      };
    } else {
      logs.push(
        log(
          getTimestamp(),
          `Erro: ${stockRes.status} ${stockRes.statusText} - ${JSON.stringify(stockData)}`
        )
      );
      return {
        success: false,
        statusCode: stockRes.status,
        logs,
        error: stockData?.message || `Erro ${stockRes.status}`,
      };
    }
  } catch (stockError: any) {
    logs.push(
      log(getTimestamp(), `Erro na atualização: ${stockError.message}`)
    );
    return { success: false, logs, error: stockError.message };
  }
}
