
import { WEAPON_ENHANCEMENT_TABLE, ARMOR_ENHANCEMENT_TABLE, ACCESSORY_ENHANCEMENT_TABLE, SECONDARY_WEAPON_ENHANCEMENT_TABLE, GAITER_ENHANCEMENT_TABLE, CLOAK_ENHANCEMENT_TABLE, MAX_CALC_LEVEL } from '../constants';
import { Prices, ScenarioResult, StepDetail, MaterialCounts, EnhancementStep } from '../types';

// Helper to add two material counts
const addMats = (a: MaterialCounts, b: MaterialCounts): MaterialCounts => ({
  item: a.item + b.item,
  normal: a.normal + b.normal,
  ivaldi: a.ivaldi + b.ivaldi,
  andvari: a.andvari + b.andvari,
});

// Helper to scale material counts by probability
const scaleMats = (a: MaterialCounts, factor: number): MaterialCounts => ({
  item: a.item * factor,
  normal: a.normal * factor,
  ivaldi: a.ivaldi * factor,
  andvari: a.andvari * factor,
});

/**
 * Helper to determine if Option A is better than Option B.
 * STRICT Priority:
 * 1. Lower Cost (Absolute priority).
 * 2. If Cost is identical (within tiny epsilon), prefer lower Item count.
 */
const isBetter = (
  costA: number, matsA: number,
  costB: number, matsB: number
): boolean => {
  // Use a smaller epsilon for decision making, but large enough to ignore float noise
  const EPSILON = 1e-9;
  
  // If A is cheaper than B by more than epsilon, A is better.
  if (costA < costB - EPSILON) {
    return true;
  }
  // If A is more expensive than B by more than epsilon, A is worse.
  if (costA > costB + EPSILON) {
    return false;
  }

  // If we are here, costs are effectively equal. Break tie with materials.
  if (matsA < matsB - EPSILON) {
    return true;
  }
  if (matsA > matsB + EPSILON) {
    return false;
  }

  // If both are equal, stick with A (or default true)
  return true;
};

/**
 * Calculates cost and material counts for a specific policy.
 */
