
import React, { useState, useMemo } from 'react';
import { Tooltip } from './Tooltip';
import { UserInput } from '../types';

interface SWOTFormProps {
  onSubmit: (data: UserInput) => void;
}

interface FormFieldProps {
  id: keyof UserInput;
  label: string;
  tooltip: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  error?: string;
}

// FIX: Changed the component to be of type React.FC<FormFieldProps> to ensure it correctly accepts React's 'key' prop without a type error.
const FormField: React.FC<FormFieldProps> = ({ id, label, tooltip, value, onChange, onBlur, isTextArea = false, error }) => {
    const hasError = !!error;
    const errorId = `${id}-error`;
    const baseClasses = "w-full bg-gray-800 border rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:outline-none transition-colors";
    const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const validClasses = "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500";

    return (
      <div>
        <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-300 mb-2">
          {label}
          <Tooltip text={tooltip} />
        </label>
        {isTextArea ? (
          <textarea
            id={id}
            name={id}
            rows={3}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`${baseClasses} ${hasError ? errorClasses : validClasses}`}
            required
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          />
        ) : (
          <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`${baseClasses} ${hasError ? errorClasses : validClasses}`}
            required
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          />
        )}
        {hasError && <p id={errorId} className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
};

export const SWOTForm = ({ onSubmit }: SWOTFormProps) => {
  const initialFormData: UserInput = {
    businessIdea: '',
    problemSolved: '',
    targetAudience: '',
    solutionVision: '',
    differentiators: '',
    strengths: '',
    weaknesses: '',
    founderDependency: '',
  };

  const [formData, setFormData] = useState<UserInput>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});

  const validateField = (name: keyof UserInput, value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return 'Este campo é obrigatório.';
    }
    if (trimmedValue.length < 10) {
      return 'Por favor, forneça um pouco mais de detalhes (mínimo de 10 caracteres).';
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof UserInput, value: string };
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof UserInput, value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof UserInput, string>> = {};
    let isFormValid = true;

    for (const key in formData) {
      const fieldKey = key as keyof UserInput;
      const error = validateField(fieldKey, formData[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isFormValid = false;
      }
    }
    
    setErrors(newErrors);

    if (isFormValid) {
      onSubmit(formData);
    }
  };

  const isAnyFieldEmpty = useMemo(() => {
    // FIX: Cast value to String before calling trim() to handle `unknown` type from Object.values.
    return Object.values(formData).some(value => String(value).trim() === '');
  }, [formData]);
  
  const formFields: { id: keyof UserInput; label: string; tooltip: string; isTextArea: boolean; }[] = [
      { id: "businessIdea", label: "Ideia do Negócio", tooltip: "Qual é o conceito central do seu negócio?", isTextArea: true },
      { id: "problemSolved", label: "Problema Resolvido", tooltip: "Qual dor específica do cliente sua ideia resolve?", isTextArea: true },
      { id: "targetAudience", label: "Público-Alvo Percebido", tooltip: "Quem são seus principais clientes?", isTextArea: true },
      { id: "solutionVision", label: "Visão de Solução", tooltip: "Como seu produto ou serviço resolve o problema?", isTextArea: true },
      { id: "differentiators", label: "Diferenciais Percebidos", tooltip: "O que torna sua solução única em comparação com os concorrentes?", isTextArea: true },
      { id: "strengths", label: "Pontos Fortes Internos Percebidos", tooltip: "Quais recursos ou habilidades internas lhe dão uma vantagem?", isTextArea: true },
      { id: "weaknesses", label: "Pontos Fracos Internos Percebidos", tooltip: "Quais limitações ou lacunas internas você possui?", isTextArea: true },
      { id: "founderDependency", label: "Dependência do Fundador", tooltip: "O quanto o negócio depende das habilidades pessoais ou da rede de contatos do fundador?", isTextArea: true },
  ]

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Descreva Sua Ideia de Negócio</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {formFields.map(field => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    tooltip={field.tooltip}
                    value={formData[field.id]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isTextArea={field.isTextArea}
                    error={errors[field.id]}
                />
            ))}
        </div>
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isAnyFieldEmpty}
            className="w-full sm:w-auto px-12 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:scale-100"
          >
            Gerar Análise SWOT
          </button>
        </div>
      </form>
    </div>
  );
};
