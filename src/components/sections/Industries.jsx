import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import GlassCard from '../ui/GlassCard';
import { Stethoscope, GraduationCap, Building2, Utensils, Plane, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const industries = [
    { icon: Stethoscope, label: 'Healthcare' },
    { icon: GraduationCap, label: 'Education' },
    { icon: Building2, label: 'Real Estate' },
    { icon: Utensils, label: 'Restaurants' },
    { icon: Plane, label: 'Travel' },
    { icon: Headset, label: 'Support' }
];

const Industries = () => {
    return (
        <SectionWrapper className="bg-dark-800/30">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl font-bold mb-6 text-gradient">Built for Every Industry</h2>
                <p className="text-gray-400 text-lg">Whether you run a clinic, a restaurant, or a real estate agency, Controx AI adapts to your specific needs.</p>
            </div>

            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: {},
                    show: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
                {industries.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                        }}
                    >
                        <GlassCard className="flex flex-col items-center justify-center py-10 gap-4 h-full">
                            <item.icon size={32} className="text-gray-300 group-hover:text-[#B39FFF] transition-colors" />
                            <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>
        </SectionWrapper>
    );
};

export default Industries;