const calculateStrategyCost = (
  targetLevel: number,
  prices: Prices,
  policy: (level: number, currentCost: number, dp: number[]) => 'NORMAL' | 'IVALDI' | 'ANDVARI' | 'OPTIMAL',
  table: EnhancementStep[],
  safeThreshold: number // Levels strictly below this are safe from break
): { cost: number; pathDescription?: string; details: StepDetail[]; totalMaterials: MaterialCounts } => {
  // DP Arrays
  const dp: number[] = new Array(MAX_CALC_LEVEL + 2).fill(0);
  const matDp: MaterialCounts[] = new Array(MAX_CALC_LEVEL + 2).fill(null).map(() => ({ item: 0, normal: 0, ivaldi: 0, andvari: 0 }));
  const decisions: string[] = new Array(MAX_CALC_LEVEL + 1).fill('');
  
  // Increased iterations and tightened epsilon for higher precision
  const MAX_ITERATIONS = 50000;
  const CONVERGENCE_THRESHOLD = 1e-7; 

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const prevDp0 = dp[0];
    const prevMatItem0 = matDp[0].item;
    
    const breakCost = prices.item + dp[0];
    const breakMats = addMats({ item: 1, normal: 0, ivaldi: 0, andvari: 0 }, matDp[0]);

    for (let i = targetLevel - 1; i >= 0; i--) {
      const stats = table.find((s) => s.level === i);
      if (!stats) continue;

      const isSafe = i < safeThreshold;
      let action = policy(i, 0, dp);
      
      // --- Calculation Functions ---

      // 1. Normal Enhancement
      const calcNormal = () => {
        const cost = isSafe 
          ? prices.normalStone + dp[i + 1]
          : prices.normalStone + (stats.successRate * dp[i + 1]) + (stats.breakRate * breakCost);
        
        const currentUsage: MaterialCounts = { item: 0, normal: 1, ivaldi: 0, andvari: 0 };
        let expectedFuture: MaterialCounts;
        
        if (isSafe) {
           expectedFuture = matDp[i + 1];
        } else {
           const successPart = scaleMats(matDp[i + 1], stats.successRate);
           const breakPart = scaleMats(breakMats, stats.breakRate);
           expectedFuture = addMats(successPart, breakPart);
        }
        return { cost, materials: addMats(currentUsage, expectedFuture) };
      };

      // 2. Ivaldi Enhancement
      // Logic: Success Rate * Plus2 Rate = Real Jump Probability
      const calcIvaldi = () => {
        const nextLevelJump = Math.min(i + 2, targetLevel);
        const nextLevelNormal = i + 1;
        
        // Probability Calculation based on game rules:
        // Total Success = stats.successRate
        // Jump (+2) = Total Success * stats.plus2SuccessRate
        // Normal (+1) = Total Success * (1 - stats.plus2SuccessRate)
        const probJump = stats.successRate * stats.plus2SuccessRate;
        const probNormal = stats.successRate * (1 - stats.plus2SuccessRate);
        const probBreak = stats.breakRate; // Should equal 1 - stats.successRate

        let cost = 0;
        let expectedFuture: MaterialCounts;
        const currentUsage: MaterialCounts = { item: 0, normal: 0, ivaldi: 1, andvari: 0 };

        if (isSafe) {
           // Safe: Fail is impossible (Success=1.0), so Break is 0.
           cost = prices.ivaldiStone + 
                  (probJump * dp[nextLevelJump]) + 
                  (probNormal * dp[nextLevelNormal]);
           
           const jumpPart = scaleMats(matDp[nextLevelJump], probJump);
           const normalPart = scaleMats(matDp[nextLevelNormal], probNormal);
           expectedFuture = addMats(jumpPart, normalPart);
        } else {
           // Unsafe
           cost = prices.ivaldiStone + 
                  (probJump * dp[nextLevelJump]) + 
                  (probNormal * dp[nextLevelNormal]) + 
                  (probBreak * breakCost);

           const jumpPart = scaleMats(matDp[nextLevelJump], probJump);
           const normalPart = scaleMats(matDp[nextLevelNormal], probNormal);
           const breakPart = scaleMats(breakMats, probBreak);
           
           expectedFuture = addMats(addMats(jumpPart, normalPart), breakPart);
        }
        return { cost, materials: addMats(currentUsage, expectedFuture) };
      };

      // 3. Andvari Enhancement
      const calcAndvari = () => {
        // Prevent using Andvari at level 0 (cannot go below 0)
        if (i === 0) return { cost: Infinity, materials: matDp[0] }; 
        
        // Andvari cost = Stone Price + Cost of (Level - 1)
        // Note: In an iterative loop, dp[i-1] uses the value from the current or previous iteration.
        // Since we loop i from target down to 0, dp[i-1] hasn't been updated in this iteration yet,
        // so it represents the cost from the previous iteration. This is standard Gauss-Seidel or Jacobi-like iteration.
        const cost = prices.andvariStone + dp[i - 1];
        
        const currentUsage: MaterialCounts = { item: 0, normal: 0, ivaldi: 0, andvari: 1 };
        const expectedFuture = matDp[i - 1]; 
        
        return { cost, materials: addMats(currentUsage, expectedFuture) };
      };

      // --- Decision Logic ---
      let chosenRes = { cost: 0, materials: matDp[i] };
      let chosenStr = 'NORMAL';

      if (action === 'OPTIMAL') {
        const resNormal = calcNormal();
        let bestRes = resNormal;
        chosenStr = 'NORMAL';

        const resIvaldi = calcIvaldi();
        if (isBetter(resIvaldi.cost, resIvaldi.materials.item, bestRes.cost, bestRes.materials.item)) {
          bestRes = resIvaldi;
          chosenStr = 'IVALDI';
        }

        if (i > 0) {
          const resAndvari = calcAndvari();
          if (isBetter(resAndvari.cost, resAndvari.materials.item, bestRes.cost, bestRes.materials.item)) {
             bestRes = resAndvari;
             chosenStr = 'ANDVARI';
          }
        }
        chosenRes = bestRes;

      } else if (action === 'IVALDI') {
        chosenRes = calcIvaldi();
        chosenStr = 'IVALDI';
      } else if (action === 'ANDVARI') {
        chosenRes = calcAndvari();
        chosenStr = 'ANDVARI';
      } else {
        chosenRes = calcNormal();
        chosenStr = 'NORMAL';
      }

      dp[i] = chosenRes.cost;
      matDp[i] = chosenRes.materials;
      decisions[i] = chosenStr;
    }

    // Check convergence with tighter threshold
    if (Math.abs(dp[0] - prevDp0) < CONVERGENCE_THRESHOLD && Math.abs(matDp[0].item - prevMatItem0) < CONVERGENCE_THRESHOLD) {
      break;
    }
  }

  const details: StepDetail[] = [];
  for(let i=0; i<targetLevel; i++) {
    const stats = table.find((s) => s.level === i);
    const action = decisions[i] as 'NORMAL' | 'IVALDI' | 'ANDVARI';
    let desc = '';
    let rate = stats ? stats.successRate : 0;

    if (action === 'NORMAL') {
      desc = '일반 강화';
    } else if (action === 'IVALDI') {
      const realJumpRate = stats ? (stats.successRate * stats.plus2SuccessRate * 100).toFixed(1) : 0;
      desc = `이발디 (대성공 ${realJumpRate}% 노림)`;
    } else if (action === 'ANDVARI') {
      desc = '안드바리 (강화 다운: -1강)';
      rate = 1.0; 
    }

    details.push({
      level: i,
      action,
      cost: dp[i],
      description: desc,
      successRate: rate,
      expectedMaterials: matDp[i]
    });
  }

  let pathDescription = '최적 경로 계산 완료';
  // Simple heuristic for description
  if (decisions[4] === 'IVALDI' && decisions[5] === 'ANDVARI') {
    pathDescription = '4강 이발디 ↔ 5강 안드바리 반복';
  } else if (decisions[0] === 'IVALDI' && decisions[1] === 'ANDVARI') {
    pathDescription = '0강 이발디 ↔ 1강 안드바리 반복';
  } else {
     const strategies = new Set(decisions.slice(0, targetLevel));
     if (strategies.has('ANDVARI')) {
       pathDescription = '안드바리 다운 & 재시도 혼합';
     } else if (strategies.has('IVALDI')) {
       const ivaldiLevels = decisions.map((d, idx) => d === 'IVALDI' ? idx : -1).filter(idx => idx !== -1);
       if (ivaldiLevels.length === 1 && ivaldiLevels[0] === 0) {
         pathDescription = '0강만 이발디 (2강 점프)';
       } else {
         pathDescription = '구간별 이발디/일반 스위칭';
       }
     } else {
       pathDescription = '전 구간 일반 강화 추천';
     }
  }

  const totalMaterials = addMats({ item: 1, normal: 0, ivaldi: 0, andvari: 0 }, matDp[0]);

  return { cost: dp[0], pathDescription, details, totalMaterials };
};

