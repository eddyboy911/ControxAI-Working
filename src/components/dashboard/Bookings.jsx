import React, { useState, useMemo } from 'react';
import GlassCard from '../ui/GlassCard';
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const STATUS_FLOW = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: AlertCircle },
    confirmed: { label: 'Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    completed: { label: 'Completed', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',    icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',     icon: XCircle },
};

const FILTERS = ['All', 'Today', 'This Week', 'This Month'];

const Bookings = ({ bookings, calls, loading }) => {
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [filter, setFilter] = useState('All');
    const [localStatuses, setLocalStatuses] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const updateStatus = async (bookingId, currentStatus) => {
        const currentIdx = STATUS_FLOW.indexOf(currentStatus);
        const nextStatus = currentStatus === 'cancelled'
            ? 'pending'
            : STATUS_FLOW[Math.min(currentIdx + 1, STATUS_FLOW.length - 2)];

        setUpdatingId(bookingId);
        setLocalStatuses(prev => ({ ...prev, [bookingId]: nextStatus }));

        try {
            await supabase.from('bookings').update({ status: nextStatus }).eq('id', bookingId);
        } catch (e) {
            setLocalStatuses(prev => ({ ...prev, [bookingId]: currentStatus }));
        } finally {
            setUpdatingId(null);
        }
    };

    const cancelBooking = async (bookingId) => {
        setUpdatingId(bookingId);
        setLocalStatuses(prev => ({ ...prev, [bookingId]: 'cancelled' }));
        try {
            await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
        } catch (e) {
            setLocalStatuses(prev => {
                const copy = { ...prev };
                delete copy[bookingId];
                return copy;
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredBookings = useMemo(() => {
        const list = (bookings || []).map(b => ({
            ...b,
            status: localStatuses[b.id] ?? b.status,
            summary: (calls || []).find(c => c.id === b.call_id)?.summary || b.summary || b.notes || 'No details available.'
        }));

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (filter === 'Today') {
            const end = new Date(startOfDay); end.setDate(end.getDate() + 1);
            return list.filter(b => {
                const d = new Date(b.start_time || b.created_at);
                return d >= startOfDay && d < end;
            });
        }
        if (filter === 'This Week') {
            const weekStart = new Date(startOfDay);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
            return list.filter(b => {
                const d = new Date(b.start_time || b.created_at);
                return d >= weekStart && d < weekEnd;
            });
        }
        if (filter === 'This Month') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            return list.filter(b => {
                const d = new Date(b.start_time || b.created_at);
                return d >= monthStart && d < monthEnd;
            });
        }
        return list;
    }, [bookings, calls, filter, localStatuses]);

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 mb-2">
                <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                filter === f
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-500/20" />
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                    </div>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
                        <Calendar size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {filter === 'All' ? 'Queue is empty' : `No bookings ${filter.toLowerCase()}`}
                    </h3>
                    <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                        {filter === 'All'
                            ? "Bookings handled by your agent will be listed here and synced to your workflow."
                            : 'Try expanding your filter to see more bookings.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredBookings.map((booking, idx) => {
                        const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                        const StatusIcon = cfg.icon;
                        const isUpdating = updatingId === booking.id;
                        const isOpen = selectedBookingId === booking.id;

                        return (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                            >
                                <GlassCard className="group relative border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 p-0 overflow-hidden rounded-xl">
                                    {/* Card Content Container */}
                                    <div className="p-3.5 space-y-2.5">
                                        {/* Patient Identity & Status */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center flex-shrink-0">
                                                    <User size={14} className="text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-white truncate leading-none mb-1">
                                                        {booking.customer_name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Phone size={8} />
                                                        <span className="text-[10px] font-medium truncate">
                                                            {booking.customer_phone || 'No contact'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => updateStatus(booking.id, booking.status)}
                                                disabled={isUpdating}
                                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border transition-all ${cfg.color} ${cfg.bg} hover:brightness-110 active:scale-95 flex-shrink-0`}
                                            >
                                                {isUpdating ? <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" /> : <StatusIcon size={9} />}
                                                {cfg.label}
                                            </button>
                                        </div>

                                        {/* Simplified Schedule */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1.5 transition-all hover:bg-white/[0.04]">
                                                <Calendar size={10} className="text-blue-400" />
                                                <span className="text-xs font-bold text-gray-200">
                                                    {booking.start_time 
                                                        ? new Date(booking.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                        : 'TBD'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1.5 transition-all hover:bg-white/[0.04]">
                                                <Clock size={10} className="text-purple-400" />
                                                <span className="text-xs font-bold text-gray-200">
                                                    {booking.start_time 
                                                        ? new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : 'TBD'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Fast Actions */}
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setSelectedBookingId(isOpen ? null : booking.id)}
                                                className={`flex-1 h-7 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                                    isOpen
                                                        ? 'bg-blue-600 border-blue-400 text-white'
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                                }`}
                                            >
                                                {isOpen ? 'Close' : 'Patient Notes'}
                                            </button>
                                            
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => cancelBooking(booking.id)}
                                                    disabled={isUpdating}
                                                    className="w-7 h-7 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Panel */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden border-t border-white/5 bg-blue-500/[0.02]"
                                            >
                                                <div className="p-3">
                                                    <p className="text-[12px] text-gray-400 leading-snug italic">
                                                        "{booking.summary}"
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Bookings;
