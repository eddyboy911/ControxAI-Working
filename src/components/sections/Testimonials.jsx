import React, { useState, useEffect, useCallback, useRef } from 'react';
import SectionWrapper from '../layout/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "CEO, MedCare Clinics",
        text: "Controx AI handled 3,000 appointment calls last month. We saved $12k in staffing costs and our booking rate went up by 40%.",
        color: "from-emerald-500 to-teal-600"
    },
    {
        name: "Mark Davison",
        role: "Founder, RealState Pro",
        text: "The voice is so realistic that 9 out of 10 clients didn't realize they were speaking to an AI. It's an absolute game changer for lead qualification.",
        color: "from-blue-500 to-sky-600"
    },
    {
        name: "Emily Carter",
        role: "Ops Manager, FoodieChain",
        text: "No more missed orders during peak hours. Controx takes every call, answers menu questions, and processes orders directly into our POS.",
        color: "from-orange-500 to-red-600"
    },
    {
        name: "Dr. Priya Sharma",
        role: "Lead Dentist, SmileCare Dental Clinic",
        text: "Since using Controx at our clinic, appointment no-shows have dropped by 48%. Patients get instant callbacks even late at night, and our reception staff can finally breathe. The AI sounds so natural — patients genuinely can't tell the difference.",
        color: "from-cyan-500 to-blue-600"
    },
    {
        name: "Dr. Arjun Mehta",
        role: "Owner, Mehta Dental Studio",
        text: "We were losing nearly ₹2 lakh every month from missed follow-up calls and unconfirmed bookings. Controx plugged that gap completely. Our clinic now runs at near-full capacity every week, and patient satisfaction scores have gone up significantly.",
        color: "from-violet-500 to-purple-600"
    },
    {
        name: "Rachel Morrison",
        role: "Practice Manager, BrightSmile Dental Group",
        text: "We operate five locations and struggled to staff phone lines consistently. Controx now manages the entire call intake for all five clinics. Our front desk team can finally focus on the patients sitting in front of them — not the ones on hold.",
        color: "from-rose-500 to-pink-600"
    }
];

const Stars = () => (
    <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(s => (
            <svg key={s} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const TestimonialCard = ({ t }) => (
    <div
        className="flex flex-col h-full rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
        <div className="flex-1">
            <Stars />
            <p className="text-gray-300 leading-relaxed text-sm">"{t.text}"</p>
        </div>
        <div className="flex items-center gap-3 pt-5 mt-5 border-t border-white/5">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-sm">{t.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
                <h4 className="font-bold text-white text-sm leading-tight truncate">{t.name}</h4>
                <p className="text-cyan-400 text-xs leading-tight truncate">{t.role}</p>
            </div>
        </div>
    </div>
);

const VISIBLE = 3;
const TOTAL = testimonials.length;

// Premium slide + fade variants
const variants = {
    enter: (dir) => ({
        x: dir > 0 ? '6%' : '-6%',
        opacity: 0,
        filter: 'blur(4px)',
    }),
    center: {
        x: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
            x: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.5, ease: 'easeOut' },
            filter: { duration: 0.5, ease: 'easeOut' },
        }
    },
    exit: (dir) => ({
        x: dir > 0 ? '-6%' : '6%',
        opacity: 0,
        filter: 'blur(4px)',
        transition: {
            x: { duration: 0.55, ease: [0.55, 0, 1, 0.45] },
            opacity: { duration: 0.4, ease: 'easeIn' },
            filter: { duration: 0.4, ease: 'easeIn' },
        }
    }),
};

const Testimonials = () => {
    const [startIdx, setStartIdx] = useState(0);
    const [direction, setDirection] = useState(1);
    const timerRef = useRef(null);

    const goNext = useCallback(() => {
        setDirection(1);
        setStartIdx(prev => (prev + 1) % TOTAL);
    }, []);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setStartIdx(prev => (prev - 1 + TOTAL) % TOTAL);
    }, []);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(goNext, 7000);
    }, [goNext]);

    useEffect(() => {
        timerRef.current = setInterval(goNext, 7000);
        return () => clearInterval(timerRef.current);
    }, [goNext]);

    const handleNext = () => { goNext(); resetTimer(); };
    const handlePrev = () => { goPrev(); resetTimer(); };
    const handleDot = (i) => {
        setDirection(i > startIdx ? 1 : -1);
        setStartIdx(i);
        resetTimer();
    };

    const cards = Array.from({ length: VISIBLE }, (_, i) =>
        testimonials[(startIdx + i) % TOTAL]
    );

    return (
        <SectionWrapper id="testimonials">
            <h2 className="text-4xl text-center font-bold mb-16 text-gradient">What Our Clients Say</h2>

            {/* Carousel track — overflow hidden prevents flash on exit */}
            <div className="overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={startIdx}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
                    >
                        {cards.map((t, i) => (
                            <TestimonialCard key={i} t={t} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-10">
                <button
                    onClick={handlePrev}
                    aria-label="Previous"
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:border-white/30 group"
                >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex gap-2 items-center">
                    {Array.from({ length: TOTAL }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDot(i)}
                            aria-label={`Slide ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === startIdx
                                ? 'w-6 h-2 bg-cyan-400'
                                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    aria-label="Next"
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:border-white/30 group"
                >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </SectionWrapper>
    );
};

export default Testimonials;
