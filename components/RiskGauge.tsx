
import React from 'react';

interface RiskGaugeProps {
  value: number; // 0 to 1
  label: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, label }) => {
  const percentage = Math.round(value * 100);
  const strokeDasharray = `${percentage} ${100 - percentage}`;
  const color = percentage > 75 ? 'stroke-rose-500' : percentage > 50 ? 'stroke-amber-500' : 'stroke-primary';

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          className="stroke-slate-200 dark:stroke-slate-700"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        />
        <path
          className={`transition-all duration-500 ease-in-out ${color}`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="25"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{percentage}%</span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default RiskGauge;
