import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import GlassCard from '../ui/GlassCard';



const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0f172a] border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md z-50">
                <p className="text-gray-300 text-xs mb-1">{payload[0].name}</p>
                <p className="text-white text-sm font-bold">{payload[0].value} Calls</p>
            </div>
        );
    }
    return null;
};



const AnalyticsPieChart = ({ data }) => {
    // Fallback to empty/default if no data
    const chartData = data || [
        { name: 'No Data', value: 1, color: '#334155' }
    ];

    const totalCalls = chartData.reduce((a, b) => a + b.value, 0);

    const renderLegend = (props) => {
        const { payload } = props;
        const total = chartData.reduce((a, b) => a + b.value, 0);

        return (
            <ul className="flex flex-col gap-2 justify-center h-full pl-4 overflow-y-auto max-h-[220px] scrollbar-hide pr-2">
                {payload.map((entry, index) => {
                    const item = chartData.find(d => d.name === entry.value);
                    if (!item) return null;
                    const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                    return (
                        <li key={`item-${index}`} className="flex items-center justify-between gap-3 text-xs mb-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: entry.color, boxShadow: `0 0 8px ${entry.color}40` }}
                                />
                                <span className="text-gray-300 whitespace-nowrap">{entry.value}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold">{item.value}</span>
                                <span className="text-gray-500 text-[10px] w-6 text-right tabular-nums text-opacity-70">{percent}%</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <GlassCard hoverEffect={false} className="!p-5 h-full min-h-[300px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-base font-bold text-white">Call Distribution</h3>
                    <p className="text-xs text-gray-400">Detailed breakdown</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white leading-none">
                        {totalCalls >= 1000 ? `${(totalCalls / 1000).toFixed(1)}k` : totalCalls}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-1">Total Calls</p>
                </div>
            </div>

            <div className="w-full h-[220px] overflow-hidden relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="40%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Legend content={renderLegend} layout="vertical" verticalAlign="middle" align="right" width="45%" wrapperStyle={{ lineHeight: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default AnalyticsPieChart;
