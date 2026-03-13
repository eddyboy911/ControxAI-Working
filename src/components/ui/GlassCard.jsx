import React from 'react';

import clsx from 'clsx';

const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
    const divRef = React.useRef(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || !hoverEffect) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={clsx(
                "glass-card p-6 relative overflow-hidden group",
                className
            )}
            {...props}
        >
            {/* Static Border (Base) */}
            <div className="absolute inset-0 rounded-2xl border-[1.5px] border-white/20 pointer-events-none z-10" />

            {/* Interactive Gradient Border */}
            {hoverEffect && (
                <div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-20 transition-opacity duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(168,85,247,1), rgba(6,182,212,1), transparent 40%)`,
                        maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
                        maskClip: 'content-box, border-box',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        padding: '1.5px',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-30 flex-1 flex flex-col h-full w-full">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
