import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Stethoscope, Utensils, Building2, GraduationCap } from 'lucide-react';

const industries = [
    {
        id: 'healthcare',
        label: 'Healthcare',
        icon: Stethoscope,
        script: [
            { role: 'ai', text: "Hello! This is Controx AI. How can I assist you today?" },
            { role: 'user', text: "I want to book an appointment with a doctor." },
            { role: 'ai', text: "Sure. Which department do you need?" },
            { role: 'user', text: "Cardiology." },
            { role: 'ai', text: "Perfect. I have available slots on Tuesday at 2 PM. Should I confirm your appointment?" },
            { role: 'user', text: "Yes, please confirm it." },
            { role: 'ai', text: "Excellent! Your appointment is confirmed for Tuesday at 2 PM. A confirmation email with all the details has been sent to your inbox." }
        ]
    },
    {
        id: 'restaurants',
        label: 'Restaurants',
        icon: Utensils,
        script: [
            { role: 'ai', text: "Welcome to our restaurant. How can I help you today?" },
            { role: 'user', text: "I want to book a table for 4 people." },
            { role: 'ai', text: "Your table is available at 8 PM tonight. Shall I confirm the reservation?" }
        ]
    },
    {
        id: 'realestate',
        label: 'Real Estate',
        icon: Building2,
        script: [
            { role: 'ai', text: "Hi! Looking for a property today?" },
            { role: 'user', text: "Yes, I want a 2BHK apartment." },
            { role: 'ai', text: "I've found 3 options. Would you like to schedule a site visit?" }
        ]
    },
    {
        id: 'education',
        label: 'Education',
        icon: GraduationCap,
        script: [
            { role: 'ai', text: "Hello! Which course are you interested in?" },
            { role: 'user', text: "I want to enroll in a digital marketing course." },
            { role: 'ai', text: "Great choice! Would you like to book a free demo session?" }
        ]
    }
];

const ChatSimulator = () => {
    const [activeTab, setActiveTab] = useState('healthcare');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeoutIds = [];
        setMessages([]);
        setIsTyping(true);

        const currentScenario = industries.find(i => i.id === activeTab);
        let accumulatedDelay = 0;

        currentScenario.script.forEach((msg, index) => {
            // Typing delay before message appears
            const typingDuration = 1000 + (msg.text.length * 20);
            const readingDelay = 1500; // Delay after message before next one starts

            // Start typing
            const startTypingId = setTimeout(() => {
                setIsTyping(true);
            }, accumulatedDelay);

            // Show message
            accumulatedDelay += typingDuration;
            const showMessageId = setTimeout(() => {
                setMessages(prev => [...prev, msg]);
                if (index === currentScenario.script.length - 1) {
                    setIsTyping(false);
                }
            }, accumulatedDelay);

            timeoutIds.push(startTypingId, showMessageId);
            accumulatedDelay += readingDelay;
        });

        return () => timeoutIds.forEach(clearTimeout);
    }, [activeTab]);

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Industry Tabs */}
            <div className="flex justify-between bg-dark-800/50 p-1 rounded-full border border-white/5 mb-6 backdrop-blur-md">
                {industries.map((industry) => (
                    <button
                        key={industry.id}
                        onClick={() => setActiveTab(industry.id)}
                        className="relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-full transition-all duration-300 z-10"
                    >
                        {activeTab === industry.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-black border border-white/20 rounded-full shadow-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <industry.icon size={16} className={clsx(activeTab === industry.id ? "text-white" : "text-gray-500", "relative z-10")} />
                        <span className={clsx(activeTab === industry.id ? "text-white" : "text-gray-500 hover:text-gray-300", "relative z-10")}>
                            {industry.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Chat Container */}
            <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md h-[450px] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 p-6">
                    <div>
                        <div className="text-white font-medium text-lg">Controx Ai Voice Assistant</div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-400">Online | 24/7 Support</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={`${activeTab}-${i}`}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={clsx(
                                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-sm",
                                    msg.role === 'ai'
                                        ? "bg-transparent border border-white/10 text-gray-200 rounded-tl-none self-start"
                                        : "bg-transparent border border-white/10 text-white rounded-tr-none self-end ml-auto"
                                )}
                            >
                                {msg.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-transparent border border-white/10 p-4 rounded-2xl rounded-tl-none self-start w-16 h-10 flex items-center justify-center gap-1"
                        >
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSimulator;
