import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Phone, Clock, DollarSign, PieChart, Settings as SettingsIcon, LogOut, Home, TrendingUp, Calendar, Zap } from 'lucide-react';

import GlassCard from '../components/ui/GlassCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import AnalyticsPieChart from '../components/dashboard/AnalyticsPieChart';
import { motion } from 'framer-motion';
import RecentCalls from '../components/dashboard/RecentCalls';
import Settings, { currencies } from '../components/dashboard/Settings';
import { useAuth } from '../contexts/AuthContext';
import CallLogs from '../components/dashboard/CallLogs';
import Bookings from '../components/dashboard/Bookings';
import TestAgent from '../components/dashboard/TestAgent';
import Billing from '../components/dashboard/Billing';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [currency, setCurrency] = useState(currencies[0]); // Default to USD
    const { signOut, organization, user, loading: authLoading } = useAuth(); // Get org and user
    const navigate = useNavigate();

    // specific Dashboard state
    const [stats, setStats] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [recentCalls, setRecentCalls] = useState([]);
    const [allCalls, setAllCalls] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [overviewFilter, setOverviewFilter] = useState('Weekly');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    // Refactored data processing to be reactive to overviewFilter
    React.useEffect(() => {
        if (!allCalls || allCalls.length === 0) return;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let filterDate = new Date(todayStart);
        let graphBuckets = 7;
        let bucketUnit = 'day';

        if (overviewFilter === 'Daily') {
            filterDate = new Date(todayStart);
            graphBuckets = 24;
            bucketUnit = 'hour';
        } else if (overviewFilter === 'Weekly') {
            filterDate.setDate(filterDate.getDate() - 6);
            graphBuckets = 7;
            bucketUnit = 'day';
        } else if (overviewFilter === 'Monthly') {
            filterDate.setDate(filterDate.getDate() - 29);
            graphBuckets = 30;
            bucketUnit = 'day';
        }

        const filteredCalls = allCalls.filter(call => {
            const callDate = new Date(call.started_at || call.created_at);
            return callDate >= filterDate;
        });

        // Process stats
        let totalCalls = filteredCalls.length;
        let totalDuration = 0;
        let totalCost = 0;
        const statusCounts = { 'Connected': 0, 'No Answer': 0, 'Busy': 0, 'Voicemail': 0, 'Failed': 0 };

        const graphMap = new Map();
        for (let i = 0; i < graphBuckets; i++) {
            const d = new Date(filterDate);
            if (bucketUnit === 'hour') d.setHours(d.getHours() + i);
            else d.setDate(d.getDate() + i);

            const label = bucketUnit === 'hour'
                ? `${d.getHours()}:00`
                : d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

            graphMap.set(label, { name: label, calls: 0, cost: 0, date: new Date(d) });
        }

        filteredCalls.forEach(call => {
            totalDuration += (call.duration_seconds || 0);
            totalCost += (Number(call.cost) || 0);

            const status = (call.status || '').toLowerCase();
            const reason = (call.disconnection_reason || '').toLowerCase();

            if (status === 'completed') statusCounts['Connected']++;
            else if (reason.includes('voicemail')) statusCounts['Voicemail']++;
            else if (reason.includes('no_answer')) statusCounts['No Answer']++;
            else if (reason.includes('busy')) statusCounts['Busy']++;
            else statusCounts['Failed']++;

            const callDate = new Date(call.started_at || call.created_at);
            const label = bucketUnit === 'hour'
                ? `${callDate.getHours()}:00`
                : callDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

            if (graphMap.has(label)) {
                const d = graphMap.get(label);
                d.calls++;
                d.cost += (Number(call.cost) || 0);
            }
        });

        const avgCost = totalCalls > 0 ? totalCost / totalCalls : 0;
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);

        setStats([
            { label: "Total Calls", value: totalCalls.toLocaleString(), change: "+0%", icon: Phone, color: "text-cyan-400" },
            { label: "Total Duration", value: `${hours}h ${minutes}m`, change: "+0%", icon: Clock, color: "text-purple-400" },
            { label: "Total Cost", value: `${currency.symbol}${totalCost.toFixed(2)}`, change: "+0%", icon: DollarSign, color: "text-emerald-400" },
            { label: "Avg Cost / Call", value: `${currency.symbol}${avgCost.toFixed(2)}`, change: "+0%", icon: TrendingUp, color: "text-pink-400" }
        ]);

        setPieData([
            { name: 'Connected', value: statusCounts['Connected'], color: '#06b6d4' },
            { name: 'No Answer', value: statusCounts['No Answer'], color: '#a855f7' },
            { name: 'Busy', value: statusCounts['Busy'], color: '#f43f5e' },
            { name: 'Failed', value: statusCounts['Failed'], color: '#f59e0b' },
            { name: 'Voicemail', value: statusCounts['Voicemail'], color: '#0044CE' },
        ].filter(d => d.value > 0));

        setActivityData(Array.from(graphMap.values())
            .map(i => ({ name: i.name, calls: i.calls, cost: Number(i.cost.toFixed(2)) }))
        );

        const formattedCalls = (allCalls || []).slice(0, 5).map(call => {
            let name = call.extracted_data?.customer_name || "Unknown Caller";
            const durMin = Math.floor((call.duration_seconds || 0) / 60);
            const durSec = (call.duration_seconds || 0) % 60;

            return {
                id: call.id,
                name,
                number: "Unknown Number",
                type: 'incoming',
                status: call.status === 'completed' ? 'Completed' : 'Missed',
                duration: `${durMin}m ${durSec}s`,
                cost: `${currency.symbol}${(Number(call.cost) || 0).toFixed(2)}`,
                time: new Date(call.created_at).toLocaleDateString()
            };
        });
        setRecentCalls(formattedCalls);

    }, [allCalls, overviewFilter, currency]);

    const fetchDashboardData = async () => {
        if (!organization?.id) return;

        try {
            setLoading(true);

            // Fetch all calls for this org
            const { data: calls, error: callsError } = await supabase
                .from('calls')
                .select('*')
                .eq('organization_id', organization.id)
                .order('created_at', { ascending: false });

            if (callsError) throw callsError;

            setAllCalls(calls || []);

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        if (!organization?.id) return;
        try {
            setBookingsLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('organization_id', organization.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setBookingsLoading(false);
        }
    };

    React.useEffect(() => {
        if (organization?.id) {
            fetchDashboardData();
            fetchBookings();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [organization?.id, currency, authLoading]);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    // Format all calls for CallLogs component
    const formattedAllCalls = allCalls.map(call => {
        let name = call.extracted_data?.customer_name || "Unknown Caller";
        const durMin = Math.floor((call.duration_seconds || 0) / 60);
        const durSec = (call.duration_seconds || 0) % 60;

        const timestampToken = call.started_at || call.created_at;
        const callDate = new Date(timestampToken);

        return {
            id: call.id,
            name,
            number: "Unknown Number",
            type: 'incoming',
            status: call.status === 'completed' ? 'Completed' : 'Missed',
            duration: `${durMin}m ${durSec}s`,
            cost: `${currency.symbol}${(Number(call.cost) || 0).toFixed(2)}`,
            date: !isNaN(callDate.getTime()) ? callDate.toLocaleDateString() : 'N/A',
            time: !isNaN(callDate.getTime()) ? callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
            summary: call.summary,
            agent_id: call.agent_id,
            recording_url: call.recording_url,
            transcript: call.transcript,
            created_at: timestampToken,
            sentiment: call.analysis?.user_sentiment || 'Neutral'
        };
    });

    const tabInfo = {
        'Overview': { subtext: '' },
        'Call Logs': { subtext: 'View and manage all your voice interactions' },
        'Bookings': { subtext: 'Manage your AI-generated appointments and schedules' },
        'Test Agent': { subtext: 'Interact with your AI agents in a live simulation environment' },
        'Analytics': { subtext: 'Deep dive into your performance metrics and call data' },
        'Billing': { subtext: 'Manage your subscription plan and payment methods' },
        'Settings': { subtext: 'Configure your organization and personal preferences' }
    };

    return (
        <div className="flex min-h-screen bg-[#000103] text-white font-sans relative">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-[200px] fixed left-0 top-0 bottom-0 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border-r border-white/10 z-50 p-4 hidden lg:flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <LayoutDashboard size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Controx AI</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: PieChart, label: 'Overview' },
                            { icon: Phone, label: 'Call Logs' },
                            { icon: Calendar, label: 'Bookings' },
                            { icon: Zap, label: 'Test Agent' },
                            { icon: Clock, label: 'Analytics' },
                            { icon: DollarSign, label: 'Billing' },
                            { icon: SettingsIcon, label: 'Settings' },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(item.label)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${activeTab === item.label
                                    ? 'bg-[#0044CE] shadow-lg shadow-blue-900/20 text-white'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={18} className={activeTab === item.label ? "text-white" : "group-hover:text-white transition-colors"} />
                                <span className={`font-medium text-sm ${activeTab === item.label ? "font-bold" : ""}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 lg:ml-[200px] p-4 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-8"
                >
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-0 md:pt-4">
                        <div className="flex-1">
                            {activeTab === 'Overview' ? (
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight animate-gradient bg-gradient-to-r from-white via-blue-100 to-white/80 bg-clip-text text-transparent">
                                        {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || organization?.name || 'User'}
                                    </h1>
                                    <p className="text-sm text-gray-400 mt-2 font-medium opacity-80">
                                        Monitor your AI agent activity, call performance, and overall system insights in one place.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-3xl font-bold text-white tracking-tight">{activeTab}</h1>
                                    <p className="text-sm text-gray-400 mt-1 font-medium">
                                        {tabInfo[activeTab]?.subtext}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                            <a href="/" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
                                <Home size={18} />
                            </a>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-tighter shadow-lg shadow-cyan-500/20">
                                {(organization?.name || user?.email || 'CN').substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center h-[50vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'Overview' && (
                                <div className="space-y-8">
                                    <StatsGrid currency={currency} stats={stats} />
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2">
                                            <AnalyticsChart
                                                currency={currency}
                                                customData={activityData}
                                                activeFilter={overviewFilter}
                                                setActiveFilter={setOverviewFilter}
                                            />
                                        </div>
                                        <AnalyticsPieChart data={pieData} />
                                    </div>
                                    <RecentCalls
                                        currency={currency}
                                        calls={recentCalls}
                                        onViewAll={() => setActiveTab('Call Logs')}
                                    />
                                </div>
                            )}

                            {activeTab === 'Call Logs' && (
                                <CallLogs
                                    currency={currency}
                                    calls={formattedAllCalls}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'Bookings' && (
                                <Bookings
                                    bookings={bookings}
                                    calls={allCalls}
                                    loading={bookingsLoading}
                                />
                            )}

                            {activeTab === 'Test Agent' && (
                                <div className="flex justify-start">
                                    <TestAgent organization={organization} />
                                </div>
                            )}

                            {activeTab === 'Settings' && (
                                <Settings currency={currency} setCurrency={setCurrency} />
                            )}

                            {activeTab === 'Billing' && (
                                <Billing currency={currency} calls={allCalls} />
                            )}

                            {activeTab === 'Analytics' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                        <Clock size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Analytics Coming Soon</h3>
                                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                            We're working hard to bring you advanced analytics capabilities.
                                        </p>
                                    </div>
                                </div>
                            ) /* Removed Billing from Coming Soon since it's now implemented */}
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
