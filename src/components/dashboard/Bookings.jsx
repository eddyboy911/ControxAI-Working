import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Bookings = ({ bookings, calls, loading }) => {
    const [selectedBookingId, setSelectedBookingId] = React.useState(null);

    // Filter display bookings and find their related call summaries
    const displayBookings = (bookings?.length > 0 ? bookings : [
        { id: 'sample-1', customer_name: 'Sarah Johnson', start_time: new Date(Date.now() + 86400000).toISOString(), status: 'Confirmed', call_id: 'sample-call-1' },
        { id: 'sample-2', customer_name: 'Michael Chen', start_time: new Date(Date.now() + 172800000).toISOString(), status: 'Pending', call_id: 'sample-call-2' },
        { id: 'sample-3', customer_name: 'Emma Wilson', start_time: new Date(Date.now() - 86400000).toISOString(), status: 'Completed', call_id: 'sample-call-3' },
    ]).map(booking => {
        // Find summary from calls array if matching call_id exists
        const relatedCall = (calls || []).find(c => c.id === booking.call_id);
        return {
            ...booking,
            summary: relatedCall?.summary || booking.summary || "No call summary available for this booking."
        };
    });

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'text-emerald-400';
            case 'pending': return 'text-amber-400';
            case 'completed': return 'text-blue-400';
            case 'cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return <CheckCircle2 size={12} />;
            case 'pending': return <AlertCircle size={12} />;
            case 'completed': return <CheckCircle2 size={12} />;
            case 'cancelled': return <XCircle size={12} />;
            default: return <AlertCircle size={12} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/5 border border-white/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-cyan-500/10">
                    <Calendar size={14} />
                    Syncing with Calendar
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayBookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassCard className="group hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col h-fit p-4">
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-all">
                                            <User size={16} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-none mb-1.5">{booking.customer_name}</h4>
                                            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest leading-none ${getStatusStyle(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 relative z-10 mb-4 px-0.5">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 bg-white/[0.02] py-2 px-3 rounded-xl border border-white/5">
                                            <Calendar size={12} className="text-cyan-500 opacity-70" />
                                            {booking.start_time ? new Date(booking.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 bg-white/[0.02] py-2 px-3 rounded-xl border border-white/5">
                                            <Clock size={12} className="text-purple-500 opacity-70" />
                                            {booking.start_time ? new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                        </div>
                                    </div>

                                    {selectedBookingId === booking.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="pt-2"
                                        >
                                            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-gray-400 leading-relaxed font-medium">
                                                <p className="text-[8px] uppercase tracking-widest font-black text-gray-600 mb-1.5 border-b border-white/5 pb-1">Call Summary</p>
                                                {booking.summary}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <button
                                        onClick={() => setSelectedBookingId(selectedBookingId === booking.id ? null : booking.id)}
                                        className={`w-full text-[9px] font-black uppercase tracking-[0.2em] py-2.5 rounded-xl transition-all duration-300 border ${selectedBookingId === booking.id
                                            ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/20 translate-y-[-1px]'
                                            : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {selectedBookingId === booking.id ? 'Close Details' : 'Details'}
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
