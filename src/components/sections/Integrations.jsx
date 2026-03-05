import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { motion } from 'framer-motion';

// Using text/icons placeholders for now - in production, these would be SVGs
const integrations = [
    'Google Calendar', 'HubSpot', 'Salesforce', 'Calendly', 'Zoho', 'WhatsApp', 'Zapier', 'Slack'
];

const Integrations = () => {
    return (
        <SectionWrapper id="integrations" className="overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center relative z-10 mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Seamlessly Integrates <br /> With Your Stack</h2>
                <p className="text-gray-400 text-lg">Connect Controx AI to your favorite tools in seconds.</p>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {integrations.map((tool, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.3)" }}
                            className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center h-32 cursor-pointer transition-all duration-300 group"
                        >
                            <span className="font-bold text-lg text-gray-300 group-hover:text-white">{tool}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Connecting Lines (Simulated) */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none" viewBox="0 0 800 400">
                <path d="M400,200 Q150,50 100,100" fill="none" stroke="url(#lineGradient)" strokeWidth="2" />
                <path d="M400,200 Q650,50 700,100" fill="none" stroke="url(#lineGradient)" strokeWidth="2" />
                <path d="M400,200 Q150,350 100,300" fill="none" stroke="url(#lineGradient)" strokeWidth="2" />
                <path d="M400,200 Q650,350 700,300" fill="none" stroke="url(#lineGradient)" strokeWidth="2" />
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </SectionWrapper>
    );
};

export default Integrations;
