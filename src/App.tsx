import React, { useState, useEffect } from 'react';
import { 
  Sword, 
  Swords, 
  Shield, 
  Footprints, 
  Gem, 
  Hammer, 
  Info, 
  Calculator, 
  ChevronDown, 
  CircleArrowUp, 
  CircleDashed, 
  Coins, 
  TrendingUp, 
  WandSparkles,
  Component,
  Music,
  Wind,
  Navigation,
  Award,
  CircleUser,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

type Category = 'WEAPON' | 'SECONDARY_WEAPON' | 'ARMOR' | 'GAITER' | 'CLOAK' | 'ACCESSORY' | 'BELT' | 'WHISTLE' | 'INSIGNIA' | 'BRACER_SHOULDER' | 'CHARM' | 'BROOCH_BUCKLE';

interface Prices {
  item: number;
  normalStone: number;
  ivaldiStone: number;
  andvariStone: number;
}

interface Rate {
  level: number;
  successRate: number;
  breakRate: number;
  plus2SuccessRate: number;
  plus2FailRate: number;
}

interface MaterialCounts {
  item: number;
  normal: number;
  ivaldi: number;
  andvari: number;
}

interface StrategyResult {
  id: string;
  title: string;
  description: string;
  totalCost: number;
  expectedMaterials: MaterialCounts;
  details: any[];
  recommended: boolean;
  pathDescription?: string;
}

// Success Rates from the original site
const WEAPON_RATES: Rate[] = [
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

const ARMOR_RATES: Rate[] = [
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

const ACCESSORY_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
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

const SECONDARY_RATES: Rate[] = [
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

const GAITER_RATES: Rate[] = [
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

const CLOAK_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.83, breakRate: 0.17, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.44, breakRate: 0.56, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.19, breakRate: 0.81, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.16, breakRate: 0.84, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 7, successRate: 0.13, breakRate: 0.87, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.10, breakRate: 0.90, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.08, breakRate: 0.92, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
];

const WHISTLE_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.83, breakRate: 0.17, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.52, breakRate: 0.48, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.37, breakRate: 0.63, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.28, breakRate: 0.72, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.20, breakRate: 0.80, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 7, successRate: 0.18, breakRate: 0.82, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.16, breakRate: 0.84, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.14, breakRate: 0.86, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
];

const INSIGNIA_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.81, breakRate: 0.19, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.51, breakRate: 0.49, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.37, breakRate: 0.63, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.28, breakRate: 0.72, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.22, breakRate: 0.78, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.19, breakRate: 0.81, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 7, successRate: 0.17, breakRate: 0.83, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.13, breakRate: 0.87, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
];

const BRACER_SHOULDER_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.85, breakRate: 0.15, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.54, breakRate: 0.46, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.38, breakRate: 0.62, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.23, breakRate: 0.77, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.20, breakRate: 0.80, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 7, successRate: 0.18, breakRate: 0.82, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.16, breakRate: 0.84, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.14, breakRate: 0.86, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
];

const CHARM_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.85, breakRate: 0.15, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.56, breakRate: 0.44, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.40, breakRate: 0.60, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.37, breakRate: 0.63, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.35, breakRate: 0.65, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.30, breakRate: 0.70, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 7, successRate: 0.25, breakRate: 0.75, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 8, successRate: 0.20, breakRate: 0.80, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
  { level: 9, successRate: 0.15, breakRate: 0.85, plus2SuccessRate: 0.05, plus2FailRate: 0.95 },
];

