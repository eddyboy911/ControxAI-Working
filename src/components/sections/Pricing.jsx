import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Starter',
        price: '149',
        priceLabel: '/mo',
        description: 'Perfect for small businesses getting started with AI.',
        features: [
            '150 call minutes',
            'Inbound & outbound call handling',
            'Appointment booking',
            'Dedicated business phone number',
            'Call logs & basic dashboard analytics'
        ],
        highlighted: false,
        buttonText: 'Get Started'
    },
    {
        name: 'Growth',
        price: '249',
        priceLabel: '/mo',
        description: 'Ideal for scaling teams needing advanced features.',
        features: [
            '360 call minutes',
            'Everything in Starter',
            'Priority support',
            'Advanced analytics dashboard',
            'Call recordings, transcripts & summaries'
        ],
        highlighted: true,
        buttonText: 'Get Started',
        badge: 'Popular'
    },
    {
        name: 'Pro',
        price: '399',
        priceLabel: '/mo',
        description: 'Enterprise-grade power for high-volume operations.',
        features: [
            '750 call minutes',
            'Everything in Growth',
            'Monthly performance report',
            'Advanced call insights',
            'Optimization & priority system performance'
        ],
        highlighted: false,
        buttonText: 'Get Started'
    }
];

const Pricing = () => {
    return (
        <SectionWrapper id="pricing">
            <div className="mb-16 text-center max-w-3xl mx-auto">
                <span className="text-cyan-400 font-medium tracking-wider uppercase text-sm">Pricing Plans</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">Simple, Transparent Pricing</h2>
                <p className="text-gray-400 mt-4 leading-relaxed">
                    Choose the perfect plan to scale your operations with AI-powered conversational agents.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="h-full"
                    >
                        <GlassCard 
                            className={`h-full flex flex-col relative overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                                plan.highlighted 
                                    ? 'bg-[#0A101A] border-cyan-500/30 ring-1 ring-cyan-500/20 z-10' 
                                    : 'hover:bg-white/10'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-[#0099ff] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#0099ff]/20">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            <div className="p-2 flex-grow flex flex-col">
                                <h3 className={`text-sm font-bold uppercase tracking-widest ${plan.highlighted ? 'text-cyan-400' : 'text-gray-400'}`}>
                                    {plan.name}
                                </h3>
                                
                                <div className="mt-4 flex items-end gap-1">
                                    <span className="text-5xl font-extrabold tracking-tight text-white">${plan.price}</span>
                                    <span className="text-gray-400 mb-1 font-medium">{plan.priceLabel}</span>
                                </div>

                                <p className="text-gray-400 text-sm mt-4 pb-6 border-b border-white/10">
                                    {plan.description}
                                </p>

                                <ul className="mt-6 space-y-4 flex-grow">
                                    {plan.features.map((feature, featureIdx) => (
                                        <li key={featureIdx} className="flex items-start gap-3">
                                            <CheckCircle2 
                                                size={18} 
                                                className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-cyan-400' : 'text-gray-500'}`} 
                                            />
                                            <span className="text-sm text-gray-300 leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-8 w-full">
                                    {plan.highlighted ? (
                                        <button className="w-full flex justify-center items-center py-3 px-8 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/5 active:scale-95">
                                            {plan.buttonText}
                                        </button>
                                    ) : (
                                        <GradientButton 
                                            variant="outline" 
                                            className="w-full flex justify-center py-3 px-8"
                                        >
                                            {plan.buttonText}
                                        </GradientButton>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Pricing;
