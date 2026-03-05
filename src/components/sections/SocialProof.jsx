import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';

const logos = [
    "TechCorp", "Innovate", "GlobalSoft", "FutureNet", "DataSystems", "CloudSync"
];

const SocialProof = () => {
    return (
        <SectionWrapper className="!py-24 border-b border-white/5">
            <div className="text-center mb-16">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Trusted by 100+ Businesses Worldwide</p>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient">
                {/* Simple CSS Marquee for now - can enhance with Framer Motion loop later */}
                <div className="flex gap-16 md:gap-32 animate-scroll whitespace-nowrap">
                    {[...logos, ...logos].map((logo, i) => (
                        <div key={i} className="text-2xl font-bold text-white/20 hover:text-white/40 transition-colors uppercase">
                            {/* Placeholder for SVG Logos */}
                            <span className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/10 rounded-full" />
                                {logo}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default SocialProof;
