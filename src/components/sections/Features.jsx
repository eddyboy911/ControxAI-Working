import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { Mic, Globe, Phone, Calendar, Repeat, Database, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    { icon: Mic, title: 'Human-like Voice', desc: 'Indistinguishable from reality with natural breathing and pauses.' },
    { icon: Globe, title: '40+ Languages', desc: 'Speak to your customers in their native language effortlessly.' },
    { icon: Phone, title: 'Inbound & Outbound', desc: 'Handle support calls or run automated sales campaigns.' },
    { icon: Calendar, title: 'Smart Booking', desc: 'Directly schedules appointments into your Google/Outlook calendar.' },
    { icon: Repeat, title: 'Follow-up Automation', desc: 'Automatically sends SMS or email recaps after every call.' },
    { icon: Database, title: 'CRM Syncing', desc: 'Pushes all call data and leads straight to your CRM.' },
    { icon: FileText, title: 'Live Transcripts', desc: 'Real-time text transcription and call recording.' },
    { icon: CheckCircle2, title: '99% Uptime', desc: 'Enterprise-grade reliability you can trust.' }
];

const Features = () => {
    return (
        <SectionWrapper id="features">

            {/* Header — centered */}
            <div className="mb-14 text-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium"
                >
                    Capabilities
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-5xl font-bold mt-3 leading-tight tracking-tight"
                    style={{
                        background: 'linear-gradient(90deg, #ffffff 0%, #9ca3af 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Everything an Agent Can Do
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 }}
                    className="text-gray-500 text-base mt-4 max-w-lg mx-auto leading-relaxed"
                >
                    Controx AI works like a digital employee that answers calls,<br />
                    books appointments, and manages customer conversations 24/7.
                </motion.p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
                        className="group p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.14] transition-colors duration-300 flex flex-col gap-5 cursor-default"
                    >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white/20 transition-colors duration-300">
                            <f.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </div>

                        {/* Text */}
                        <div>
                            <h3 className="text-white font-semibold text-[15px] mb-1.5 leading-snug">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </SectionWrapper>
    );
};

export default Features;
