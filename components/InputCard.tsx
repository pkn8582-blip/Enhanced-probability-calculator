
import React, { useState, useEffect } from 'react';

interface InputCardProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
  step?: number | string;
}

export const InputCard: React.FC<InputCardProps> = ({ label, value, onChange, icon, step = "any" }) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    // Sync local value with parent value only if they are numerically different.
    // This allows the user to type "0." (numerically 0) without it being reset to "0" by the parent.
    // We compare with the parsed local value.
    if (Number(localValue) !== value) {
      setLocalValue(value.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    
    if (newVal === '') {
      onChange(0);
      return;
    }
    
    const num = parseFloat(newVal);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
     // On blur, force sync to ensure formatting is correct (e.g. removing trailing dots)
     setLocalValue(value.toString());
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
        onBlur={handleBlur}
        placeholder="0"
        className="bg-transparent text-white text-base font-bold p-0 border-none focus:outline-none focus:ring-0 placeholder-slate-600 w-full"
      />
    </div>
  );
};
