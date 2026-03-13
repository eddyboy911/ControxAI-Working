import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, AudioWaveform } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';
import clsx from 'clsx';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', to: '/', isRoute: true },
        { name: 'About Us', to: '/about', isRoute: true },
        { name: 'Contact Us', to: '/contact', isRoute: true },
        { name: 'Onboarding', to: '/onboarding', isRoute: true },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "bg-dark-900/80 backdrop-blur-md py-4 border-b border-white/5" : "py-6 bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <AudioWaveform className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-wide text-white">CONTROX AI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.isRoute ? (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.to}
                                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            )
                        ))}
                        <Link to="/login">
                            <GradientButton variant="outline" className="!py-2 !px-6 text-sm">
                                Login
                            </GradientButton>
                        </Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-dark-900 pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 items-center text-center">
                            {navLinks.map((link) => (
                                link.isRoute ? (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        className="text-xl text-gray-300 hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.to}
                                        className="text-xl text-gray-300 hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                )
                            ))}
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                                <GradientButton className="w-full mt-4">
                                    Login
                                </GradientButton>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