const BROOCH_BUCKLE_RATES: Rate[] = [
  { level: 0, successRate: 1.0, breakRate: 0.0, plus2SuccessRate: 0.25, plus2FailRate: 0.75 },
  { level: 1, successRate: 0.85, breakRate: 0.15, plus2SuccessRate: 0.20, plus2FailRate: 0.80 },
  { level: 2, successRate: 0.55, breakRate: 0.45, plus2SuccessRate: 0.15, plus2FailRate: 0.85 },
  { level: 3, successRate: 0.39, breakRate: 0.61, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 4, successRate: 0.33, breakRate: 0.67, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 5, successRate: 0.29, breakRate: 0.71, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 6, successRate: 0.25, breakRate: 0.75, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 7, successRate: 0.22, breakRate: 0.78, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 8, successRate: 0.19, breakRate: 0.81, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
  { level: 9, successRate: 0.16, breakRate: 0.84, plus2SuccessRate: 0.10, plus2FailRate: 0.90 },
];

// --- Helper Functions ---

const addMaterials = (a: MaterialCounts, b: MaterialCounts): MaterialCounts => ({
  item: a.item + b.item,
  normal: a.normal + b.normal,
  ivaldi: a.ivaldi + b.ivaldi,
  andvari: a.andvari + b.andvari,
});

const scaleMaterials = (m: MaterialCounts, s: number): MaterialCounts => ({
  item: m.item * s,
  normal: m.normal * s,
  ivaldi: m.ivaldi * s,
  andvari: m.andvari * s,
});

const isBetter = (cost1: number, item1: number, cost2: number, item2: number): boolean => {
  if (Math.abs(cost1 - cost2) < 1e-9) return item1 < item2;
  return cost1 < cost2;
};

const calculateExpectedCost = (
  targetLevel: number,
  prices: Prices,
  policyFn: (lvl: number, isSafe: boolean, costs: number[]) => string,
  rates: Rate[],
  safeLevel: number
) => {
  const MAX_LEVEL = 9;
  const iterations = 50000;
  const precision = 1e-7;

  let expectedCosts = new Array(MAX_LEVEL + 2).fill(0);
  let expectedMaterials = new Array(MAX_LEVEL + 2).fill(null).map(() => ({ item: 0, normal: 0, ivaldi: 0, andvari: 0 }));
  let actions = new Array(MAX_LEVEL + 1).fill("");

  for (let iter = 0; iter < iterations; iter++) {
    const prevCost0 = expectedCosts[0];
    const prevItem0 = expectedMaterials[0].item;

    const baseItemCost = prices.item + expectedCosts[0];
    const baseItemMaterials = addMaterials({ item: 1, normal: 0, ivaldi: 0, andvari: 0 }, expectedMaterials[0]);

    for (let lvl = targetLevel - 1; lvl >= 0; lvl--) {
      const rate = rates.find(r => r.level === lvl);
      if (!rate) continue;

      const isSafe = lvl < safeLevel;
      const policy = policyFn(lvl, isSafe, expectedCosts);

      const getNormal = () => {
        const cost = isSafe 
          ? prices.normalStone + expectedCosts[lvl + 1]
          : prices.normalStone + rate.successRate * expectedCosts[lvl + 1] + rate.breakRate * baseItemCost;
        
        const mats = isSafe 
          ? addMaterials({ item: 0, normal: 1, ivaldi: 0, andvari: 0 }, expectedMaterials[lvl + 1])
          : addMaterials({ item: 0, normal: 1, ivaldi: 0, andvari: 0 }, addMaterials(scaleMaterials(expectedMaterials[lvl + 1], rate.successRate), scaleMaterials(baseItemMaterials, rate.breakRate)));
        
        return { cost, materials: mats };
      };

      const getIvaldi = () => {
        const nextLvl2 = Math.min(lvl + 2, targetLevel);
        const nextLvl1 = lvl + 1;
        const p2 = rate.successRate * rate.plus2SuccessRate;
        const p1 = rate.successRate * (1 - rate.plus2SuccessRate);
        const pb = rate.breakRate;

        const cost = isSafe
          ? prices.ivaldiStone + p2 * expectedCosts[nextLvl2] + p1 * expectedCosts[nextLvl1]
          : prices.ivaldiStone + p2 * expectedCosts[nextLvl2] + p1 * expectedCosts[nextLvl1] + pb * baseItemCost;

        const mats = isSafe
          ? addMaterials({ item: 0, normal: 0, ivaldi: 1, andvari: 0 }, addMaterials(scaleMaterials(expectedMaterials[nextLvl2], p2), scaleMaterials(expectedMaterials[nextLvl1], p1)))
          : addMaterials({ item: 0, normal: 0, ivaldi: 1, andvari: 0 }, addMaterials(addMaterials(scaleMaterials(expectedMaterials[nextLvl2], p2), scaleMaterials(expectedMaterials[nextLvl1], p1)), scaleMaterials(baseItemMaterials, pb)));

        return { cost, materials: mats };
      };

      const getAndvari = () => {
        if (lvl === 0) return { cost: Infinity, materials: expectedMaterials[0] };
        const cost = prices.andvariStone + expectedCosts[lvl - 1];
        const mats = addMaterials({ item: 0, normal: 0, ivaldi: 0, andvari: 1 }, expectedMaterials[lvl - 1]);
        return { cost, materials: mats };
      };

      let bestAction = "NORMAL";
      let bestResult = getNormal();

      if (policy === "OPTIMAL") {
        const ivaldi = getIvaldi();
        if (isBetter(ivaldi.cost, ivaldi.materials.item, bestResult.cost, bestResult.materials.item)) {
          bestResult = ivaldi;
          bestAction = "IVALDI";
        }
        if (lvl > 0) {
          const andvari = getAndvari();
          if (isBetter(andvari.cost, andvari.materials.item, bestResult.cost, bestResult.materials.item)) {
            bestResult = andvari;
            bestAction = "ANDVARI";
          }
        }
      } else if (policy === "IVALDI") {
        bestResult = getIvaldi();
        bestAction = "IVALDI";
      } else if (policy === "ANDVARI") {
        bestResult = getAndvari();
        bestAction = "ANDVARI";
      }

      expectedCosts[lvl] = bestResult.cost;
      expectedMaterials[lvl] = bestResult.materials;
      actions[lvl] = bestAction;
    }

    if (Math.abs(expectedCosts[0] - prevCost0) < precision && Math.abs(expectedMaterials[0].item - prevItem0) < precision) break;
  }

  const details = [];
  for (let i = 0; i < targetLevel; i++) {
    const rate = rates.find(r => r.level === i);
    const action = actions[i];
    let desc = "";
    let successRate = rate ? rate.successRate : 0;

    if (action === "NORMAL") desc = "일반 강화";
    else if (action === "IVALDI") desc = `이발디 (대성공 ${rate ? (rate.successRate * rate.plus2SuccessRate * 100).toFixed(1) : 0}% 노림)`;
    else if (action === "ANDVARI") {
      desc = "안드바리 (강화 다운: -1강)";
      successRate = 1.0;
    }

    details.push({
      level: i,
      action,
      cost: expectedCosts[i],
      description: desc,
      successRate,
      expectedMaterials: expectedMaterials[i]
    });
  }

  let pathDesc = "최적 경로 계산 완료";
  if (actions[4] === "IVALDI" && actions[5] === "ANDVARI") pathDesc = "4강 이발디 ↔ 5강 안드바리 반복";
  else if (actions[0] === "IVALDI" && actions[1] === "ANDVARI") pathDesc = "0강 이발디 ↔ 1강 안드바리 반복";
  else {
    const actionSet = new Set(actions.slice(0, targetLevel));
    if (actionSet.has("ANDVARI")) pathDesc = "안드바리 다운 & 재시도 혼합";
    else if (actionSet.has("IVALDI")) {
      const ivaldiLvls = actions.map((a, i) => a === "IVALDI" ? i : -1).filter(i => i !== -1);
      if (ivaldiLvls.length === 1 && ivaldiLvls[0] === 0) pathDesc = "0강만 이발디 (2강 점프)";
      else pathDesc = "구간별 이발디/일반 스위칭";
    } else pathDesc = "전 구간 일반 강화 추천";
  }

  return {
    cost: expectedCosts[0],
    pathDescription: pathDesc,
    details,
    totalMaterials: addMaterials({ item: 1, normal: 0, ivaldi: 0, andvari: 0 }, expectedMaterials[0])
  };
};

const getStrategies = (targetLevel: number, prices: Prices, category: Category): StrategyResult[] => {
  let rates = WEAPON_RATES;
  let safeLevel = 5;

  if (category === 'ARMOR' || category === 'GAITER') { 
    rates = category === 'ARMOR' ? ARMOR_RATES : GAITER_RATES; 
    safeLevel = 5; 
  }
  else if (category === 'ACCESSORY' || category === 'BELT') { 
    rates = ACCESSORY_RATES; 
    safeLevel = 1; 
  }
  else if (category === 'WHISTLE') {
    rates = WHISTLE_RATES;
    safeLevel = 1;
  }
  else if (category === 'INSIGNIA') {
    rates = INSIGNIA_RATES;
    safeLevel = 1;
  }
  else if (category === 'BRACER_SHOULDER') {
    rates = BRACER_SHOULDER_RATES;
    safeLevel = 1;
  }
  else if (category === 'CHARM') {
    rates = CHARM_RATES;
    safeLevel = 1;
  }
  else if (category === 'BROOCH_BUCKLE') {
    rates = BROOCH_BUCKLE_RATES;
    safeLevel = 1;
  }
  else if (category === 'CLOAK') {
    rates = CLOAK_RATES;
    safeLevel = 1;
  }
  else if (category === 'SECONDARY_WEAPON') {
    rates = WEAPON_RATES;
    safeLevel = 5;
  }

  const baseStrategies = [
    { id: "normal", name: "일반 깡강화", desc: "모든 구간 일반 강화.", startLvl: 0, policy: () => "NORMAL" },
  ];

  const isSafeTo1 = safeLevel === 1;

  const categoryStrategies = isSafeTo1
    ? [
        { id: "resemara_0", name: "0강 리세 (1강 패스)", desc: "0강 이발디. 1강 안드바리 다운. 2강부터 이발디.", startLvl: 0, policy: (m: number) => m === 0 ? "IVALDI" : m === 1 ? "ANDVARI" : m >= 2 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "ivaldi_0_1", name: "0,1강 이발디", desc: "0강과 1강 이발디. 2강부터 이발디.", startLvl: 0, policy: (m: number) => m === 0 || m === 1 || (m >= 2 && m <= targetLevel - 2) ? "IVALDI" : "NORMAL" },
        { id: "ivaldi1", name: "1강부터 이발디", desc: "0강 일반. 1강 이발디(3강 점프 노림).", startLvl: 1, policy: (m: number) => m === 1 || (m >= 2 && m <= targetLevel - 2) ? "IVALDI" : "NORMAL" },
        { id: "ivaldi2", name: "2강부터 이발디", desc: "2강부터 이발디 사용.", startLvl: 2, policy: (m: number) => m >= 2 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
      ]
    : [
        { id: "ivaldi4", name: "4강부터 이발디", desc: "4강부터 쭉 이발디 사용.", startLvl: 4, policy: (m: number) => m >= 4 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "ivaldi5", name: "5강부터 이발디", desc: "5강부터 이발디 사용.", startLvl: 5, policy: (m: number) => m >= 5 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "ivaldi6", name: "6강부터 이발디", desc: "6강부터 이발디 사용.", startLvl: 6, policy: (m: number) => m >= 6 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "ivaldi7", name: "7강부터 이발디", desc: "7강부터 이발디 사용.", startLvl: 7, policy: (m: number) => m >= 7 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "ivaldi8", name: "8강부터 이발디", desc: "8강부터 이발디 사용.", startLvl: 8, policy: (m: number) => m >= 8 && m <= targetLevel - 2 ? "IVALDI" : "NORMAL" },
        { id: "resemara", name: "4강 리세 (5강→4강 다운)", desc: "4강에서 이발디로 6강 점프를 노림. 5강이 되면 안드바리로 내려서 다시 시도.", startLvl: 4, policy: (m: number) => m === 4 ? "IVALDI" : m === 5 ? "ANDVARI" : m >= 6 ? "IVALDI" : "NORMAL" },
      ];

  const allStrategies = [...baseStrategies, ...categoryStrategies];

  const results = allStrategies
    .filter(s => s.id === "normal" || s.id === "optimal" || s.id.startsWith("resemara") || s.id === "ivaldi_0_1" || s.id === "ivaldi1" ? true : s.startLvl <= targetLevel - 2)
    .map(s => {
      const calc = calculateExpectedCost(targetLevel, prices, s.policy, rates, safeLevel);
      return {
        id: s.id,
        title: s.name,
        description: s.desc,
        totalCost: Math.round(prices.item + calc.cost),
        details: calc.details,
        expectedMaterials: calc.totalMaterials,
        recommended: false
      };
    });

  const minCost = Math.min(...results.map(r => r.totalCost));
  let foundRecommended = false;
  results.forEach(r => {
    if (r.totalCost === minCost && !foundRecommended) {
      r.recommended = true;
      foundRecommended = true;
    } else {
      r.recommended = false;
    }
  });

  return results.sort((a, b) => {
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return a.totalCost - b.totalCost;
  });
};

// --- Components ---

const MaterialIcons = ({ counts, colorClass = "text-slate-400" }: { counts: MaterialCounts, colorClass?: string }) => {
  const items = [
    { icon: <Gem className="w-3 h-3 text-cyan-400" />, val: counts.item, color: "text-cyan-100", decimal: true },
    { icon: <Coins className="w-3 h-3 text-slate-400" />, val: counts.normal, color: "text-slate-300", decimal: false },
    { icon: <CircleArrowUp className="w-3 h-3 text-purple-400" />, val: counts.ivaldi, color: "text-purple-200", decimal: true },
    { icon: <Shield className="w-3 h-3 text-green-400" />, val: counts.andvari, color: "text-green-200", decimal: true },
  ].filter(i => i.val > 0.001);

  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
      {items.map((item, i) => (
        <div key={i} className={`flex items-center gap-1 text-[11px] font-mono ${item.color}`}>
          {item.icon}
          <span className="font-bold">{item.decimal ? Number(item.val.toFixed(2)) : Math.round(item.val)}</span>
        </div>
      ))}
    </div>
  );
};

const MaterialIconsSmall = ({ counts }: { counts: MaterialCounts }) => {
  const items = [
    { icon: <Gem className="w-3 h-3 text-cyan-400" />, val: counts.item, decimal: true },
    { icon: <Coins className="w-3 h-3 text-slate-400" />, val: counts.normal, decimal: false },
    { icon: <CircleArrowUp className="w-3 h-3 text-purple-400" />, val: counts.ivaldi, decimal: true },
    { icon: <Shield className="w-3 h-3 text-green-400" />, val: counts.andvari, decimal: true },
  ].filter(i => i.val > 0.001);

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
          {item.icon}
          <span>{item.decimal ? Number(item.val.toFixed(2)) : Math.round(item.val)}</span>
        </div>
      ))}
    </div>
  );
};

