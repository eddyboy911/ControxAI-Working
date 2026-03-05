import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';

const data = [
    { name: 'Mon', calls: 400, cost: 240 },
    { name: 'Tue', calls: 300, cost: 139 },
    { name: 'Wed', calls: 200, cost: 980 },
    { name: 'Thu', calls: 278, cost: 390 },
    { name: 'Fri', calls: 189, cost: 480 },
    { name: 'Sat', calls: 239, cost: 380 },
    { name: 'Sun', calls: 349, cost: 430 },
];

const CustomTooltip = ({ active, payload, label, currency }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
                <p className="text-gray-300 text-sm mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-cyan-400 text-sm font-bold">Calls: {payload[0].value}</p>
                    <p className="text-[#0044CE] text-sm font-bold">Cost: {currency.symbol}{payload[1].value}</p>
                </div>
            </div>
        );
    }
    return null;
};

const AnalyticsChart = ({ currency, customData }) => {
    const chartData = customData || data;

    return (
        <GlassCard hoverEffect={false} className="!p-6 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-base font-bold text-white">Call Analytics</h3>
                    <p className="text-xs text-gray-400">Weekly call volume and cost analysis</p>
                </div>
                <select className="bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-cyan-500/50">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="flex-1 w-full h-[220px] overflow-hidden relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0044CE" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0044CE" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip
                            content={<CustomTooltip currency={currency} />}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            allowEscapeViewBox={{ x: false, y: false }}
                        />
                        <Area
                            type="monotone"
                            dataKey="calls"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCalls)"
                        />
                        <Area
                            type="monotone"
                            dataKey="cost"
                            stroke="#0044CE"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCost)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default AnalyticsChart;
