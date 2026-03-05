import React, { useState } from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: "How fast can I set this up?",
        a: "You can get your first agent live in under 10 minutes. Our templates cover most industries, or you can build a custom workflow in our drag-and-drop builder."
    },
    {
        q: "Does it sound like a robot?",
        a: "Not at all. We use advanced LLMs and voice synthesis to create voices that breathe, pause, and react with human-like latency (under 500ms)."
    },
    {
        q: "Can it integrate with my CRM?",
        a: "Yes! We integrate natively with Salesforce, HubSpot, Zoho, and 50+ other tools via Zapier and webhooks."
    },
    {
        q: "What languages are supported?",
        a: "Controx AI currently supports 40+ languages and various accents, allowing you to deploy global support instantly."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <SectionWrapper id="faq" className="max-w-4xl mx-auto">
            <h2 className="text-4xl text-center font-bold mb-12 text-gradient">Frequently Asked Questions</h2>

            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <div key={i} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="font-medium text-lg">{item.q}</span>
                            <span className="text-cyan-400">
                                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                            </span>
                        </button>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                        {item.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default FAQ;
