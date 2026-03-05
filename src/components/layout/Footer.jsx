import React from 'react';
import { AudioWaveform, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-white/5 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <SectionWrapper className="!py-12 lg:!py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                                <AudioWaveform className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold tracking-wide text-white">CONTROX AI</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Revolutionizing business communication with human-like AI voice agents. Available 24/7, in 40+ languages.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-3 mobile-links">
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Integrations</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Case Studies</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3 mobile-links">
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5 text-gray-300" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5 text-gray-300" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5 text-gray-300" />
                            </a>
                        </div>
                        <a href="mailto:hello@controx.ai" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />
                            hello@controx.ai
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 Controx AI. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </SectionWrapper>
        </footer>
    );
};

export default Footer;
