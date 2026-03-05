import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { Mic, Globe, Phone, Calendar, Repeat, Database, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { icon: Mic, title: 'Human-like Voice', desc: 'Indistinguishable from reality with natural breathing and pauses.' },
    { icon: Globe, title: '40+ Languages', desc: 'Speak to your customers in their native language effortlessly.' },
    { icon: Phone, title: 'Inbound & Outbound', desc: 'Handle support calls or run automated sales campaigns.' },
    { icon: Calendar, title: 'Smart Booking', desc: 'Directly schedules appointments into your Google/Outlook calendar.' },
    { icon: Repeat, title: 'Follow-up Automation', desc: 'Automatically sends SMS or email recaps after the call.' },
    { icon: Database, title: 'CRM Syncing', desc: 'Pushes all call data and leads straight to your CRM.' },
    { icon: FileText, title: 'Live Transcripts', desc: 'Real-time text transcription and call recording.' },
    { icon: CheckCircle2, title: '99% Uptime', desc: 'Enterprise-grade reliability you can trust.' }
];

const Features = () => {
    return (
        <SectionWrapper id="features">
            <div className="mb-16">
                <span className="text-cyan-400 font-medium tracking-wider uppercase text-sm">Capabilities</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">Everything an Agent Can Do, <br /> <span className="text-gray-500">Only Faster.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <GlassCard className="h-full hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 text-cyan-400">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Features;
