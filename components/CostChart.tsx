
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface ChartLineConfig {
  key: string;
  name: string;
  color: string;
  width?: number;
}

interface CostChartProps {
  data: any[];
  lines: ChartLineConfig[];
}

export const CostChart: React.FC<CostChartProps> = ({ data, lines }) => {
  const formatMoney = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(1)}만`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-sm backdrop-blur-sm">
       <h2 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
        아이템 가격별 효율 구간 (손익분기점)
      </h2>
      <div className="h-[300px] w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="price" 
              stroke="#94a3b8" 
              tickFormatter={formatMoney} 
              label={{ value: '아이템 시세', position: 'insideBottom', offset: -5, fill: '#64748b' }} 
            />
            <YAxis 
              stroke="#94a3b8" 
              tickFormatter={formatMoney}
              width={60}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#e2e8f0' }}
              formatter={(value: number) => new Intl.NumberFormat('ko-KR').format(Math.round(value))}
              labelFormatter={(label) => `아이템 시세: ${new Intl.NumberFormat('ko-KR').format(label)}`}
            />
            <Legend verticalAlign="top" height={36}/>
            
            {lines.map((line) => (
              <Line 
                key={line.key}
                type="monotone" 
                dataKey={line.key} 
                name={line.name} 
                stroke={line.color} 
                strokeWidth={line.width || 2} 
                dot={false} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center">
        * 아이템 가격이 비쌀수록 파괴를 피하는 리세마라/이발디 효율이 급상승합니다.
      </p>
    </div>
  );
};
