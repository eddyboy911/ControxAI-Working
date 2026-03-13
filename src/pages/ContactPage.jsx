import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Mail, Phone, MapPin, Clock, ChevronDown, Check, MessageSquare, User, Building2, Send } from 'lucide-react';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const TOPICS = [
    'General Enquiry', 'Demo Request', 'Pricing & Plans',
    'Technical Support', 'Partnership', 'Press / Media',
];

/* ── Custom Dropdown ──────────────────────────────────────── */
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
                className={`w-full flex items-center justify-between bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm transition-all ${open ? 'border-cyan-500/50 bg-white/[0.06]' : 'border-white/10 hover:border-white/20'}`}
            >
                <span className={value ? 'text-gray-200' : 'text-gray-600'}>{value || placeholder}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ml-2 flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#0c1120] shadow-xl overflow-hidden"
                    >
                        {options.map(opt => (
                            <li
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${value === opt ? 'bg-cyan-500/10 text-cyan-300' : 'text-gray-400 hover:bg-white/[0.05] hover:text-gray-200'}`}
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

const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />}
        <input
            {...props}
            className={`w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
        />
    </div>
);

const contactInfo = [
    {
        icon: Mail,
        label: 'Email Us',
        value: 'hello@controx.ai',
        sub: 'We respond within a few hours',
    },
    {
        icon: Phone,
        label: 'Call Us',
        value: '+1 (800) 555-0199',
        sub: 'Mon–Fri, 9 AM – 6 PM EST',
    },
    {
        icon: Clock,
        label: 'Support Hours',
        value: '24/7 AI Support',
        sub: 'Human support Mon–Fri',
    },
    {
        icon: MapPin,
        label: 'Headquarters',
        value: 'San Francisco, CA',
        sub: 'United States',
    },
];

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', company: '', topic: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

    return (
        <main className="w-full min-h-screen bg-dark-900 text-white overflow-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-4">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.span {...fade()} className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">
                        Contact Us
                    </motion.span>
                    <motion.h1
                        {...fade(0.05)}
                        className="text-4xl md:text-5xl font-bold mt-4 leading-tight tracking-tight"
                        style={{
                            background: 'linear-gradient(90deg, #ffffff 0%, #9ca3af 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}
                    >
                        Let's Start a Conversation
                    </motion.h1>
                    <motion.p {...fade(0.1)} className="text-gray-500 text-base mt-5 max-w-xl mx-auto leading-relaxed">
                        Whether you're curious about pricing, need a demo, or just have a question — we're here and we respond fast.
                    </motion.p>
                </div>
            </section>

            {/* Main content */}
            <section className="py-10 pb-24 px-4">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

                    {/* Contact info — sidebar */}
                    <motion.div {...fade(0.05)} className="lg:col-span-2 space-y-4">
                        {contactInfo.map((c, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                            >
                                <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <c.icon className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider">{c.label}</p>
                                    <p className="text-white font-medium text-sm mt-0.5">{c.value}</p>
                                    <p className="text-gray-600 text-xs mt-0.5">{c.sub}</p>
                                </div>
                            </div>
                        ))}

                        {/* Note */}
                        <div className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                            <p className="text-gray-500 text-sm leading-relaxed">
                                For urgent technical issues, please include your account email and a brief description so we can respond faster.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact form */}
                    <motion.div
                        {...fade(0.1)}
                        className="lg:col-span-3 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] relative overflow-hidden"
                    >
                        <div className="h-px absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-5">
                                    <Check className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Thanks, <span className="text-gray-300">{form.name}</span>! We'll get back to you at{' '}
                                    <span className="text-gray-300">{form.email}</span> as soon as possible.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 px-5 py-2 rounded-lg border border-white/10 text-gray-500 text-sm hover:text-white hover:border-white/20 transition-all"
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-white mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input required icon={User} name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
                                        <Input required type="email" icon={Mail} name="email" value={form.email} onChange={handleChange} placeholder="Email Address" />
                                    </div>
                                    <Input icon={Building2} name="company" value={form.company} onChange={handleChange} placeholder="Company Name (optional)" />
                                    <Dropdown placeholder="What's this about?" options={TOPICS} value={form.topic} onChange={(val) => setForm(p => ({ ...p, topic: val }))} />
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-600 pointer-events-none" />
                                        <textarea
                                            required
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Tell us how we can help…"
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                                        style={{ background: 'linear-gradient(135deg, #471CE7, #B39FFF)' }}
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </button>
                                    <p className="text-center text-gray-600 text-xs">We typically respond within a few hours during business days.</p>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default ContactPage;
