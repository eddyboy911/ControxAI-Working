import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { Shield, Lock, Server, FileKey } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Shield,
        title: 'HIPAA Compliant',
        desc: 'Full compliance standards for healthcare data processing and storage.',
    },
    {
        icon: Lock,
        title: 'End-to-End Encryption',
        desc: 'AES-256 encryption for all data at rest and in transit.',
    },
    {
        icon: Server,
        title: 'On-Premise Ready',
        desc: 'Deploy within your own private cloud or metal infrastructure.',
    },
    {
        icon: FileKey,
        title: 'SOC2 Certified',
        desc: 'Annual third-party audits ensuring maximum reliability and security.',
    }
];

const Security = () => {
    return (
        <SectionWrapper id="security" className="relative overflow-hidden">

            {/* Subtle bg glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center mb-20">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs tracking-widest uppercase"
                >
                    <Shield className="w-3 h-3" />
                    Enterprise Grade Security
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5"
                >
                    Built for{' '}
                    <span className="text-gradient">Regulated Industries</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed"
                >
                    Controx AI is architected from the ground up to protect your most sensitive business data — not as an afterthought.
                </motion.p>
            </div>

            {/* Feature grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
                {features.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="group bg-[#000103] p-8 flex flex-col gap-4 hover:bg-white/[0.03] transition-colors duration-300"
                    >
                        <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white/20 transition-colors duration-300">
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </div>

                        <div>
                            <h3 className="text-white font-semibold text-base mb-1">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>


                    </motion.div>
                ))}
            </div>

            {/* Certifications strip */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative z-10 mt-14 flex flex-wrap justify-center items-center gap-10"
            >
                {['HIPAA', 'GDPR', 'SOC2', 'ISO 27001', 'CCPA'].map((cert, i) => (
                    <span key={i} className="text-xs font-mono tracking-[0.25em] uppercase text-white/20 hover:text-white/50 transition-colors duration-300">
                        {cert}
                    </span>
                ))}
            </motion.div>

        </SectionWrapper>
    );
};

export default Security;
