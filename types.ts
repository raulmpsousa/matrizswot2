
export interface SWOTFactor {
  factor: string;
  justification: string;
}

export interface SWOTMatrix {
  strengths: SWOTFactor[];
  weaknesses: SWOTFactor[];
  opportunities: SWOTFactor[];
  threats: SWOTFactor[];
}

export interface TOWSMatrix {
  soStrategies: string[];
  woStrategies: string[];
  stStrategies: string[];
  wtStrategies: string[];
}

export interface SWOTAnalysisResult {
  swotMatrix: SWOTMatrix;
  towsMatrix: TOWSMatrix;
  strategicAlerts: string[];
  finalSynthesis: string;
  suggestedCNAEs: string[];
  applicableTaxes: string[];
  estimatedTaxPercentage: string;
}

export interface UserInput {
  businessIdea: string;
  problemSolved: string;
  targetAudience: string;
  solutionVision: string;
  differentiators: string;
  strengths: string;
  weaknesses: string;
  founderDependency: string;
}
