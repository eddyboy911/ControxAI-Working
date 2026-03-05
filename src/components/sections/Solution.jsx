import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GradientButton from '../ui/GradientButton';
import { motion } from 'framer-motion';
import ChatSimulator from './ChatSimulator';

const Solution = () => {
    return (
        <SectionWrapper id="solution" className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Interactive Simulator */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative order-2 lg:order-1"
                >

                    <div className="relative z-10">
                        <ChatSimulator />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="order-1 lg:order-2 space-y-8"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                        Seamless Automation
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gradient">
                        The Intelligent Replacement <br />
                        For Human Support
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Controx AI is the future of conversational intelligence. It's a hyper-realistic voice agent that listens, understands, and speaks just like a human.
                        It handles inbound inquiries, makes outbound sales calls, and integrates directly with your calendar.
                    </p>

                    <ul className="space-y-4">
                        {['Handle 1000+ simultaneous calls', 'Instant CRM data syncing', 'Natural pauses and interruptions'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <GradientButton>Listen to Samples</GradientButton>
                </motion.div>

            </div>
        </SectionWrapper>
    );
};

export default Solution;
