
export interface Prices {
  item: number;
  normalStone: number;
  ivaldiStone: number;
  andvariStone: number;
}

export interface MaterialCounts {
  item: number;
  normal: number;
  ivaldi: number;
  andvari: number;
}

export interface EnhancementStep {
  level: number;
  successRate: number;
  breakRate: number; // For normal fails
  plus2SuccessRate: number; // For Ivaldi
  plus2FailRate: number; // For Ivaldi
}

export enum StrategyType {
  NORMAL_ONLY = '일반 강화 올인',
  IVALDI_FROM_5 = '5강부터 이발디',
  IVALDI_FROM_4 = '4강부터 이발디',
  RESEMARA_4 = '4강 리세마라 (추천)'
}

export interface StepDetail {
  level: number;
  action: 'NORMAL' | 'IVALDI' | 'ANDVARI' | 'RESEMARA';
  cost: number; // Expected cost from this level to target
  description: string;
  successRate: number; // Success probability for this step
  expectedMaterials: MaterialCounts; // Remaining expected materials from this level to target
}

export interface ScenarioResult {
  id: string;
  title: string;
  description: string;
  totalCost: number;
  breakdown: {
    baseItem: number; // The initial item cost
    enhancement: number; // The expected cost of stones + breakage replacements
  };
  details?: StepDetail[]; // Detailed step-by-step breakdown for optimal strategy
  expectedMaterials: MaterialCounts; // Total expected materials for the entire strategy
  recommended: boolean;
}
