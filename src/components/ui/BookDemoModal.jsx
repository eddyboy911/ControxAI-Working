import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Building2, ChevronDown, Check, Calendar, Clock } from 'lucide-react';

const INDUSTRIES = [
    'Dental Clinic', 'Medical / Healthcare', 'Real Estate',
    'Restaurant / Food Chain', 'E-commerce', 'Law Firm',
    'Financial Services', 'Other',
];

const TIME_SLOTS = [
    '9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM',
    '1:00 PM – 2:00 PM', '2:00 PM – 3:00 PM', '3:00 PM – 4:00 PM',
    '4:00 PM – 5:00 PM',
];

const TIMEZONES = ['IST (UTC+5:30)', 'GMT (UTC+0)', 'EST (UTC-5)', 'PST (UTC-8)', 'GST (UTC+4)'];

/* ── Custom Dropdown ─────────────────────────────────────────────────────── */
const Dropdown = ({ placeholder, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm transition-all ${open ? 'border-cyan-500/50 bg-white/[0.06]' : 'border-white/10 hover:border-white/20'
                    }`}
            >
                <span className={value ? 'text-gray-200' : 'text-gray-600'}>{value || placeholder}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#0c1120] shadow-xl overflow-hidden"
                    >
                        {options.map(opt => (
                            <li
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${value === opt
                                        ? 'bg-cyan-500/10 text-cyan-300'
                                        : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-200'
                                    }`}
                            >
                                {opt}
                                {value === opt && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ── Input ───────────────────────────────────────────────────────────────── */
const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />}
        <input
            {...props}
            className={`w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
        />
    </div>
);

/* ── Modal ───────────────────────────────────────────────────────────────── */
const BookDemoModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: '', email: '', phone: '', company: '',
        industry: '', preferredDate: '', timeSlot: '', timezone: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
    const handleClose = () => { onClose(); setTimeout(() => setSubmitted(false), 400); };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-md bg-[#050810] border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Top accent — different color from sales modal */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

                            <div className="p-7 max-h-[90vh] overflow-y-auto">

                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Book a Free Demo</h2>
                                        <p className="text-gray-500 text-sm mt-0.5">See Controx AI live in 30 minutes.</p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="py-12 text-center"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-5">
                                            <Check className="w-7 h-7 text-violet-400" />
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">Demo Booked!</h3>
                                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                            Thanks, <span className="text-gray-300">{form.name}</span>! A calendar invite will be sent to{' '}
                                            <span className="text-gray-300">{form.email}</span>. See you then.
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            className="mt-6 px-5 py-2 rounded-lg border border-white/10 text-gray-500 text-sm hover:text-white hover:border-white/20 transition-all"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3">

                                        {/* Name + Email */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input required icon={User} name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
                                            <Input required type="email" icon={Mail} name="email" value={form.email} onChange={handleChange} placeholder="Work Email" />
                                        </div>

                                        {/* Phone + Company */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
                                            <Input required icon={Building2} name="company" value={form.company} onChange={handleChange} placeholder="Company Name" />
                                        </div>

                                        {/* Industry */}
                                        <Dropdown placeholder="Your Industry" options={INDUSTRIES} value={form.industry} onChange={set('industry')} />

                                        {/* Preferred Date */}
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                            <input
                                                required
                                                type="date"
                                                name="preferredDate"
                                                value={form.preferredDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
                                            />
                                        </div>

                                        {/* Time Slot + Timezone */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Dropdown placeholder="Preferred Time" options={TIME_SLOTS} value={form.timeSlot} onChange={set('timeSlot')} />
                                            <Dropdown placeholder="Timezone" options={TIMEZONES} value={form.timezone} onChange={set('timezone')} />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-1"
                                            style={{ background: 'linear-gradient(135deg, #471CE7 0%, #7c3aed 50%, #B39FFF 100%)' }}
                                        >
                                            Confirm Demo →
                                        </button>

                                        <p className="text-center text-gray-600 text-xs">
                                            Free 30-min session · No commitment required
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BookDemoModal;
