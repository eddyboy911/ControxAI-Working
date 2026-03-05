import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { Shield, Lock, Server, FileKey, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const securityFeatures = [
    {
        icon: Shield,
        title: 'HIPAA Compliant',
        desc: 'Full compliance standards for healthcare data processing and storage.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20'
    },
    {
        icon: Lock,
        title: 'End-to-End Encryption',
        desc: 'AES-256 standard encryption for all data at rest and in transit.',
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        border: 'border-blue-400/20'
    },
    {
        icon: Server,
        title: 'On-Premise Ready',
        desc: 'Deploy instances within your own private cloud or metal infrastructure.',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10',
        border: 'border-purple-400/20'
    },
    {
        icon: FileKey,
        title: 'SOC2 Certified',
        desc: 'Annual third-party audits ensuring maximum reliability and security.',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20'
    }
];

const Security = () => {
    return (
        <SectionWrapper id="security" className="relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-3xl mx-auto mb-20 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 text-primary-400 font-medium bg-primary-500/10 px-4 py-1.5 rounded-full border border-primary-500/20"
                >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm tracking-wide uppercase">Enterprise Grade Security</span>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                    Built for the <br />
                    <span className="text-gradient">Most Regulated Industries</span>
                </h2>

                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    We don't treat security as an afterthought. Controx AI is architected from the ground up to protect your most sensitive business data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {securityFeatures.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="h-full"
                    >
                        <div className={`h-full p-6 rounded-3xl border ${item.border} ${item.bg} backdrop-blur-sm hover:translate-y-[-5px] transition-transform duration-300 relative overflow-hidden group`}>

                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <CheckCircle className={`w-4 h-4 ${item.color}`} /> Verified
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Certifications Row (Visual) */}
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['HIPAA', 'GDPR', 'SOC2', 'ISO 27001', 'CCPA'].map((cert, i) => (
                    <span key={i} className="text-xl font-bold text-white/40 font-mono tracking-widest">{cert}</span>
                ))}
            </div>

        </SectionWrapper>
    );
};

export default Security;
