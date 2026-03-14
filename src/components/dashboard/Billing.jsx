import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MoreHorizontal,
    ExternalLink,
    DollarSign,
    Clock,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';

const Billing = ({ currency, calls = [] }) => {
    const [activeTab, setActiveTab] = useState('Usage');
    const [usagePeriod] = useState('Mar 01, 2026 - Mar 06, 2026');
    const [chartFilter, setChartFilter] = useState('Day');

    // Process Usage Data from allCalls
    const usageStats = useMemo(() => {
        let totalCost = 0;
        let totalSeconds = 0;

        calls.forEach(call => {
            totalCost += Number(call.cost || 0);
            totalSeconds += Number(call.duration_seconds || 0);
        });

        const totalMinutes = Math.round(totalSeconds / 60);
        const avgCostPerMin = totalMinutes > 0 ? totalCost / totalMinutes : 0;

        return {
            totalCost: totalCost.toFixed(2),
            totalMinutes,
            avgCostPerMin: avgCostPerMin.toFixed(2)
        };
    }, [calls]);

    // Real Chart Data for "Call + Chat Cost"
    const chartData = useMemo(() => {
        if (!calls || calls.length === 0) return [];
        
        const graphMap = new Map();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let filterDate = new Date(todayStart);
        let numDays = chartFilter === 'Day' ? 7 : 30; // 7 days for 'Day', 30 days for 'Week'
        filterDate.setDate(filterDate.getDate() - (numDays - 1));

        for (let i = 0; i < numDays; i++) {
            const d = new Date(filterDate);
            d.setDate(d.getDate() + i);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            graphMap.set(label, { name: label, cost: 0, date: new Date(d) });
        }

        calls.forEach(call => {
            const callDate = new Date(call.started_at || call.created_at);
            if (callDate >= filterDate) {
                const label = callDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (graphMap.has(label)) {
                    const d = graphMap.get(label);
                    d.cost += Number(call.cost || 0);
                }
            }
        });

        return Array.from(graphMap.values())
            .sort((a, b) => a.date - b.date)
            .map(item => ({ name: item.name, cost: Number(item.cost.toFixed(2)) }));
    }, [calls, chartFilter]);

    const historyData = [
        { id: 'INV-001', date: 'Mar 01, 2026', amount: '$50.00', status: 'Paid' },
        { id: 'INV-002', date: 'Feb 01, 2026', amount: '$42.50', status: 'Paid' },
        { id: 'INV-003', date: 'Jan 01, 2026', amount: '$38.20', status: 'Paid' },
    ];

    return (
        <div className="w-full space-y-5">

            {/* Tabs Row */}
            <div className="flex items-center gap-8 border-b border-white/5">
                {['Billing History', 'Usage'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-bold relative ${activeTab === tab
                            ? 'text-white'
                            : 'text-gray-500'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeBillingTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'Usage' ? (
                    <motion.div
                        key="usage"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Usage Period Selector */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 w-fit">
                            <Calendar size={14} className="text-cyan-400" />
                            <span className="text-xs text-blue-100 font-medium">Usage Period</span>
                            <span className="text-xs text-blue-400 font-bold">{usagePeriod}</span>
                        </div>

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Cost', value: `${currency.symbol}${usageStats.totalCost}`, icon: DollarSign, color: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400' },
                                { label: 'Call Minutes', value: `${usageStats.totalMinutes} mins`, icon: Clock, color: 'from-cyan-500/20 to-blue-600/5', iconColor: 'text-cyan-400' },
                                { label: 'Average Cost Per Minute', value: `${currency.symbol}${usageStats.avgCostPerMin}`, icon: TrendingUp, color: 'from-purple-500/20 to-pink-600/5', iconColor: 'text-purple-400' }
                            ].map((stat, i) => (
                                <GlassCard key={i} className="p-4 relative overflow-hidden">
                                    <div className="relative flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                                            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.iconColor}`}>
                                                <stat.icon size={16} />
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h4>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>

                        {/* Main Charts area */}
                        <div className="w-full">
                            {/* Call + Chat Cost Chart */}
                            <GlassCard className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">Call + Chat Cost</h3>
                                        <p className="text-xs text-gray-500 mt-1">Daily expenditure breakdown</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-white/10 shadow-lg">
                                        {['Day', 'Week'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setChartFilter(opt)}
                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${chartFilter === opt
                                                    ? 'bg-[#0044CE] text-white shadow-lg shadow-blue-900/40'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-[200px] w-full mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0044CE" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#0044CE" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#475569"
                                                tick={{ fontSize: 10 }}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="#475569"
                                                tick={{ fontSize: 10 }}
                                                axisLine={false}
                                                tickLine={false}
                                                dx={-10}
                                                tickFormatter={(v) => `${currency.symbol}${v}`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="cost"
                                                stroke="#0044CE"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#billingGradient)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Invoice ID</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {historyData.map((item) => (
                                    <tr key={item.id} className="transition-colors">
                                        <td className="px-4 py-3 text-sm font-bold text-white">{item.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{item.date}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-white">{item.amount}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-cyan-400 p-2 rounded-lg bg-white/5">
                                                <ExternalLink size={16} />
                                            </button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Billing;
