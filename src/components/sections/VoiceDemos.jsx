import React, { useState } from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { Play, Pause, Stethoscope, Home, CalendarCheck, Plane, GraduationCap, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceDemos = () => {
    const [playingId, setPlayingId] = useState(null);

    const demos = [
        {
            id: 1,
            title: "Healthcare: Patient Scheduling",
            time: "0:45",
            icon: Stethoscope,
        },
        {
            id: 2,
            title: "Real Estate: Property Inquiry",
            time: "1:15",
            icon: Home,
        },
        {
            id: 3,
            title: "Dental: Check-up Reminder",
            time: "0:30",
            icon: CalendarCheck,
        },
        {
            id: 4,
            title: "Tourism: Travel Booking",
            time: "0:55",
            icon: Plane,
        },
        {
            id: 5,
            title: "EdTech: Student Assist",
            time: "0:40",
            icon: GraduationCap,
        },
        {
            id: 6,
            title: "Finance: Loan Inquiry",
            time: "1:05",
            icon: CreditCard,
        }
    ];

    const togglePlay = (id) => {
        setPlayingId(playingId === id ? null : id);
    };

    return (
        <SectionWrapper id="voice-demos" className="relative overflow-hidden">
            {/* Background Glow - Subtle Pulse */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Hear the Difference
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg"
                    >
                        Experience human-like conversations that feel natural, handle interruptions, and maintain context flawlessly.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demos.map((demo, index) => {
                        const isPlaying = playingId === demo.id;
                        const demoIcon = demo.icon; // Assuming demo.icon is a component

                        return (
                            <motion.div
                                key={demo.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <GlassCard className={`p-3 flex flex-col items-start gap-2 transition-colors duration-300 h-full border-white/5 bg-white/5 ${isPlaying ? 'border-cyan-500/40 bg-white/10' : ''}`}>

                                    <div className="w-full flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <button
                                                onClick={() => togglePlay(demo.id)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isPlaying ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/10 text-white'}`}
                                            >
                                                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                            </button>
                                            <h3 className={`text-sm font-medium transition-colors truncate ${isPlaying ? 'text-cyan-400' : 'text-white'}`}>
                                                {demo.title}
                                            </h3>
                                        </div>
                                        {!isPlaying && (
                                            <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 shrink-0 ml-auto">
                                                {demo.time}
                                            </span>
                                        )}
                                    </div>

                                    {/* Waveform - Full Width in Card */}
                                    {isPlaying && (
                                        <div className="w-full h-8 flex items-center justify-center bg-black/20 rounded-lg">
                                            <AudioPlayerVisualizer isPlaying={true} />
                                        </div>
                                    )}

                                    {!isPlaying && (
                                        <div className="w-full h-8 flex items-center gap-1 opacity-20 px-1">
                                            {[...Array(20)].map((_, i) => (
                                                <div key={i} className="w-full bg-gray-400 rounded-full h-0.5" />
                                            ))}
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </SectionWrapper>
    );
};

const AudioPlayerVisualizer = ({ isPlaying }) => {
    return (
        <div className="flex items-center justify-center gap-1 h-full w-full max-w-[200px]">
            {[...Array(16)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-cyan-400/80 rounded-full"
                    initial={{ height: 4 }}
                    animate={{
                        height: isPlaying ? [4, 20, 4] : 4,
                        opacity: isPlaying ? 1 : 0.3
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                        repeatType: "reverse"
                    }}
                />
            ))}
        </div>
    );
};

export default VoiceDemos;
