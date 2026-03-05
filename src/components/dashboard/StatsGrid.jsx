import React from 'react';
import GlassCard from '../ui/GlassCard';
import { PhoneCall, Clock, DollarSign, TrendingUp } from 'lucide-react';

import { motion } from 'framer-motion';

const StatsGrid = ({ currency, stats }) => {
    // Fallback if stats is not provided or empty
    const displayStats = (stats && stats.length > 0) ? stats : [
        { label: "Total Calls", value: "0", change: "+0%", icon: PhoneCall, color: "text-cyan-400" },
        { label: "Total Duration", value: "0m 0s", change: "+0%", icon: Clock, color: "text-purple-400" },
        { label: "Total Cost", value: `${currency.symbol}0.00`, change: "+0%", icon: currency.symbol, color: "text-green-400" },
        { label: "Avg Cost / Call", value: `${currency.symbol}0.00`, change: "+0%", icon: TrendingUp, color: "text-pink-400" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.2, duration: 0.5 }}
                >
                    <GlassCard
                        className="!p-5 flex items-center justify-between backdrop-blur-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-white/10 to-transparent shadow-lg shadow-black/20"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white shadow-inner">
                                {typeof stat.icon === 'string' ? (
                                    <span className="text-xl font-bold text-gray-200">{stat.icon}</span>
                                ) : (
                                    <stat.icon size={22} className="text-gray-200" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-400 text-[10px] font-medium mb-0.5 tracking-wide uppercase">{stat.label}</h3>
                                <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stat.change.startsWith('+')
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {stat.change}
                        </span>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsGrid;
