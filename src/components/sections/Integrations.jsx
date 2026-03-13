import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { motion } from 'framer-motion';


// Using text/icons placeholders for now - in production, these would be SVGs
const integrations = [
    { name: 'Google Calendar', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/Google_Calendar_icon_2020.svg.png' },
    { name: 'HubSpot', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/HubSpot_Logo.png' },
    { name: 'Salesforce', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/Salesforce.com_logo.svg.png' },
    { name: 'Calendly', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/lg-677a5c89d313a-Calendly.webp' },
    { name: 'Zoho', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/Zoho_Corporation-Logo.wine_.png' },
    { name: 'WhatsApp', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/logo-whatsapp-png-pic-0.png' },
    { name: 'Zapier', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/Zapier_logo.svg.png' },
    { name: 'Slack', logo: 'https://brandsparc.com/wp-content/uploads/2026/03/9fb92dbe14e7ced09c12c56f0a6912b1.png' },
];

const Integrations = () => {
    return (
        <SectionWrapper id="integrations" className="overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center relative z-10 mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">Seamlessly Integrates <br /> Coming Soon</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-center">Upcoming integrations will connect Controx AI with your business tools.</p>
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
                            className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center justify-center h-32 cursor-pointer transition-all duration-300 group gap-2"
                        >
                            {tool.logo ? (
                                <img
                                    src={tool.logo}
                                    alt={tool.name}
                                    className={`w-auto object-contain ${tool.name === 'Calendly'
                                            ? 'h-32 max-w-[200px]' // Massively increased for Calendly due to whitespace
                                            : tool.name === 'Zoho'
                                                ? 'h-20 max-w-[140px]' // Larger for Zoho
                                                : 'h-14 max-w-[120px]' // Default size for others
                                        }`}
                                />
                            ) : (
                                <span className="font-bold text-lg text-gray-300 group-hover:text-white">{tool.name}</span>
                            )}
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
