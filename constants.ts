
import { EnhancementStep } from './types';

// Weapon Enhancement Data
export const WEAPON_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.45, plus2FailRate: 0.55 },
  { level: 1, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.40, plus2FailRate: 0.60 },
  { level: 2, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.35, plus2FailRate: 0.65 },
  { level: 3, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.30, plus2FailRate: 0.70 },
  { level: 4, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 5, successRate: 0.51, breakRate: 0.49, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 6, successRate: 0.28, breakRate: 0.72, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 7, successRate: 0.18, breakRate: 0.82, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.13, breakRate: 0.87, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

// Armor Enhancement Data
export const ARMOR_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.45, plus2FailRate: 0.55 },
  { level: 1, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.40, plus2FailRate: 0.60 },
  { level: 2, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.35, plus2FailRate: 0.65 },
  { level: 3, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.30, plus2FailRate: 0.70 },
  { level: 4, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 5, successRate: 0.42, breakRate: 0.58, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 6, successRate: 0.26, breakRate: 0.74, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 7, successRate: 0.18, breakRate: 0.82, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.13, breakRate: 0.87, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

// Secondary Weapon Enhancement Data
// 0->1 Safe (100%). 1->2 Break (38% Fail).
export const SECONDARY_WEAPON_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.00, breakRate: 0.00, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.62, breakRate: 0.38, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.36, breakRate: 0.64, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.18, breakRate: 0.82, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 6, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 7, successRate: 0.08, breakRate: 0.92, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 8, successRate: 0.05, breakRate: 0.95, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 9, successRate: 0.02, breakRate: 0.98, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

// Accessory Enhancement Data
// 0->1 Safe (100%). 1->2 Break (26% Fail).
export const ACCESSORY_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.74, breakRate: 0.26, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.40, breakRate: 0.60, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 6, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 7, successRate: 0.08, breakRate: 0.92, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 8, successRate: 0.05, breakRate: 0.95, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 9, successRate: 0.02, breakRate: 0.98, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

// Gaiter (Legguards) Enhancement Data
// 0->1 Safe (100%). 1->2 Break (17% Fail).
export const GAITER_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.00, breakRate: 0.00, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.83, breakRate: 0.17, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.44, breakRate: 0.56, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 6, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 7, successRate: 0.08, breakRate: 0.92, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 8, successRate: 0.05, breakRate: 0.95, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 9, successRate: 0.02, breakRate: 0.98, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

// Cloak Enhancement Data (Based on provided image, same as Gaiter)
// 0->1 Safe (100%). 1->2 Break (17% Fail).
export const CLOAK_ENHANCEMENT_TABLE: EnhancementStep[] = [
  { level: 0, successRate: 1.00, breakRate: 0.00, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.83, breakRate: 0.17, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.44, breakRate: 0.56, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 6, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 7, successRate: 0.08, breakRate: 0.92, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 8, successRate: 0.05, breakRate: 0.95, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 9, successRate: 0.02, breakRate: 0.98, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

export const MAX_CALC_LEVEL = 9;
