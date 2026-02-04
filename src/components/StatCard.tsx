import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string; // e.g., "text-blue-500"
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon: Icon, trend, color = "text-slate-800" }) => {
  return (
    <div className="glass-card flex flex-col justify-between h-full animate-fade-in hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
            {unit && <span className="text-slate-400 text-sm font-semibold">{unit}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-auto">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-slate-400 text-xs">vs last week</span>
        </div>
      )}
    </div>
  );
};
