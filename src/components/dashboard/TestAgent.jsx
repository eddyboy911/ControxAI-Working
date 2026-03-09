import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import { Phone, User, Play, StopCircle, Mic, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { RetellWebClient } from 'retell-client-js-sdk';

const retellWebClient = new RetellWebClient();

const TestAgent = ({ organization }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState('Idle');
    const [agents, setAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [transcript, setTranscript] = useState([]);
    const transcriptRef = useRef(null);

    const fetchAgents = async () => {
        if (!organization?.id) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .eq('organization_id', organization.id)
                .eq('is_active', true);

            if (data && data.length > 0) {
                setAgents(data);
                setSelectedAgentId(data[0].retell_agent_id);
            }
        } catch (err) {
            console.error('Error fetching agents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [organization?.id]);

    // Setup Retell Web Client Listeners
    useEffect(() => {
        // Handle call start
        retellWebClient.on('call_started', () => {
            setCallStatus('Connected');
            setIsCalling(true);
        });

        // Handle call end
        retellWebClient.on('call_ended', () => {
            setIsCalling(false);
            setCallStatus('Ended');
            setTimeout(() => setCallStatus('Idle'), 3000);
        });

        // Handle agent errors
        retellWebClient.on('error', (error) => {
            console.error('An error occurred:', error);
            setIsCalling(false);
            setCallStatus('Error');
            retellWebClient.stopCall();
            setTimeout(() => setCallStatus('Idle'), 3000);
        });

        // Handle live transcript updates
        retellWebClient.on('update', (update) => {
            // update.transcript is an array of messages
            if (update.transcript && Array.isArray(update.transcript)) {
                const formattedTranscript = update.transcript.map((msg, idx) => ({
                    id: idx,
                    role: msg.role, // 'user' or 'agent'
                    text: msg.content,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setTranscript(formattedTranscript);
            }
        });

        return () => {
            // Cleanup listeners
            retellWebClient.off('call_started');
            retellWebClient.off('call_ended');
            retellWebClient.off('error');
            retellWebClient.off('update');
            retellWebClient.stopCall();
        };
    }, []);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    const handleStartCall = async () => {
        if (!selectedAgentId) return;
        setIsCalling(true);
        setCallStatus('Connecting');
        setTranscript([]); // Clear previous transcript

        try {
            // 1. Get access token from server
            const { data, error } = await supabase.functions.invoke('create-web-call', {
                body: { agent_id: selectedAgentId }
            });

            if (error) throw error;

            if (!data.access_token) {
                throw new Error("No access token provided by the server.");
            }

            // 2. Start call with Retell Web Client
            await retellWebClient.startCall({
                accessToken: data.access_token,
                captureDeviceId: undefined,
                playbackDeviceId: undefined,
                emitRawAudioSamples: false,
            });

        } catch (err) {
            console.error('Web call failed:', err);
            setCallStatus('Failed');
            setIsCalling(false);
            setTimeout(() => setCallStatus('Idle'), 3000);
        }
    };

    const handleEndCall = () => {
        retellWebClient.stopCall();
        setIsCalling(false);
        setCallStatus('Ended');
        setTimeout(() => setCallStatus('Idle'), 3000);
    };

    const selectedAgentName = agents.find(a => a.retell_agent_id === selectedAgentId)?.name || 'Agent';

    return (
        <div className="w-full h-full max-h-[800px] flex flex-col">
            <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                {/* Header: Agent Info & Status */}
                <div className={`py-4 px-6 md:px-8 shrink-0 flex items-center justify-between border-b transition-colors duration-500 ${isCalling ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center border border-blue-500/20">
                            <Phone size={18} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">{loading ? 'Loading...' : selectedAgentName}</h2>
                            <p className="text-xs text-gray-500">Live Simulation Interface</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isCalling
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : 'bg-white/5 border-white/10 text-gray-400'
                            }`}>
                            {isCalling && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                            {callStatus}
                        </div>
                        {isCalling && (
                            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                <Activity size={12} />
                                Active
                            </div>
                        )}
                    </div>
                </div>

                {/* Body: Live Transcript Area */}
                <div ref={transcriptRef} className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 scroll-smooth bg-black/20">
                    {transcript.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Mic size={48} className="text-gray-600 mb-4" />
                            <p className="text-sm font-medium text-gray-400">No active conversation</p>
                            <p className="text-xs text-gray-600 mt-1">Initiate a test call to talk directly using your microphone</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {transcript.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-800' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                                            {msg.role === 'user' ? <User size={14} className="text-gray-400" /> : <Phone size={14} className="text-blue-400" />}
                                        </div>
                                        <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{msg.role === 'user' ? 'You' : selectedAgentName}</span>
                                                <span className="text-[9px] text-gray-600">{msg.time}</span>
                                            </div>
                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-gray-800 text-gray-200 rounded-tr-sm'
                                                    : 'bg-blue-600/10 border border-blue-500/20 text-blue-50 rounded-tl-sm'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer: Control Panel */}
                <div className="shrink-0 p-6 md:px-8 md:py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-500 text-center sm:text-left">
                        Talk directly to your AI agent through your device microphone.<br className="hidden sm:block" /> Perfect for quick testing and adjustments.
                    </p>

                    <button
                        onClick={isCalling ? handleEndCall : handleStartCall}
                        disabled={loading || (agents.length === 0 && !isCalling) || callStatus === 'Connecting'}
                        className={`w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group ${isCalling
                                ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20'
                                : 'bg-white text-black hover:bg-blue-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-20 disabled:grayscale'
                            }`}
                    >
                        {isCalling ? (
                            <>
                                <StopCircle size={18} />
                                <span>End Test Call</span>
                            </>
                        ) : (
                            <>
                                <Play size={18} className="fill-current" />
                                <span>{callStatus === 'Connecting' ? 'Connecting...' : 'Initiate Test Call'}</span>
                            </>
                        )}

                        {/* Ripple Effect */}
                        {isCalling && (
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-red-500/20 rounded-xl pointer-events-none"
                            />
                        )}
                    </button>
                </div>

            </GlassCard>

            <div className="shrink-0 py-4 flex justify-center">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                    Powered by Retell AI Engine
                </p>
            </div>
        </div>
    );
};

export default TestAgent;
