import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Phone, PhoneIncoming, PhoneOutgoing, MoreVertical } from 'lucide-react';

const RecentCalls = ({ currency, calls, onViewAll }) => {
    // Fallback if calls prop is missing
    const displayCalls = calls || [];

    return (
        <GlassCard hoverEffect={false} className="!p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-base font-bold text-white">Recent Calls</h3>
                    <p className="text-xs text-gray-400">Latest activity from your agents</p>
                </div>
                <button
                    onClick={onViewAll}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-400 border-b border-white/5">
                            <th className="py-3 pl-2 font-medium">Caller</th>
                            <th className="py-3 font-medium">Status</th>
                            <th className="py-3 font-medium">Duration</th>
                            <th className="py-3 font-medium">Cost</th>
                            <th className="py-3 pr-2 font-medium text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {displayCalls.map((call) => (
                            <tr key={call.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-gray-300">
                                <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${call.type === 'incoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                            }`}>
                                            {call.type === 'incoming' ? <PhoneIncoming size={16} /> : <PhoneOutgoing size={16} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-xs" title={call.summary || "No summary"}>{call.name}</p>
                                            <p className="text-[10px] text-gray-500">{call.number !== "Unknown Number" ? call.number : (call.summary ? call.summary.substring(0, 30) + '...' : 'No details')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] border border-white/5 ${call.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        call.status === 'Missed' ? 'bg-red-500/10 text-red-400' :
                                            'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {call.status}
                                    </span>
                                </td>
                                <td className="py-3 text-xs">{call.duration}</td>
                                <td className="py-3 text-xs font-medium text-white">{call.cost}</td>
                                <td className="py-3 pr-2 text-right text-[10px] text-gray-500">{call.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
};

export default RecentCalls;
