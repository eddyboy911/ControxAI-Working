import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GradientButton from '../ui/GradientButton';
import { motion } from 'framer-motion';

const CTA = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <SectionWrapper id="cta">
            <div className="relative rounded-3xl overflow-hidden p-12 lg:p-24 text-center">
                {/* Background Gradients - Smooth Blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#471CE7] to-[#B39FFF] opacity-100" />
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <motion.div
                    className="relative z-10 max-w-3xl mx-auto space-y-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white"
                        variants={itemVariants}
                    >
                        Ready to Automate your <br /> Business Calls?
                    </motion.h2>

                    <motion.p
                        className="text-xl text-white/90 max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        Join hundreds of businesses saving time and money with Controx AI.
                        Start your free trial today.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                        variants={itemVariants}
                    >
                        <GradientButton className="!bg-[#005EFF] !text-white hover:!bg-[#004ECC] transition-all shadow-lg hover:shadow-xl font-bold">
                            Contact Team
                        </GradientButton>
                        <GradientButton variant="outline" className="!border-white !text-white hover:!bg-white/10 hover:!border-white">
                            Get Started
                        </GradientButton>
                    </motion.div>

                    <motion.p
                        className="text-sm text-white/70 pt-4"
                        variants={itemVariants}
                    >
                        No credit card required • Cancel anytime
                    </motion.p>
                </motion.div>
            </div>
        </SectionWrapper>
    );
};

export default CTA;
