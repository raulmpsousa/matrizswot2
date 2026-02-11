
import React, { useState } from 'react';
import { Header } from './components/Header';
import { SWOTForm } from './components/SWOTForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SWOTAnalysisDisplay } from './components/SWOTAnalysisDisplay';
import { generateSWOTAnalysis } from './services/geminiService';
import { SWOTAnalysisResult, UserInput } from './types';

export const App = () => {
  const [analysisResult, setAnalysisResult] = useState<SWOTAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateSWOTAnalysis(userInput);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Ocorreu um erro desconhecido.';
      
      if (errorMessage.includes("encontrada no servidor") || errorMessage.includes("API key is not configured")) {
          setError("Configuração incompleta: A chave de API não foi encontrada no servidor. Verifique as variáveis de ambiente no seu painel Netlify.");
      } else if (errorMessage.includes("API key not valid") || errorMessage.includes("permission denied")) {
           setError("Erro da API do Google: A chave de API parece ser inválida, não tem faturamento ativado ou sua região não é suportada. Verifique suas credenciais no Google Cloud.");
      } else {
          setError(`Falha ao gerar a análise: ${errorMessage}. Verifique a console do navegador e os logs da função Netlify para mais detalhes.`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto mt-8">
        {!analysisResult && !isLoading && !error && <SWOTForm onSubmit={handleFormSubmit} />}
        
        {isLoading && (
          <div className="text-center p-10 bg-gray-800 rounded-lg shadow-2xl">
            <LoadingSpinner />
            <p className="text-xl mt-4 text-gray-300">Analisando dados de mercado e suas informações...</p>
            <p className="text-gray-400 mt-2">Isso pode levar um momento.</p>
          </div>
        )}

        {error && (
          <div className="text-center p-10 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-xl text-red-400">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {analysisResult && !isLoading && (
          <SWOTAnalysisDisplay result={analysisResult} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};