export const calculateEfficiency = (
  targetLevel: number,
  prices: Prices,
  itemType: 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'SECONDARY_WEAPON' | 'GAITER' | 'CLOAK' = 'WEAPON'
): ScenarioResult[] => {
  
  let table = WEAPON_ENHANCEMENT_TABLE;
  let safeThreshold = 5; // Default for Weapon/Armor (0-4 safe, 5 dangerous)

  if (itemType === 'ARMOR') {
    table = ARMOR_ENHANCEMENT_TABLE;
    safeThreshold = 5;
  } else if (itemType === 'ACCESSORY') {
    table = ACCESSORY_ENHANCEMENT_TABLE;
    safeThreshold = 1; // Only 0->1 is safe. 1->2 is dangerous.
  } else if (itemType === 'SECONDARY_WEAPON') {
    table = SECONDARY_WEAPON_ENHANCEMENT_TABLE;
    safeThreshold = 1; // Only 0->1 is safe.
  } else if (itemType === 'GAITER') {
    table = GAITER_ENHANCEMENT_TABLE;
    safeThreshold = 1; // Only 0->1 is safe.
  } else if (itemType === 'CLOAK') {
    table = CLOAK_ENHANCEMENT_TABLE;
    safeThreshold = 1; // Only 0->1 is safe.
  }

  const allStrategies: { id: string; name: string; desc: string; startLvl: number; policy: any }[] = [
    { id: 'normal', name: '일반 깡강화', desc: '모든 구간 일반 강화.', startLvl: 0, policy: () => 'NORMAL' as const },
    { id: 'optimal', name: '스마트 최적화 (AI)', desc: '가격 기반 자동 최적화', startLvl: 0, policy: () => 'OPTIMAL' as const },
  ];

  if (itemType === 'ACCESSORY' || itemType === 'SECONDARY_WEAPON' || itemType === 'GAITER' || itemType === 'CLOAK') {
    // Strategy: Reset at level 1 to avoid break risk
    // 0 -> 1 is safe. 1 -> 2 is break.
    // Optimal strategy is usually: Use Ivaldi at 0 to jump to 2. If land on 1, use Andvari to go back to 0.
    allStrategies.push({
      id: 'resemara_0',
      name: '0강 리세 (1강 패스)',
      desc: '0강 이발디. 1강 안드바리 다운. 2강부터 이발디.',
      startLvl: 0,
      policy: (lvl: number) => {
        if (lvl === 0) return 'IVALDI' as const;
        if (lvl === 1) return 'ANDVARI' as const;
        if (lvl >= 2 && lvl <= targetLevel - 2) return 'IVALDI' as const;
        return 'NORMAL' as const;
      }
    });
    // Strategy: Use Ivaldi at 0 and 1
    allStrategies.push({
      id: 'ivaldi_0_1',
      name: '0,1강 이발디',
      desc: '0강과 1강 이발디. 2강부터 이발디.',
      startLvl: 0,
      policy: (lvl: number) => {
        if (lvl === 0 || lvl === 1) return 'IVALDI' as const;
        if (lvl >= 2 && lvl <= targetLevel - 2) return 'IVALDI' as const;
        return 'NORMAL' as const;
      }
    });
    // Strategy: Use Ivaldi at 1 (Skip L2 Hell)
    allStrategies.push({
      id: 'ivaldi1',
      name: '1강부터 이발디 (추천)',
      desc: '0강 일반. 1강 이발디(3강 점프 노림).',
      startLvl: 1,
      policy: (lvl: number) => {
        if (lvl === 1) return 'IVALDI' as const;
        if (lvl >= 2 && lvl <= targetLevel - 2) return 'IVALDI' as const;
        return 'NORMAL' as const;
      }
    });
    // Add Ivaldi strategies for higher levels if relevant
    allStrategies.push({ id: 'ivaldi2', name: '2강부터 이발디', desc: '2강부터 이발디 사용.', startLvl: 2, policy: (lvl: number) => (lvl >= 2 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
  } else {
    // Weapon/Armor specific strategies
    allStrategies.push({ id: 'ivaldi4', name: '4강부터 이발디', desc: '4강부터 쭉 이발디 사용.', startLvl: 4, policy: (lvl: number) => (lvl >= 4 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
    allStrategies.push({ id: 'ivaldi5', name: '5강부터 이발디', desc: '5강부터 이발디 사용.', startLvl: 5, policy: (lvl: number) => (lvl >= 5 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
    allStrategies.push({ id: 'ivaldi6', name: '6강부터 이발디', desc: '6강부터 이발디 사용.', startLvl: 6, policy: (lvl: number) => (lvl >= 6 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
    allStrategies.push({ id: 'ivaldi7', name: '7강부터 이발디', desc: '7강부터 이발디 사용.', startLvl: 7, policy: (lvl: number) => (lvl >= 7 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
    allStrategies.push({ id: 'ivaldi8', name: '8강부터 이발디', desc: '8강부터 이발디 사용.', startLvl: 8, policy: (lvl: number) => (lvl >= 8 && lvl <= targetLevel - 2) ? 'IVALDI' as const : 'NORMAL' as const });
    
    allStrategies.push({ 
      id: 'resemara', 
      name: '4강 리세 (5강→4강 다운)', 
      desc: '4강에서 이발디로 6강 점프를 노림. 5강이 되면 안드바리로 내려서 다시 시도.',
      startLvl: 4, 
      policy: (lvl: number) => {
        if (lvl === 4) return 'IVALDI' as const; 
        if (lvl === 5) return 'ANDVARI' as const; 
        if (lvl >= 6) return 'IVALDI' as const; 
        return 'NORMAL' as const;
      }
    });
  }

  const strategies = allStrategies.filter(s => {
    if (s.id === 'normal' || s.id === 'optimal' || s.id.startsWith('resemara') || s.id === 'ivaldi_0_1' || s.id === 'ivaldi1') return true;
    return s.startLvl <= targetLevel - 2;
  });

  const results: ScenarioResult[] = strategies.map(strat => {
    const res = calculateStrategyCost(targetLevel, prices, strat.policy, table, safeThreshold);
    return {
      id: strat.id,
      title: strat.name,
      description: strat.id === 'optimal' ? res.pathDescription || '계산 중...' : strat.desc,
      totalCost: Math.round(prices.item + res.cost),
      breakdown: {
        baseItem: prices.item,
        enhancement: Math.round(res.cost)
      },
      details: res.details,
      expectedMaterials: res.totalMaterials,
      recommended: false
    };
  });

  const minCost = Math.min(...results.map(r => r.totalCost));
  results.forEach(r => r.recommended = r.totalCost === minCost);

  results.sort((a, b) => {
    if (a.id === 'optimal') return -1;
    if (b.id === 'optimal') return 1;
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return a.totalCost - b.totalCost;
  });

  return results;
};
