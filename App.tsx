
import React, { useState, useEffect } from 'react';
import { calculateEfficiency } from './utils/calculator';
import { Prices, ScenarioResult, MaterialCounts } from './types';
import { InputCard } from './components/InputCard';
import { Hammer, Coins, Gem, Shield, Calculator, ArrowUpCircle, Wand2, TrendingUp, ChevronDown, Info, Sword, CircleDashed, Swords, Footprints, Component } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'SECONDARY_WEAPON' | 'GAITER' | 'CLOAK'>('WEAPON');
  
  // Store independent configurations for each mode
  const [configs, setConfigs] = useState<{
    WEAPON: { targetLevel: number; prices: Prices };
    ARMOR: { targetLevel: number; prices: Prices };
    ACCESSORY: { targetLevel: number; prices: Prices };
    SECONDARY_WEAPON: { targetLevel: number; prices: Prices };
    GAITER: { targetLevel: number; prices: Prices };
    CLOAK: { targetLevel: number; prices: Prices };
  }>({
    WEAPON: {
      targetLevel: 7,
      prices: { item: 1000, normalStone: 1, ivaldiStone: 140, andvariStone: 50 }
    },
    ARMOR: {
      targetLevel: 7,
      prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 }
    },
    ACCESSORY: {
      targetLevel: 5,
      prices: { item: 3000, normalStone: 0.2, ivaldiStone: 123, andvariStone: 290 }
    },
    SECONDARY_WEAPON: {
      targetLevel: 5,
      prices: { item: 1000, normalStone: 1, ivaldiStone: 140, andvariStone: 50 }
    },
    GAITER: {
      targetLevel: 5,
      prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 }
    },
    CLOAK: {
      targetLevel: 5,
      prices: { item: 1000, normalStone: 0.2, ivaldiStone: 12, andvariStone: 9 }
    }
  });

  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive current values from state
  const { targetLevel, prices } = configs[mode];

  useEffect(() => {
    const calcResults = calculateEfficiency(targetLevel, prices, mode);
    setResults(calcResults);
  }, [prices, targetLevel, mode]);

  const handlePriceChange = (key: keyof Prices, value: number) => {
    setConfigs(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        prices: { ...prev[mode].prices, [key]: value }
      }
    }));
  };

  const handleTargetLevelChange = (value: number) => {
    setConfigs(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        targetLevel: value
      }
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Helper to render materials compactly in the main card (With Decimals!)
  const CompactMaterialRow: React.FC<{ counts: MaterialCounts }> = ({ counts }) => {
    const items = [
      { icon: <Gem className="w-3 h-3 text-cyan-400" />, val: counts.item, color: 'text-cyan-100', showDecimal: true },
      { icon: <Coins className="w-3 h-3 text-slate-400" />, val: counts.normal, color: 'text-slate-300', showDecimal: false },
      { icon: <ArrowUpCircle className="w-3 h-3 text-purple-400" />, val: counts.ivaldi, color: 'text-purple-200', showDecimal: true },
      { icon: <Shield className="w-3 h-3 text-green-400" />, val: counts.andvari, color: 'text-green-200', showDecimal: true },
    ].filter(i => i.val > 0.001); // Filter out very small values

    return (
      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5">
        {items.map((i, idx) => (
          <div key={idx} className={`flex items-center gap-1 text-[11px] font-mono ${i.color}`}>
            {i.icon}
            <span className="font-bold">
              {i.showDecimal ? Number(i.val.toFixed(2)) : Math.round(i.val)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Helper for expanded table view
  const MaterialSummary: React.FC<{ counts: MaterialCounts }> = ({ counts }) => {
     const items = [
      { icon: <Gem className="w-3 h-3 text-cyan-400" />, val: counts.item, showDecimal: true },
      { icon: <Coins className="w-3 h-3 text-slate-400" />, val: counts.normal, showDecimal: false },
      { icon: <ArrowUpCircle className="w-3 h-3 text-purple-400" />, val: counts.ivaldi, showDecimal: true },
      { icon: <Shield className="w-3 h-3 text-green-400" />, val: counts.andvari, showDecimal: true },
    ].filter(i => i.val > 0.001);

    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-end">
        {items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
            {i.icon}
            <span>{i.showDecimal ? Number(i.val.toFixed(2)) : Math.round(i.val)}</span>
          </div>
        ))}
      </div>
    );
  }

  const getModeLabel = () => {
    switch(mode) {
      case 'WEAPON': return '무기';
      case 'SECONDARY_WEAPON': return '보조 무기';
      case 'ARMOR': return '방어구';
      case 'ACCESSORY': return '장신구';
      case 'GAITER': return '각반';
      case 'CLOAK': return '망토';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center">
      {/* Compact Header */}
      <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg text-slate-900">
              <Calculator className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">오딘 강화 계산기</h1>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
             <button 
               onClick={() => setMode('WEAPON')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'WEAPON' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Sword className="w-3 h-3" />
               <span className="hidden sm:inline">무기</span>
             </button>
             <button 
               onClick={() => setMode('SECONDARY_WEAPON')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'SECONDARY_WEAPON' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Swords className="w-3 h-3" />
               <span className="hidden sm:inline">보조무기</span>
             </button>
             <button 
               onClick={() => setMode('ARMOR')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'ARMOR' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Shield className="w-3 h-3" />
               <span className="hidden sm:inline">방어구</span>
             </button>
             <button 
               onClick={() => setMode('GAITER')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'GAITER' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Footprints className="w-3 h-3" />
               <span className="hidden sm:inline">각반</span>
             </button>
             <button 
               onClick={() => setMode('CLOAK')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'CLOAK' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Component className="w-3 h-3" />
               <span className="hidden sm:inline">망토</span>
             </button>
             <button 
               onClick={() => setMode('ACCESSORY')}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                 mode === 'ACCESSORY' 
                 ? 'bg-slate-600 text-white shadow-sm' 
                 : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <CircleDashed className="w-3 h-3" />
               <span className="hidden sm:inline">장신구</span>
             </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl px-4 py-6 space-y-6 flex-1">
        
        {/* Compact Input Grid */}
        <section className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/60 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <InputCard
              label="목표 강화"
              value={targetLevel}
              onChange={handleTargetLevelChange}
              step={1}
              icon={<Hammer className="w-3 h-3 text-amber-500" />}
            />
            <InputCard
              label={`${getModeLabel()} 시세`}
              value={prices.item}
              onChange={(val) => handlePriceChange('item', val)}
              icon={<Gem className="w-3 h-3 text-cyan-400" />}
            />
            <InputCard
              label="일반석"
              value={prices.normalStone}
              onChange={(val) => handlePriceChange('normalStone', val)}
              icon={<Coins className="w-3 h-3 text-slate-400" />}
            />
            <InputCard
              label="이발디"
              value={prices.ivaldiStone}
              onChange={(val) => handlePriceChange('ivaldiStone', val)}
              icon={<ArrowUpCircle className="w-3 h-3 text-purple-400" />}
            />
            <InputCard
              label="안드바리"
              value={prices.andvariStone}
              onChange={(val) => handlePriceChange('andvariStone', val)}
              icon={<Shield className="w-3 h-3 text-green-400" />}
            />
          </div>
        </section>

        {/* Results List */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {getModeLabel()} 효율 순위 (비용 낮은 순)
            </h2>
            <span className="text-[10px] text-slate-600">클릭하여 상세 보기</span>
          </div>
          
          <div className="space-y-2">
            {results.map((result, index) => {
              const isOptimal = result.id === 'optimal';
              const isExpanded = expandedId === result.id;
              
              return (
                <div 
                  key={result.id}
                  onClick={() => toggleExpand(result.id)}
                  className={`relative rounded-lg border transition-all duration-200 flex flex-col cursor-pointer overflow-hidden
                    ${result.recommended 
                      ? 'bg-slate-800 border-amber-500/50 shadow-md shadow-amber-900/10' 
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800/50'
                    }`}
                >
                  <div className="p-3 flex items-start justify-between gap-3">
                     {/* Left: Rank & Title & Materials */}
                     <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-6 mt-0.5 text-center font-mono font-bold ${result.recommended ? 'text-amber-500' : 'text-slate-600'}`}>
                          {isOptimal ? <Wand2 className="w-4 h-4 mx-auto text-amber-400" /> : (isOptimal ? '-' : (results[0].id === 'optimal' ? index : index + 1))}
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col min-w-0 w-full">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-bold truncate ${result.recommended ? 'text-amber-100' : 'text-slate-300'}`}>
                              {result.title}
                            </h3>
                            {result.recommended && (
                               <span className="text-[9px] font-bold text-slate-900 bg-amber-500 px-1.5 py-0.5 rounded leading-none">
                                 추천
                               </span>
                            )}
                          </div>
                          
                          {/* Materials Row (Visible Always) */}
                          <CompactMaterialRow counts={result.expectedMaterials} />

                          {/* Short Description (Only for non-optimal or if needed) */}
                          {!isOptimal && !result.recommended && (
                            <p className="text-[10px] text-slate-500 truncate mt-1">{result.description}</p>
                          )}
                        </div>
                     </div>

                     {/* Right: Cost & Arrow */}
                     <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                       <div className="flex flex-col items-end">
                          <div className={`text-base font-mono font-bold tracking-tight ${result.recommended ? 'text-amber-400' : 'text-slate-400'}`}>
                            {new Intl.NumberFormat('ko-KR').format(result.totalCost)}
                          </div>
                       </div>
                       <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                     </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="bg-slate-950/30 border-t border-slate-700/50 p-3 animate-in slide-in-from-top-2 duration-200">
                      {isOptimal && result.details ? (
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
                                  {result.details.map((step) => {
                                    // Highlight logic
                                    const canJump = step.action === 'IVALDI';
                                    const isDowngrade = step.action === 'ANDVARI';
                                    
                                    return (
                                    <tr key={step.level} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                                      <td className="py-2 px-3 text-center font-mono text-slate-400 font-bold border-r border-slate-800/50 align-middle">
                                        {step.level}강
                                      </td>
                                      <td className="py-2 px-3 align-middle">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border min-w-[60px] justify-center ${
                                                step.action === 'NORMAL' ? 'bg-slate-700/30 border-slate-600 text-slate-300' :
                                                step.action === 'IVALDI' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' :
                                                'bg-red-500/10 border-red-500/30 text-red-300'
                                              }`}>
                                                {step.action === 'NORMAL' ? '일반' : step.action === 'IVALDI' ? '이발디' : '안드바리'}
                                              </span>
                                              <span className={`text-[10px] font-mono ${isDowngrade ? 'text-red-400' : 'text-amber-200/60'}`}>
                                                 {isDowngrade ? '100%↓' : `${(step.successRate * 100).toFixed(0)}%`}
                                              </span>
                                          </div>
                                          <div className="text-[10px] text-slate-500 pl-1">
                                            {canJump ? '대성공 시 +2강 점프' : isDowngrade ? '확정 -1강 하락 (재시도용)' : '성공 시 +1강'}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-2 px-3 text-right align-middle">
                                        <MaterialSummary counts={step.expectedMaterials} />
                                        <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                                          비용: {new Intl.NumberFormat('ko-KR').format(Math.round(step.cost))}
                                        </div>
                                      </td>
                                    </tr>
                                  )})}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 px-1">
                          <p className="mb-2"><span className="font-bold text-slate-300">전략 설명:</span> {result.description}</p>
                          <div className="flex justify-between items-center py-2 border-t border-slate-800/50">
                            <span>예상 총 비용</span>
                            <span className="font-mono text-amber-400 text-sm font-bold">{new Intl.NumberFormat('ko-KR').format(result.totalCost)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
