import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

const GradientButton = ({
    children,
    variant = 'primary',
    icon = false,
    className,
    ...props
}) => {
    const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-[#471CE7] to-[#B39FFF] text-white hover:shadow-[0_0_20px_rgba(71,28,231,0.5)] transition-all duration-300",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
        ghost: "bg-transparent text-white/80 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {icon && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </span>

            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
        </motion.button>
    );
};

export default GradientButton;
