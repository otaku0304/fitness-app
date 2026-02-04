'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MacroItem {
    name: string;
    value: number;
    color: string;
}

interface MacrosCardProps {
    data: MacroItem[];
    totalCalories: number;
}

export const MacrosCard: React.FC<MacrosCardProps> = ({ data, totalCalories }) => {
    return (
        <div className="glass-card flex flex-col items-center justify-center p-6">
            <h3 className="text-lg font-bold text-slate-700 w-full text-left mb-4">Macronutrients</h3>

            <div className="w-full h-[200px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-700">{totalCalories.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 font-medium">kcal consumed</span>
                </div>
            </div>

            <div className="flex justify-around w-full mt-4">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-bold text-slate-600">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.value}g</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
