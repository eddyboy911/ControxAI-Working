import React from 'react';
import SectionWrapper from '../layout/SectionWrapper';

const logos = [
    { url: "https://brandsparc.com/wp-content/uploads/2025/10/Clip-path-group.png", alt: "Brandsparc Logo 1" },
    { url: "https://brandsparc.com/wp-content/uploads/2025/10/Group-383444-1.png", alt: "Brandsparc Logo 2" },
    { url: "https://brandsparc.com/wp-content/uploads/2025/10/7867-1.png", alt: "Brandsparc Logo 3" },
    { url: "https://brandsparc.com/wp-content/uploads/2026/03/image__2_-removebg-preview-1.png", alt: "Brandsparc Logo 4" },
    { url: "https://brandsparc.com/wp-content/uploads/2026/03/arbutus-logo-dark.webp", alt: "Arbutus Logo" },
    { url: "https://brandsparc.com/wp-content/uploads/2026/03/logo.png", alt: "Logo 6" }
];

const repeatingLogos = [...logos, ...logos, ...logos, ...logos];

const SocialProof = () => {
    return (
        <SectionWrapper className="!py-24 border-b border-white/5">
            <div className="text-center mb-16">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Trusted by 100+ Businesses Worldwide</p>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient">
                <div className="flex w-[max-content] animate-scroll hover:[animation-play-state:paused]">
                    {/* First set of logos */}
                    <div className="flex w-1/2 justify-around gap-16 md:gap-32 px-8 md:px-16 items-center">
                        {repeatingLogos.map((logo, i) => (
                            <div key={`first-${i}`} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                                <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="h-8 md:h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Second mirrored set of logos for seamless looping */}
                    <div className="flex w-1/2 justify-around gap-16 md:gap-32 px-8 md:px-16 items-center">
                        {repeatingLogos.map((logo, i) => (
                            <div key={`second-${i}`} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300">
                                <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="h-8 md:h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default SocialProof;
