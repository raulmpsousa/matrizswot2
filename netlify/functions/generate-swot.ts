
import { GoogleGenAI, Type } from "@google/genai";
import type { Handler } from "@netlify/functions";
import type { UserInput, SWOTAnalysisResult } from '../../types';

// O prompt e a lógica foram movidos do frontend para este backend seguro.
const buildPrompt = (userInput: UserInput) => `
    Você é uma Inteligência Artificial especializada em Estratégia de Negócios, Análise de Mercado e Planejamento Estratégico, com domínio de frameworks clássicos (SWOT, PESTEL, Porter, TOWS) e capacidade de pesquisa profunda em fontes públicas da internet. Seu objetivo é construir uma Matriz SWOT precisa, objetiva e argumentada, e derivar estratégias acionáveis a partir dela. Aja com rigor analítico, ceticismo saudável e linguagem profissional.

    **PERSONA ADAPTATIVA (REGRA CRÍTICA):**
    - **Analise a linguagem do 'BLOCO A - INPUT HUMANO'. Se a linguagem for simples, direta e com pouco jargão de negócios, sua resposta deve ser didática. Explique os conceitos (como 'Matriz TOWS', 'CNAE', 'MEI') de forma simples e use analogias.**
    - **Se a linguagem for sofisticada, com termos técnicos de negócios e bem estruturada, sua resposta deve ser em tom de consultoria estratégica: direta, densa e profissional, mas ainda evitando jargões excessivamente complexos para manter a clareza.**

    **BLOCO A — INPUT HUMANO (HIPÓTESES INTERNAS):**
    - **Ideia do negócio:** ${userInput.businessIdea}
    - **Problema resolvido:** ${userInput.problemSolved}
    - **Público-alvo percebido:** ${userInput.targetAudience}
    - **Visão de solução:** ${userInput.solutionVision}
    - **Diferenciais percebidos:** ${userInput.differentiators}
    - **Pontos fortes internos percebidos:** ${userInput.strengths}
    - **Pontos fracos internos percebidos:** ${userInput.weaknesses}
    - **Dependência do fundador:** ${userInput.founderDependency}

    **SUA TAREFA (SIGA RIGOROSAMENTE):**

    **ETAPA 1: PESQUISA EXTERNA ESTRUTURADA (BLOCO B)**
    Pesquise autonomamente na internet dados sobre:
    1.  **Mercado e Setor:** Tamanho, crescimento, tendências.
    2.  **Concorrência:** Concorrentes diretos/indiretos, modelos de negócio, barreiras de entrada.
    3.  **Comportamento do Cliente:** Dores, critérios de decisão, sensibilidade a preço.
    4.  **Ambiente Macro (PESTEL):** Pesquise o cenário econômico, tributário e político **atual** no Brasil. Analise de forma estritamente pragmática e sem viés ideológico como esses fatores podem beneficiar, prejudicar ou ser neutros para o negócio proposto.
    5.  **Análise de Stakeholders:** Identifique todos os possíveis stakeholders (governo, fornecedores, comunidades locais, investidores, etc.) e como eles podem influenciar o negócio como força, fraqueza, oportunidade ou ameaça.

    **ETAPA 2: ANÁLISE E CLASSIFICAÇÃO SWOT**
    - Valide as hipóteses do Bloco A contra os dados pesquisados no Bloco B.
    - Classifique os fatores RIGOROSAMENTE:
      - **FORÇAS (Strengths):** Internos, controláveis, que geram vantagem competitiva.
      - **FRAQUEZAS (Weaknesses):** Internos, controláveis, que limitam o desempenho.
      - **OPORTUNIDADES (Opportunities):** Externos, não controláveis, que o negócio pode explorar.
      - **AMEAÇAS (Threats):** Externos, não controláveis, que podem prejudicar o negócio.
    - Priorize os 3 a 5 fatores MAIS RELEVANTES em cada quadrante, avaliando impacto e probabilidade.

    **ETAPA 3: GERAÇÃO DE ESTRATÉGIAS (MATRIZ TOWS)**
    Com base na análise SWOT da ETAPA 2, crie de 2 a 3 estratégias acionáveis para cada categoria abaixo. As estratégias devem ser claras, diretas e práticas.
    - **Estratégias SO (Forças + Oportunidades):** Como usar as Forças para aproveitar as Oportunidades? (Estratégias de crescimento)
    - **Estratégias WO (Fraquezas + Oportunidades):** Como aproveitar as Oportunidades para superar as Fraquezas? (Estratégias de desenvolvimento)
    - **Estratégias ST (Forças + Ameaças):** Como usar as Forças para mitigar ou evitar as Ameaças? (Estratégias de monitoramento/defesa)
    - **Estratégias WT (Fraquezas + Ameaças):** Como minimizar as Fraquezas e evitar as Ameaças? (Estratégias de sobrevivência/contingência)

    **ETAPA 4: PESQUISA REGULATÓRIA E FISCAL (BRASIL)**
    Com base na natureza do negócio, pesquise e identifique:
    1.  **CNAEs Sugeridos:** Sugira de 2 a 3 códigos CNAE (Classificação Nacional de Atividades Econômicas) que melhor se enquadrem na atividade principal da empresa. Apresente o código e sua descrição em uma única string por sugestão.
    2.  **Análise de Enquadramento Tributário (REGRA CRÍTICA - MEI):**
        a. **Verifique Primeiro o MEI:** Para os CNAEs sugeridos, verifique se a atividade é permitida no regime MEI (Microempreendedor Individual).
        b. **Se for enquadrável como MEI:**
           - Em 'applicableTaxes', explique claramente: "O negócio se enquadra na modalidade MEI.", "A tributação é feita por meio de uma guia mensal fixa (DAS-MEI), que inclui INSS e ICMS/ISS." e "O MEI possui um limite de faturamento anual. Pesquise e informe o valor vigente para o ano corrente.".
           - No campo 'estimatedTaxPercentage', coloque a seguinte string: "Taxa fixa mensal (DAS), não é um percentual sobre o faturamento."
        c. **Se NÃO for enquadrável como MEI:**
           - Prossiga com a análise padrão. Em 'applicableTaxes', descreva o regime tributário mais comum (ex: Simples Nacional, Lucro Presumido) e os principais impostos incidentes.
           - No campo 'estimatedTaxPercentage', forneça um percentual total estimado de imposto sobre o faturamento para o regime mais provável (ex: 'A carga tributária total estimada no Simples Nacional pode variar de 6% a 15%, dependendo do faturamento anual.').

    **ETAPA 5: GERAÇÃO DO OUTPUT**
    Com base em todas as etapas anteriores, gere o output no formato JSON solicitado, incluindo a Matriz SWOT, a Matriz TOWS, alertas estratégicos, uma síntese final, os CNAEs sugeridos, os impostos aplicáveis e o percentual de imposto estimado.

    **REGRAS DE OURO:**
    - **Seja cético em relação às informações do input humano (Bloco A). Sua principal função é validar, refutar ou refinar essas hipóteses com dados externos e atuais. Não se contamine com o otimismo ou viés do usuário.**
    - **Toda a sua análise deve se basar em informações vigentes e existentes no dia atual da pesquisa. Deixe isso claro na sua análise quando relevante.**
    - **Analise o cenário político e econômico de forma neutra, focando exclusivamente em variáveis que impactam o ambiente de negócios: taxas de juros, inflação, legislação, incentivos fiscais, etc.**
    - Não romantize a ideia.
    - Não valide crenças sem evidências externas.
    - Seja direto, técnico e pense como um consultor estratégico e investidor cético.
    - A justificativa de cada item deve ser baseada em dados ou lógica de mercado.
  `;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
      swotMatrix: {
        type: Type.OBJECT,
        properties: {
          strengths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { factor: { type: Type.STRING }, justification: { type: Type.STRING } },
              required: ["factor", "justification"],
            },
          },
          weaknesses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { factor: { type: Type.STRING }, justification: { type: Type.STRING } },
              required: ["factor", "justification"],
            },
          },
          opportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { factor: { type: Type.STRING }, justification: { type: Type.STRING } },
              required: ["factor", "justification"],
            },
          },
          threats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { factor: { type: Type.STRING }, justification: { type: Type.STRING } },
              required: ["factor", "justification"],
            },
          },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"],
      },
      towsMatrix: {
          type: Type.OBJECT,
          properties: {
              soStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
              woStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
              stStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
              wtStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["soStrategies", "woStrategies", "stStrategies", "wtStrategies"],
      },
      strategicAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
      finalSynthesis: { type: Type.STRING },
      suggestedCNAEs: { type: Type.ARRAY, items: { type: Type.STRING } },
      applicableTaxes: { type: Type.ARRAY, items: { type: Type.STRING } },
      estimatedTaxPercentage: { type: Type.STRING },
    },
    required: ["swotMatrix", "towsMatrix", "strategicAlerts", "finalSynthesis", "suggestedCNAEs", "applicableTaxes", "estimatedTaxPercentage"],
  };

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const userInput: UserInput = JSON.parse(event.body || '{}');
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY environment variable not set in Netlify.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configuration error: API key is not configured on the server." }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(userInput);

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.3,
        }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("A resposta da IA não contém texto.");
    }
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: jsonText,
    };

  } catch (error: any) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Ocorreu um erro interno no servidor." }),
    };
  }
};
