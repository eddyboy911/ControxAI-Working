import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const SectionWrapper = ({ children, className, id, ...props }) => {
    return (
        <section
            id={id}
            className={clsx("relative w-full py-20 lg:py-32 flex items-center justify-center", className)}
            {...props}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewPort={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                {children}
            </motion.div>
        </section>
    );
};

export default SectionWrapper;
