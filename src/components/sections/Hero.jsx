import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import ContactSalesModal from '../ui/ContactSalesModal';
import BookDemoModal from '../ui/BookDemoModal';

import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
    const [salesOpen, setSalesOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-dark-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-100"
                style={{ backgroundImage: `url(${heroBg})` }}
            />

            {/* Gradient Overlay for Fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-transparent to-dark-900 z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                        Conversational Intelligence
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-aurora">
                        Human Like Realistic <br />
                        Ai Voice Agents
                    </h1>

                    <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                        Power your business communication with realistic AI voice agents designed to answer calls, engage customers, capture leads, and deliver seamless support anytime, anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <GradientButton variant="primary" className="!text-lg !px-10 h-[50px] flex items-center justify-center" onClick={() => setDemoOpen(true)}>
                            Book Now
                        </GradientButton>
                        <GradientButton
                            variant="outline"
                            className="!text-lg !px-10 h-[50px] flex items-center justify-center"
                            onClick={() => setSalesOpen(true)}
                        >
                            Contact Sales
                        </GradientButton>
                    </div>
                </motion.div>
            </div>

            <ContactSalesModal isOpen={salesOpen} onClose={() => setSalesOpen(false)} />
            <BookDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
        </section>
    );
};

export default Hero;
