import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Zap, Shield, Heart, TrendingUp, ExternalLink } from 'lucide-react';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const values = [
    { icon: Zap, title: 'Speed First', desc: 'Every second a call goes unanswered is a lost opportunity. We built Controx to respond instantly, 24/7.' },
    { icon: Shield, title: 'Trust & Privacy', desc: 'We handle sensitive business data with enterprise-grade security. HIPAA, GDPR, and SOC2 standards are non-negotiable.' },
    { icon: Heart, title: 'Human-Centred AI', desc: 'Our goal isn\'t to replace people — it\'s to free them from repetitive tasks so they can focus on what matters.' },
    { icon: TrendingUp, title: 'Measurable ROI', desc: 'We only succeed when our customers do. Every feature is built around real business outcomes, not vanity metrics.' },
];



const AboutPage = () => {
    return (
        <main className="w-full min-h-screen bg-dark-900 text-white overflow-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-24 px-4">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.span {...fade()} className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">
                        About Us
                    </motion.span>
                    <motion.h1
                        {...fade(0.05)}
                        className="text-4xl md:text-6xl font-bold mt-4 leading-tight tracking-tight"
                        style={{
                            background: 'linear-gradient(90deg, #ffffff 0%, #9ca3af 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}
                    >
                        We're Building the Future<br />of Business Communication
                    </motion.h1>
                    <motion.p {...fade(0.12)} className="mt-6 text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
                        Controx AI was founded on a simple belief — no business should lose a customer because a phone went unanswered.
                        We build realistic AI voice agents that handle calls, bookings, and follow-ups so your team never has to.
                    </motion.p>

                    {/* BrandSparc parent note */}
                    <motion.div {...fade(0.18)} className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-gray-500">
                        <span>A solution by</span>
                        <a
                            href="https://brandsparc.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-semibold hover:text-gray-300 transition-colors inline-flex items-center gap-1"
                        >
                            BrandSparc
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-4 border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div {...fade()}>
                        <span className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">Our Mission</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-snug">
                            Making Every Business Available, Always
                        </h2>
                        <p className="text-gray-500 mt-5 leading-relaxed">
                            Small clinics, growing agencies, and large enterprises all share the same problem — the phone rings when no one can answer it. Controx AI eliminates that gap with AI voice agents that sound human, respond instantly, and work around the clock.
                        </p>
                        <p className="text-gray-500 mt-4 leading-relaxed">
                            We believe automation should feel natural. Our agents don't sound robotic — they carry conversations, handle objections, book appointments, and follow up with leads, all while your team focuses on higher-value work.
                        </p>
                    </motion.div>
                    <motion.div {...fade(0.1)} className="grid grid-cols-2 gap-4">
                        {[
                            { label: '500+', sub: 'Businesses Served' },
                            { label: '40+', sub: 'Languages Supported' },
                            { label: '3M+', sub: 'Calls Handled' },
                            { label: '99%', sub: 'Uptime Guaranteed' },
                        ].map((s, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
                                <p className="text-3xl font-bold text-white">{s.label}</p>
                                <p className="text-gray-500 text-sm mt-1">{s.sub}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fade()} className="text-center mb-14">
                        <span className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">What We Stand For</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Our Core Values</h2>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                {...fade(i * 0.07)}
                                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                className="group p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-colors duration-300 flex flex-col gap-4 cursor-default"
                            >
                                <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white/20 transition-colors">
                                    <v.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-[15px] mb-1.5">{v.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA strip */}
            <section className="py-20 px-4 border-t border-white/[0.06]">
                <motion.div {...fade()} className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to See It in Action?</h2>
                    <p className="text-gray-500 mb-8">Book a free 30-minute demo and see exactly how Controx AI can work for your business.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-8 py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                        style={{ background: 'linear-gradient(135deg, #471CE7, #B39FFF)' }}
                    >
                        Book a Demo →
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default AboutPage;