const InputField = ({ label, value, onChange, icon, step = "any" }: { label: string, value: number, onChange: (v: number) => void, icon: React.ReactNode, step?: string }) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    if (Number(localValue) !== value) setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (val === "") {
      onChange(0);
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) onChange(parsed);
  };

  return (
    <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 shadow-sm flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs uppercase tracking-wide truncate">
        {icon}
        {label}
      </div>
      <input 
        type="number" 
        min="0" 
        step={step}
        value={localValue}
        onChange={handleChange}
        onBlur={() => setLocalValue(value.toString())}
        placeholder="0"
        className="bg-transparent text-white text-base font-bold p-0 border-none focus:outline-none focus:ring-0 placeholder-slate-600 w-full"
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [category, setCategory] = useState<Category>("WEAPON");
  const [config, setConfig] = useState<Record<Category, { targetLevel: number, prices: Prices }>>({
    WEAPON: { targetLevel: 7, prices: { item: 1000, normalStone: 1, ivaldiStone: 140, andvariStone: 50 } },
    SECONDARY_WEAPON: { targetLevel: 7, prices: { item: 1000, normalStone: 1, ivaldiStone: 140, andvariStone: 50 } },
    ARMOR: { targetLevel: 7, prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 } },
    GAITER: { targetLevel: 7, prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 } },
    CLOAK: { targetLevel: 7, prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 } },
    ACCESSORY: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    BELT: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    WHISTLE: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    INSIGNIA: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    BRACER_SHOULDER: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    CHARM: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
    BROOCH_BUCKLE: { targetLevel: 5, prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 } },
  });

  const [strategies, setStrategies] = useState<StrategyResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { targetLevel, prices } = config[category];

  useEffect(() => {
    const results = getStrategies(targetLevel, prices, category);
    setStrategies(results);
  }, [prices, targetLevel, category]);

  const updatePrice = (key: keyof Prices, val: number) => {
    setConfig(prev => ({
      ...prev,
      [category]: { ...prev[category], prices: { ...prev[category].prices, [key]: val } }
    }));
  };

  const updateTargetLevel = (val: number) => {
    setConfig(prev => ({
      ...prev,
      [category]: { ...prev[category], targetLevel: val }
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getCategoryName = () => {
    switch (category) {
      case "WEAPON": return "무기";
      case "SECONDARY_WEAPON": return "보조 무기";
      case "ARMOR": return "방어구";
      case "GAITER": return "각반";
      case "CLOAK": return "망토";
      case "ACCESSORY": return "장신구";
      case "BELT": return "벨트";
      case "WHISTLE": return "호각";
      case "INSIGNIA": return "문장";
      case "BRACER_SHOULDER": return "완장/견장";
      case "CHARM": return "부적/펜던트";
      case "BROOCH_BUCKLE": return "브로치/버클";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 p-1.5 rounded-lg text-slate-900">
                <Calculator className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">오딘 강화 계산기</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
            {[
              { id: "WEAPON", icon: <Sword className="w-3 h-3" />, label: "무기" },
              { id: "SECONDARY_WEAPON", icon: <Swords className="w-3 h-3" />, label: "보조무기" },
              { id: "ARMOR", icon: <Shield className="w-3 h-3" />, label: "방어구" },
              { id: "GAITER", icon: <Footprints className="w-3 h-3" />, label: "각반" },
              { id: "CLOAK", icon: <Wind className="w-3 h-3" />, label: "망토" },
              { id: "ACCESSORY", icon: <Gem className="w-3 h-3" />, label: "장신구" },
              { id: "BELT", icon: <Navigation className="w-3 h-3" />, label: "벨트" },
              { id: "WHISTLE", icon: <Music className="w-3 h-3" />, label: "호각" },
              { id: "INSIGNIA", icon: <Award className="w-3 h-3" />, label: "문장" },
              { id: "BRACER_SHOULDER", icon: <CircleUser className="w-3 h-3" />, label: "완장/견장" },
              { id: "CHARM", icon: <WandSparkles className="w-3 h-3" />, label: "부적/펜던트" },
              { id: "BROOCH_BUCKLE", icon: <Component className="w-3 h-3" />, label: "브로치/버클" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as Category)}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${category === tab.id ? "bg-slate-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl px-4 py-6 space-y-6 flex-1">
        {/* Input Section */}
        <section className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <InputField label="목표 강화" value={targetLevel} onChange={updateTargetLevel} step="1" icon={<Hammer className="w-3 h-3 text-amber-500" />} />
            <InputField label={`${getCategoryName()} 시세`} value={prices.item} onChange={v => updatePrice("item", v)} icon={<Gem className="w-3 h-3 text-cyan-400" />} />
            <InputField label="일반석" value={prices.normalStone} onChange={v => updatePrice("normalStone", v)} icon={<Coins className="w-3 h-3 text-slate-400" />} />
            <InputField label="이발디" value={prices.ivaldiStone} onChange={v => updatePrice("ivaldiStone", v)} icon={<CircleArrowUp className="w-3 h-3 text-purple-400" />} />
            <InputField label="안드바리" value={prices.andvariStone} onChange={v => updatePrice("andvariStone", v)} icon={<Shield className="w-3 h-3 text-green-400" />} />
          </div>
        </section>

        {/* Strategies Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {getCategoryName()} 효율 순위 (비용 낮은 순)
            </h2>
            <span className="text-[10px] text-slate-600">클릭하여 상세 보기</span>
          </div>

          <div className="space-y-2">
            {strategies.map((strategy, idx) => {
              const isOptimal = strategy.id === "optimal";
              const isExpanded = expandedId === strategy.id;
              
              return (
                <div 
                  key={strategy.id}
                  onClick={() => toggleExpand(strategy.id)}
                  className={`relative rounded-lg border transition-all duration-200 flex flex-col cursor-pointer overflow-hidden ${strategy.recommended ? "bg-slate-800 border-amber-500/50 shadow-md shadow-amber-900/10" : "bg-slate-900 border-slate-800 hover:bg-slate-800/50"}`}
                >
                  <div className="p-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`flex-shrink-0 w-6 mt-0.5 text-center font-mono font-bold ${strategy.recommended ? "text-amber-500" : "text-slate-600"}`}>
                        {isOptimal ? <WandSparkles className="w-4 h-4 mx-auto text-amber-400" /> : (strategies[0].id === "optimal" ? idx : idx + 1)}
                      </div>
                      <div className="flex flex-col min-w-0 w-full">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-bold truncate ${strategy.recommended ? "text-amber-100" : "text-slate-300"}`}>{strategy.title}</h3>
                          {strategy.recommended && <span className="text-[9px] font-bold text-slate-900 bg-amber-500 px-1.5 py-0.5 rounded leading-none">추천</span>}
                        </div>
                        <MaterialIcons counts={strategy.expectedMaterials} />
                        {!isOptimal && !strategy.recommended && <p className="text-[10px] text-slate-500 truncate mt-1">{strategy.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                      <div className="flex flex-col items-end">
                        <div className={`text-base font-mono font-bold tracking-tight ${strategy.recommended ? "text-amber-400" : "text-slate-400"}`}>
                          {new Intl.NumberFormat("ko-KR").format(strategy.totalCost)}
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-950/30 border-t border-slate-700/50 p-3 overflow-hidden"
                      >
                        {isOptimal && strategy.details ? (
                          <>
                            <div className="mb-3 px-1">
                              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Info className="w-3 h-3" />
                                단계별 상세 행동
                              </h4>
                              <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-800/50 text-slate-500 border-b border-slate-800">
                                      <th className="py-2 px-3 font-medium w-12 text-center">현재</th>
                                      <th className="py-2 px-3 font-medium">추천 행동</th>
                                      <th className="py-2 px-3 font-medium text-right">남은 재료</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {strategy.details.map((step, sIdx) => {
                                      const isIvaldi = step.action === "IVALDI";
                                      const isAndvari = step.action === "ANDVARI";
                                      return (
                                        <tr key={sIdx} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                                          <td className="py-2 px-3 text-center font-mono text-slate-400 font-bold border-r border-slate-800/50 align-middle">
                                            {step.level}강
                                          </td>
                                          <td className="py-2 px-3 align-middle">
                                            <div className="flex flex-col gap-1">
                                              <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border min-w-[60px] justify-center ${step.action === "NORMAL" ? "bg-slate-700/30 border-slate-600 text-slate-300" : isIvaldi ? "bg-purple-500/10 border-purple-500/30 text-purple-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                                                  {step.action === "NORMAL" ? "일반" : isIvaldi ? "이발디" : "안드바리"}
                                                </span>
                                                <span className={`text-[10px] font-mono ${isAndvari ? "text-red-400" : "text-amber-200/60"}`}>
                                                  {isAndvari ? "100%↓" : `${(step.successRate * 100).toFixed(0)}%`}
                                                </span>
                                              </div>
                                              <div className="text-[10px] text-slate-500 pl-1">
                                                {isIvaldi ? "대성공 시 +2강 점프" : isAndvari ? "확정 -1강 하락 (재시도용)" : "성공 시 +1강"}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="py-2 px-3 text-right align-middle">
                                            <MaterialIconsSmall counts={step.expectedMaterials} />
                                            <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                                              비용: {new Intl.NumberFormat("ko-KR").format(Math.round(step.cost))}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-400 px-1">
                            <p className="mb-2">
                              <span className="font-bold text-slate-300">전략 설명:</span> {strategy.description}
                            </p>
                            <div className="flex justify-between items-center py-2 border-t border-slate-800/50">
                              <span>예상 총 비용</span>
                              <span className="font-mono text-amber-400 text-sm font-bold">{new Intl.NumberFormat("ko-KR").format(strategy.totalCost)}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
