import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { PhoneMissed, Clock, Users, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
    {
        icon: PhoneMissed,
        title: "Missed Calls",
        desc: "60% of leads hang up if calls aren't answered immediately."
    },
    {
        icon: Clock,
        title: "No 24/7 Support",
        desc: "Customers expect answers day and night, not just 9-to-5."
    },
    {
        icon: Users,
        title: "High Staffing Costs",
        desc: "Hiring human support teams is expensive and hard to scale."
    },
    {
        icon: Banknote,
        title: "Lost Revenue",
        desc: "Every missed conversation is potential revenue down the drain."
    }
];

const Problem = () => {
    return (
        <SectionWrapper id="problem">
            <div className="relative">
                {/* 1. Moving Gradient Background (Blobs) */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-0 -right-20 w-72 h-72 bg-blue-500 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-20 w-72 h-72 bg-indigo-500 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

                {/* Extra Blobs for Randomness */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob-reverse" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500 mix-blend-multiply filter blur-3xl opacity-20 animate-blob-reverse animation-delay-2000" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold text-gradient">
                            Stop Losing Leads <br />
                            Due to Missed Calls
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Traditional phone support is broken. Businesses lose millions every year because they simply can't answer every call.
                            Controx AI fixes this instanty.
                        </p>
                        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {problems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 1, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                            >
                                <GlassCard className="h-full">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-[#B39FFF]">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </SectionWrapper>
    );
};

export default Problem;
