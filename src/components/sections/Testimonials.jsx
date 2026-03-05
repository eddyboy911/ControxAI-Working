import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "CEO, MedCare Clinics",
        text: "Controx AI handled 3,000 appointment calls last month. We saved $12k in staffing costs and our booking rate went up by 40%."
    },
    {
        name: "Mark Davison",
        role: "Founder, RealState Pro",
        text: "The voice is so realistic that 9 out of 10 clients didn't realize they were speaking to an AI. It's an absolute game changer for lead qualification."
    },
    {
        name: "Emily Carter",
        role: "Ops Manager, FoodieChain",
        text: "No more missed orders during peak hours. Controx takes every call, answers menu questions, and processes orders directly into our POS."
    }
];

const Testimonials = () => {
    return (
        <SectionWrapper id="testimonials">
            <h2 className="text-4xl text-center font-bold mb-16 text-gradient">What Our Clients Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <GlassCard className="h-full flex flex-col justify-between">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-300 leading-relaxed">"{t.text}"</p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600" />
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                    <p className="text-cyan-400 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Testimonials;
