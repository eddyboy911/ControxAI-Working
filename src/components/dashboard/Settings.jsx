import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { User, Mail, Globe, Shield, Wallet, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal' },
    { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
];

const Settings = ({ currency, setCurrency }) => {
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    return (
        <div className="w-full space-y-8">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
            `}</style>

            {/* Profile List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <User size={18} className="text-cyan-400" />
                    Profile
                </h3>

                <div className="flex items-center gap-6 mb-6 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                        JD
                    </div>
                    <div>
                        <h4 className="text-white text-base font-medium">John Doe</h4>
                        <span className="text-xs text-gray-400">Administrator</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-400 w-24 shrink-0">Full Name</span>
                        <span className="text-white font-medium text-sm">John Doe</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-400 w-24 shrink-0">Email</span>
                        <span className="text-white font-medium text-sm">john.doe@controx.ai</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-400 w-24 shrink-0">Plan</span>
                        <div className="flex items-center gap-3">
                            <span className="text-white font-medium text-sm">Pro Plan</span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <Globe size={18} className="text-purple-400" />
                    Preferences
                </h3>

                <div className="relative">
                    {/* Trigger Bar */}
                    <button
                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-colors text-left"
                    >
                        <span className="text-sm text-gray-400 w-24 shrink-0">Currency</span>
                        <div className="flex-1 flex items-center justify-between">
                            <span className="text-white font-medium text-sm">
                                {currency.symbol} &nbsp; {currency.name}
                            </span>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {/* Backdrop for closing */}
                    {isCurrencyOpen && (
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsCurrencyOpen(false)} />
                    )}

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isCurrencyOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                onWheel={(e) => e.stopPropagation()}
                                className="absolute bottom-full left-0 w-full mb-2 bg-[#000103]/90 backdrop-blur-xl border border-white/10 rounded-xl z-[100] max-h-72 overflow-y-auto shadow-2xl shadow-black/50 custom-scrollbar"
                            >
                                <div className="p-1 space-y-1">
                                    {currencies.map(c => (
                                        <button
                                            key={c.code}
                                            onClick={() => {
                                                setCurrency(c);
                                                setIsCurrencyOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3 ${currency.code === c.code
                                                ? 'bg-cyan-500/10 text-cyan-400'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span className="w-6 text-center font-medium opacity-70">{c.symbol}</span>
                                            <span className="flex-1">{c.name}</span>
                                            {currency.code === c.code && <span className="text-[10px] font-bold">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
