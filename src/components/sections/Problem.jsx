import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { Calendar, PhoneOff, PhoneForwarded, Clock, AlertCircle, PhoneMissed } from 'lucide-react';
import { motion } from 'framer-motion';
import problemGraph from '../../assets/problem-graph.jpg';

const Problem = () => {
    return (
        <SectionWrapper id="problem">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Dynamic Background Elements - Red/Primary Theme */}
                {/* Dynamic Background Elements - Red Bokeh Theme */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-blob mix-blend-screen opacity-60" />
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-red-800/30 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-screen opacity-50" />
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl animate-blob-reverse animation-delay-4000 mix-blend-screen opacity-40" />
                    <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-red-900/40 rounded-full blur-3xl animate-blob-reverse mix-blend-screen opacity-50" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[80px] animate-pulse opacity-30" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Content (Sticky) - FIXED: Vertical Flow & Alignment */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit flex flex-col gap-6">

                        {/* 0. Curved Edge Image (New) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full h-48 rounded-2xl overflow-hidden mb-2 relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 to-transparent z-10" />
                            <img
                                src={problemGraph}
                                alt="Revenue Loss Graph"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>


                        {/* 2. Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight"
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 block xl:whitespace-nowrap">
                                Revenue Lost
                            </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 block">
                                Every Day
                            </span>
                        </motion.h2>

                        {/* 3. Body Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-400 text-base lg:text-lg leading-relaxed"
                        >
                            As call volumes grow, human-only phone support can’t keep up. Missed calls, unavailable agents, limited hours, and weak follow-ups lead to lost leads, lower conversions, and declining customer trust. Every missed call is a missed opportunity, and in a competitive market, speed is the only advantage that matters.
                        </motion.p>


                    </div>

                    {/* Right Bento Grid - FIXED: Structure & Equal Spacing */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:translate-x-16">

                        {/* Row 1: Missed Appointments (Wide) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 relative group h-full"
                        >
                            <GlassCard className="h-full p-8 overflow-hidden group-hover:border-red-500/30 transition-colors duration-500 flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-500" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Missed Appointments</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed max-w-md">Booking calls go unanswered when staff is busy, directly causing lost revenue for your business.</p>
                                        </div>
                                    </div>

                                    {/* Visual: Missed Call Static - Aligned */}
                                    <div className="w-full md:w-64 bg-[#0A0A0A] border border-white/10 rounded-xl p-4 shadow-lg shrink-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                                <PhoneMissed size={16} />
                                            </div>
                                            <div className="text-xs">
                                                <div className="text-white font-bold leading-tight">Missed Call</div>
                                                <div className="text-gray-500">Just now</div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-3">
                                            <div className="h-full w-2/3 bg-red-500/50" />
                                        </div>
                                        <div className="text-center text-xs text-red-400 font-medium bg-red-500/10 py-1.5 rounded-lg border border-red-500/10">
                                            Booking Failed
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Row 2: Two Equal Cards */}

                        {/* Card 2: Unavailable Support - RED */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full p-6 flex flex-col justify-between group hover:bg-white/5 transition-colors group-hover:border-red-500/30">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                                            <PhoneOff size={20} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="animate-pulse w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">Unavailable Support</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">Calls hitting voicemail frustrate customers instantly, leading to churn.</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Card 3: No Follow-Up - PRIMARY (Cyan) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="h-full"
                        >
                            <GlassCard className="h-full p-6 flex flex-col justify-between group hover:bg-white/5 transition-colors group-hover:border-cyan-500/30">
                                <div className="space-y-4">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                        <PhoneForwarded size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">No Follow-Ups</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed">Leads turn cold without consistent, timely follow-ups from your team.</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Row 3: Limited Hours (Wide) - RED */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-2 h-full"
                        >
                            <GlassCard className="h-full p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-red-500/30 transition-colors">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <Clock size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Scale Limit</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Limited Business Hours</h3>
                                    <p className="text-sm text-gray-400">Human support can't scale to 24/7 affordably without massive overhead costs.</p>
                                </div>
                                <div className="w-full md:w-auto flex items-center gap-2 justify-center bg-black/40 p-3 rounded-xl border border-white/5 shrink-0">
                                    <div className="px-3 py-1 rounded bg-white/5 text-xs text-gray-500 font-mono">09:00</div>
                                    <div className="w-6 h-px bg-gray-700" />
                                    <div className="px-3 py-1 rounded bg-white/5 text-xs text-gray-500 font-mono">17:00</div>
                                    <div className="ml-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold uppercase tracking-wide">
                                        Offline
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>

                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Problem;
