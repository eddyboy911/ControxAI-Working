import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ArrowRight } from 'lucide-react';

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

const steps = [
    {
        num: "01",
        title: "Discovery Call",
        description: "Everything starts with a conversation. We learn the ins and outs of your business, identify operational bottlenecks, and define exactly what a successful AI voice agent looks like for your workflows."
    },
    {
        num: "02",
        title: "Knowledge Mapping",
        description: "We dive into your specific workflows. We gather your FAQs, objection handling scripts, and appointment rules so your conversational AI understands your business as deeply as your best employee."
    },
    {
        num: "03",
        title: "Agent Engineering",
        description: "Our team builds, trains, and tests your custom voice agent. We refine the tone, pacing, hesitation injection, and conversational logic to ensure perfectly natural, human-like voice interactions."
    },
    {
        num: "04",
        title: "Deployment & Scale",
        description: "Your AI goes live. We hand over the keys to your Controx dashboard, where you can monitor live calls, review transcripts, and track your growing ROI and booked appointments in real-time."
    }
];

const OnboardingPage = () => {
    return (
        <main className="w-full min-h-screen bg-dark-900 text-white overflow-hidden selection:bg-cyan-500/30 font-sans">
            <Navbar />

            {/* Premium Minimal Hero */}
            <section className="relative pt-48 pb-16 px-4">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <motion.div {...fade()} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-8">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[11px] tracking-[0.2em] uppercase text-gray-400 font-medium">
                            How It Works
                        </span>
                    </motion.div>

                    <motion.h1
                        {...fade(0.1)}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8"
                        style={{
                            background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}
                    >
                        Your pathway to<br />automated growth.
                    </motion.h1>

                    <motion.p {...fade(0.2)} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Getting started isn't about buying software—it's about hiring your most reliable employee. We handle the heavy lifting with a simple, done-for-you process.
                    </motion.p>
                </div>
            </section>

            {/* Minimal Grid Steps */}
            <section className="pb-24 pt-8 px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.num}
                                {...fade(idx * 0.1)}
                                className="group relative"
                            >
                                <div className="p-10 pb-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden relative">
                                    <div className="text-[120px] leading-none font-bold text-white/[0.06] absolute top-2 right-4 z-0 pointer-events-none select-none transition-all duration-500 group-hover:text-cyan-500/[0.12] drop-shadow-[0_0_15px_rgba(255,255,255,0.03)] text-right">
                                        {step.num}
                                    </div>

                                    {/* Content Card */}
                                    <div className="relative z-10 pt-16 mt-4">
                                        <h3 className="text-3xl font-semibold text-white mb-6 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed mix-blend-lighten">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Done-For-You Section */}
            <section className="py-32 px-4 relative z-10 bg-[#060606]">
                <div className="max-w-6xl mx-auto">

                    {/* Centered Headline */}
                    <div className="text-center justify-center flex flex-col items-center mb-16 md:mb-24">
                        <h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8"
                            style={{
                                background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}
                        >
                            Why we build it for you.
                        </h2>
                        <div className="w-16 h-px bg-white/20" />
                    </div>

                    {/* Split Layout */}
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Left Side: Minimal Image Container */}
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
                                alt="AI Voice Engineering"
                                className="w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                            />
                        </div>

                        {/* Right Side: Text */}
                        <div className="space-y-8">
                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium tracking-tight">
                                While there are DIY tools available, building a truly effective AI voice agent requires deep technical expertise and thousands of hours of conversational engineering.
                            </p>

                            <p className="text-lg text-gray-400 leading-relaxed">
                                As a business owner, your time is your most valuable asset. You don't have the bandwidth to learn prompt engineering, configure latency optimizations, map out complex fallbacks, and perfectly align an AI system to your unique operational flow.
                            </p>

                            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    Our specialized engineering team handles the entire technical setup—so you get a hyper-realistic, fully functional AI employee deployed fast, without lifting a finger.
                                </p>
                                <p className="mt-4 text-white font-semibold flex items-center gap-2">
                                    We manage the technology. You manage the growth.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Minimal CTA */}
            <section className="py-40 px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2 {...fade()} className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
                        Ready to automate your calls?
                    </motion.h2>
                    <motion.p {...fade(0.1)} className="text-gray-500 mb-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Book a quick consultation today and let's map out exactly what our AI can do for your specific workflows.
                    </motion.p>
                    <motion.div {...fade(0.2)}>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 hover:bg-gray-100 active:scale-95 transition-all duration-300"
                        >
                            Book a Consultation
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default OnboardingPage;
