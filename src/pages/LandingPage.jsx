import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import SocialProof from '../components/sections/SocialProof';
import Problem from '../components/sections/Problem';
import VoiceDemos from '../components/sections/VoiceDemos';
import Solution from '../components/sections/Solution';
import Industries from '../components/sections/Industries';
import Features from '../components/sections/Features';
import Integrations from '../components/sections/Integrations';
import Security from '../components/sections/Security';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

const LandingPage = () => {
    return (
        <main className="w-full min-h-screen bg-dark-900 text-white overflow-hidden selection:bg-cyan-500/30">
            <Navbar />
            <Hero />
            <SocialProof />
            <Problem />
            <VoiceDemos />
            <Solution />
            <Industries />
            <Features />
            <Integrations />
            <Security />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    );
};

export default LandingPage;
