
import { UserInput, SWOTAnalysisResult } from '../types';

export const generateSWOTAnalysis = async (userInput: UserInput): Promise<SWOTAnalysisResult> => {
  const response = await fetch('/.netlify/functions/generate-swot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInput),
  });

  const responseBody = await response.text();

  if (!response.ok) {
    let errorData;
    try {
        errorData = JSON.parse(responseBody);
    } catch(e) {
        errorData = { error: 'Ocorreu um erro desconhecido na API.' };
    }
    
    if (response.status >= 500 && errorData.error && errorData.error.includes("API key is not configured")) {
        throw new Error("Configuração incompleta: A chave de API não foi encontrada no servidor. Verifique as variáveis de ambiente no Netlify.");
    }
    throw new Error(errorData.error || `Erro: ${response.status} ${response.statusText}`);
  }

  try {
    return JSON.parse(responseBody) as SWOTAnalysisResult;
  } catch (e) {
      console.error("Falha ao analisar a resposta JSON do servidor:", responseBody);
      throw new Error("Recebido um formato inválido do servidor.");
  }
};
