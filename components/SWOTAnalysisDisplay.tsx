
import React from 'react';
import { SWOTAnalysisResult, SWOTMatrix, TOWSMatrix } from '../types';

interface SWOTAnalysisDisplayProps {
  result: SWOTAnalysisResult;
  onReset: () => void;
}

const colorConfig = {
    green: { border: 'border-t-green-400', text: 'text-green-400' },
    red: { border: 'border-t-red-400', text: 'text-red-400' },
    blue: { border: 'border-t-blue-400', text: 'text-blue-400' },
    yellow: { border: 'border-t-yellow-400', text: 'text-yellow-400' }
};

interface QuadrantProps {
    title: string;
    items: { factor: string; justification: string }[];
    color: 'green' | 'red' | 'blue' | 'yellow';
    icon: string;
    delay: number;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, items, color, icon, delay }) => (
    <div 
        className={`animate-fade-in-up bg-gray-800/50 backdrop-blur-sm border border-gray-700 border-t-4 rounded-xl p-6 ${colorConfig[color].border}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center mb-4">
            <span className={`text-3xl mr-3 ${colorConfig[color].text}`}>{icon}</span>
            <h3 className={`text-2xl font-bold ${colorConfig[color].text}`}>{title}</h3>
        </div>
        <ul className="space-y-4">
            {items.map((item, index) => (
                <li key={index} className="border-l-2 border-gray-600 pl-4 transition-transform duration-200 hover:scale-[1.02]">
                    <p className="font-semibold text-gray-100">{item.factor}</p>
                    <p className="text-sm text-gray-400 mt-1">{item.justification}</p>
                </li>
            ))}
        </ul>
    </div>
);

const StrategyCard = ({title, subtitle, strategies, icon, color}: {
    title: string;
    subtitle: string;
    strategies: string[];
    icon: string;
    color: string;
}) => (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/80">
        <div className="flex items-start mb-3">
            <span className={`text-2xl mr-4 ${color}`}>{icon}</span>
            <div>
                <h4 className={`font-bold text-lg ${color}`}>{title}</h4>
                <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
        </div>
        <ul className="space-y-2 list-disc list-inside text-gray-300 pl-2">
            {strategies.map((strat, i) => <li key={i} className="transition-all duration-200 origin-left hover:scale-[1.01] hover:text-white">{strat}</li>)}
        </ul>
    </div>
);

const TOWSMatrixDisplay = ({ matrix, delay }: { matrix: TOWSMatrix, delay: number }) => (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">Estratégias Acionáveis (Matriz TOWS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrategyCard title="Estratégias SO" subtitle="Alavancar Forças para Capitalizar Oportunidades" strategies={matrix.soStrategies} icon="📈" color="text-green-400" />
            <StrategyCard title="Estratégias WO" subtitle="Superar Fraquezas Explorando Oportunidades" strategies={matrix.woStrategies} icon="🌱" color="text-blue-400" />
            <StrategyCard title="Estratégias ST" subtitle="Usar Forças para Mitigar Ameaças" strategies={matrix.stStrategies} icon="🛡️" color="text-yellow-400" />
            <StrategyCard title="Estratégias WT" subtitle="Minimizar Fraquezas e Evitar Ameaças" strategies={matrix.wtStrategies} icon="🚧" color="text-red-400" />
        </div>
    </div>
);


export const SWOTAnalysisDisplay = ({ result, onReset }: SWOTAnalysisDisplayProps) => {
    const { swotMatrix, towsMatrix, strategicAlerts, finalSynthesis, suggestedCNAEs, applicableTaxes, estimatedTaxPercentage } = result;
    
    const quadrants: QuadrantProps[] = [
        { title: "Forças", items: swotMatrix.strengths, color: 'green', icon: "💪", delay: 100 },
        { title: "Fraquezas", items: swotMatrix.weaknesses, color: 'red', icon: "⚠️", delay: 200 },
        { title: "Oportunidades", items: swotMatrix.opportunities, color: 'blue', icon: "🚀", delay: 300 },
        { title: "Ameaças", items: swotMatrix.threats, color: 'yellow', icon: "🛡️", delay: 400 },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-100 animate-fade-in-up">Matriz SWOT</h2>
                <div 
                    className="relative grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up"
                    style={{ animationDelay: '100ms' }}
                >
                    <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-700"></div>
                    <div aria-hidden="true" className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-700"></div>
                    {quadrants.map((q) => <Quadrant key={q.title} {...q} />)}
                </div>
            </div>
            
            <TOWSMatrixDisplay matrix={towsMatrix} delay={500} />

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">Observações e Alertas Estratégicos</h2>
                <div className="space-y-4 mt-6">
                    {strategicAlerts.map((alert, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <span className="text-yellow-400 text-xl mr-4 mt-1">💡</span>
                            <p className="text-gray-300">{alert}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">CNAEs Sugeridos</h2>
                <div className="space-y-4 mt-6">
                    {suggestedCNAEs.map((cnae, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <span className="text-cyan-400 text-xl mr-4 mt-1">📋</span>
                            <p className="text-gray-300">{cnae}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">Impostos Aplicáveis</h2>
                <div className="space-y-4 mt-6">
                    {applicableTaxes.map((tax, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <span className="text-green-400 text-xl mr-4 mt-1">💰</span>
                            <p className="text-gray-300">{tax}</p>
                        </div>
                    ))}
                    <div className="flex items-center p-4 bg-gray-900 rounded-lg border border-green-500/50 mt-6">
                        <span className="text-green-400 text-2xl mr-4">📊</span>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-200">Estimativa de Carga Tributária Total</h4>
                            <p className="text-green-300 text-lg font-semibold">{estimatedTaxPercentage}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">Síntese Final</h2>
                <div className="flex items-start">
                    <span className="text-indigo-400 text-xl mr-4 mt-1">🏆</span>
                    <p className="text-gray-300 leading-relaxed">{finalSynthesis}</p>
                </div>
            </div>
            
            <div className="flex justify-center items-center pt-4">
                <button
                    onClick={onReset}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 animate-bounce-in"
                    style={{ animationDelay: '1000ms' }}
                >
                    Iniciar Nova Análise
                </button>
            </div>
        </div>
    );
};
