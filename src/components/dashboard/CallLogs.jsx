import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Search, Filter, PhoneIncoming, PhoneOutgoing, Clock, Calendar, DollarSign, ExternalLink, ChevronDown, ChevronUp, User, Globe, Tag, FileText, Download, Zap, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CallLogs = ({ currency, calls, loading }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [timeFilter, setTimeFilter] = React.useState('All');
    const [selectedCall, setSelectedCall] = React.useState(null);
    const [activeTranscript, setActiveTranscript] = React.useState(null);

    const getFilteredCalls = () => {
        if (!calls) return [];

        return calls.filter(call => {
            const matchesSearch = (call.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (call.number || "").toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;
            if (timeFilter === 'All') return true;

            const callDate = new Date(call.created_at);
            if (isNaN(callDate.getTime())) return false; // Invalid date

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            if (timeFilter === 'Today') {
                return callDate >= today;
            }

            if (timeFilter === 'Weekly') {
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);
                return callDate >= lastWeek;
            }

            if (timeFilter === 'Monthly') {
                const lastMonth = new Date(today);
                lastMonth.setDate(lastMonth.getDate() - 30);
                return callDate >= lastMonth;
            }

            return true;
        });
    };

    const filteredCalls = getFilteredCalls();

    const timeOptions = ['All', 'Today', 'Weekly', 'Monthly'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            type="text"
                            placeholder="Search calls..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-white/10">
                        {timeOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => setTimeFilter(option)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${timeFilter === option
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <GlassCard hoverEffect={false} className="!p-0 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-400 border-b border-white/5 bg-white/[0.02]">
                                <th className="py-4 px-6 font-medium border-r border-white/10">Caller</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Status</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Sentiment</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Duration</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Cost</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Time</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10">Date</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10 text-center">Recording</th>
                                <th className="py-4 px-4 font-medium border-r border-white/10 text-center">Transcript</th>
                                <th className="py-4 px-6 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="py-20 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                                        <p className="mt-4 text-gray-400">Loading call history...</p>
                                    </td>
                                </tr>
                            ) : filteredCalls.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="py-20 text-center text-gray-500">
                                        <Phone className="mx-auto mb-4 opacity-20" size={48} />
                                        <p>No call logs found matching your criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCalls.map((call) => (
                                    <tr key={call.id} className={`group hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 ${selectedCall?.id === call.id ? 'bg-white/[0.03]' : ''}`}>
                                        <td className="py-4 px-6 border-r border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${call.type === 'incoming'
                                                    ? 'bg-blue-500/10 text-blue-400'
                                                    : 'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                    {call.type === 'incoming' ? <PhoneIncoming size={18} /> : <PhoneOutgoing size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white leading-tight">{call.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{call.number}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 border-r border-white/5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${call.status === 'Completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : call.status === 'Missed'
                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {call.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 border-r border-white/5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${call.sentiment === 'Positive' ? 'text-emerald-400' : call.sentiment === 'Negative' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {call.sentiment}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-300 font-medium border-r border-white/5">{call.duration}</td>
                                        <td className="py-4 px-4 font-bold text-white border-r border-white/5">{call.cost}</td>
                                        <td className="py-4 px-4 text-gray-500 text-xs border-r border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} />
                                                {call.time}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-500 text-xs border-r border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} />
                                                {call.date}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 border-r border-white/5 text-center">
                                            {call.recording_url ? (
                                                <a
                                                    href={call.recording_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:bg-white/10 transition-all"
                                                    title="Download Recording"
                                                    download
                                                >
                                                    <Download size={16} />
                                                </a>
                                            ) : (
                                                <span className="text-gray-600">--</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 border-r border-white/5 text-center">
                                            {call.transcript ? (
                                                <button
                                                    onClick={() => setActiveTranscript(call.transcript)}
                                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-all"
                                                    title="View Transcript"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                            ) : (
                                                <span className="text-gray-600">--</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => setSelectedCall(selectedCall?.id === call.id ? null : call)}
                                                className={`p-2.5 rounded-xl border transition-all duration-300 ${selectedCall?.id === call.id
                                                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Transcript Modal */}
            <AnimatePresence>
                {activeTranscript && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveTranscript(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[80vh] bg-[#000103] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Call Transcript</h3>
                                </div>
                                <button
                                    onClick={() => setActiveTranscript(null)}
                                    className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                                >
                                    <ChevronDown size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                    {activeTranscript}
                                </pre>
                            </div>
                            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
                                <button
                                    onClick={() => setActiveTranscript(null)}
                                    className="px-6 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium RTL Side Panel */}
            <AnimatePresence mode="wait">
                {selectedCall && (
                    <div key={selectedCall.id}>
                        {/* Overlay */}
                        <motion.div
                            key="call-details-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCall(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Panel */}
                        <motion.div
                            key="call-details-panel"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-[#000103]/90 backdrop-blur-2xl border-l border-white/10 z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">Call Details</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">Ref: {selectedCall.id.substring(0, 12)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCall(null)}
                                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <ChevronDown size={20} className="rotate-[-90deg]" />
                                </button>
                            </div>

                            {/* Panel Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                                {/* Summary Section */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Executive Summary
                                    </h4>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-gray-300 leading-relaxed shadow-inner font-medium italic relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
                                        {selectedCall.summary || "No detailed summary available for this call interaction."}
                                    </div>
                                </div>

                                {/* Technical Info Grid */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Interaction Data</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Direction', value: selectedCall.type || 'Inbound', icon: PhoneIncoming, color: 'text-purple-400' },
                                            { label: 'Sentiment', value: selectedCall.sentiment || 'Positive', icon: Zap, color: 'text-emerald-400' },
                                            { label: 'Cost Basis', value: selectedCall.cost, icon: DollarSign, color: 'text-amber-400' },
                                            { label: 'Date', value: selectedCall.date, icon: Calendar, color: 'text-blue-400' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <item.icon size={12} className={`${item.color} opacity-70`} />
                                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{item.label}</p>
                                                </div>
                                                <p className="text-xs font-bold text-white truncate">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Transcription / Quick Actions */}
                                <div className="pt-4 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Quick Actions</h4>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => selectedCall.recording_url && window.open(selectedCall.recording_url)}
                                            disabled={!selectedCall.recording_url}
                                            className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                                        >
                                            <Download size={16} />
                                            Download Call Recording
                                        </button>
                                        <button
                                            onClick={() => setActiveTranscript(selectedCall.transcript)}
                                            disabled={!selectedCall.transcript}
                                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                                        >
                                            <FileText size={16} />
                                            View Text Transcript
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Footer */}
                            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center">
                                    Processed by Controx AI Analytics
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CallLogs;
