import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Phone, Clock, DollarSign, PieChart, Settings as SettingsIcon, LogOut, Home, TrendingUp } from 'lucide-react';
// ... (imports remain the same)

// ... (inside component)

import GlassCard from '../components/ui/GlassCard';
import StatsGrid from '../components/dashboard/StatsGrid';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import AnalyticsPieChart from '../components/dashboard/AnalyticsPieChart';
import { motion } from 'framer-motion';
import RecentCalls from '../components/dashboard/RecentCalls';
import Settings, { currencies } from '../components/dashboard/Settings';
import { useAuth } from '../contexts/AuthContext';

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
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        if (!organization?.id) return;

        try {
            setLoading(true);

            // 1. Fetch Stats (Total Calls, Duration, Cost)
            // We need to fetch all calls for this org to calculate totals
            // For huge datasets, we should use a summary table or RPC, but for now fetch 'id, duration_seconds, cost, status'


            const { data: allCalls, error: callsError } = await supabase
                .from('calls')
                .select('id, duration_seconds, cost, status, started_at, created_at, summary, extracted_data') // matched with user schema
                .eq('organization_id', organization.id);

            console.log("Dashboard Debug:");
            console.log("Organization ID:", organization.id);
            console.log("Calls Error:", callsError);
            console.log("Calls Data:", allCalls);

            if (callsError) throw callsError;

            let totalCalls = 0;
            let totalDuration = 0;
            let totalCost = 0;

            // Pie Chart Data Map
            const statusCounts = {
                'Connected': 0,
                'No Answer': 0,
                'Busy': 0,
                'Voicemail': 0,
                'Failed': 0
            };

            // Activity Graph Map (Last 7 days)
            const graphMap = new Map();
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                graphMap.set(dayName, { name: dayName, calls: 0, cost: 0, date: d });
            }
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            if (allCalls) {
                totalCalls = allCalls.length;
                allCalls.forEach(call => {
                    // Counts
                    totalDuration += (call.duration_seconds || 0);
                    totalCost += (Number(call.cost) || 0);

                    // Status Distribution
                    // disconnection_reason might be missing from schema, so fallback to status
                    const reason = (call.disconnection_reason || '').toLowerCase();
                    const status = (call.status || '').toLowerCase();

                    if ((reason.includes('hangup') && status === 'completed') || status === 'completed') {
                        statusCounts['Connected']++;
                    } else if (reason.includes('voicemail') || reason.includes('machine')) {
                        statusCounts['Voicemail']++;
                    } else if (reason.includes('no_answer') || reason.includes('did_not_connect')) {
                        statusCounts['No Answer']++;
                    } else if (reason.includes('busy')) {
                        statusCounts['Busy']++;
                    } else if (status === 'failed' || reason.includes('fail') || status === 'error') {
                        statusCounts['Failed']++;
                    } else {
                        // Default fallback
                        statusCounts['Connected']++;
                    }

                    // Graph Data
                    const callDate = new Date(call.started_at || call.created_at);
                    if (callDate >= sevenDaysAgo) {
                        const dayName = callDate.toLocaleDateString('en-US', { weekday: 'short' });
                        if (graphMap.has(dayName)) {
                            const d = graphMap.get(dayName);
                            d.calls++;
                            d.cost += (Number(call.cost) || 0);
                        }
                    }
                });
            }

            // Format Stats
            const avgCost = totalCalls > 0 ? totalCost / totalCalls : 0;
            const hours = Math.floor(totalDuration / 3600);
            const minutes = Math.floor((totalDuration % 3600) / 60);

            setStats([
                { label: "Total Calls", value: totalCalls.toLocaleString(), change: "+0%", icon: Phone, color: "text-cyan-400" },
                { label: "Total Duration", value: `${hours}h ${minutes}m`, change: "+0%", icon: Clock, color: "text-purple-400" },
                { label: "Total Cost", value: `${currency.symbol}${totalCost.toFixed(2)}`, change: "+0%", icon: currency.symbol, color: "text-green-400" },
                { label: "Avg Cost / Call", value: `${currency.symbol}${avgCost.toFixed(2)}`, change: "+0%", icon: TrendingUp, color: "text-pink-400" }
                // Note: passing string 'TrendingUp' needs handling in StatsGrid or pass component. StatsGrid handles string check.
            ]);

            // Format Pie Data
            setPieData([
                { name: 'Connected', value: statusCounts['Connected'], color: '#06b6d4' },
                { name: 'No Answer', value: statusCounts['No Answer'], color: '#a855f7' },
                { name: 'Busy', value: statusCounts['Busy'], color: '#f43f5e' },
                { name: 'Failed', value: statusCounts['Failed'], color: '#f59e0b' },
                { name: 'Voicemail', value: statusCounts['Voicemail'], color: '#0044CE' },
            ].filter(d => d.value > 0));

            // Format Graph Data
            setActivityData(Array.from(graphMap.values())
                .sort((a, b) => a.date - b.date)
                .map(i => ({ name: i.name, calls: i.calls, cost: Number(i.cost.toFixed(2)) }))
            );

            // 2. Fetch Recent Calls (Details)
            const { data: recent, error: recentError } = await supabase
                .from('calls')
                .select('*')
                .eq('organization_id', organization.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;

            // Format Recent Calls
            if (recent) {
                const formattedRecent = recent.map(call => {
                    // Determine Caller Name
                    let callerName = "Unknown Caller";
                    let callerNumber = "Unknown Number";

                    // Check extracted_data (from user schema)
                    if (call.extracted_data?.customer_name) {
                        callerName = call.extracted_data.customer_name;
                        // Attempt to extract name from summary with multiple patterns
                        const summary = call.summary || '';

                        // Patterns to check:
                        // 1. "The user, [Name], ..."
                        // 2. "User [Name] ..."
                        // 3. "Customer [Name] ..."
                        // 4. "[Name] called..."
                        // 5. "Agent spoke with [Name]..."
                        const patterns = [
                            /(?:user|caller|customer),?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
                            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:called|reached out|contacted)/,
                            /spoke\s+with\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
                        ];

                        for (const pattern of patterns) {
                            const match = summary.match(pattern);
                            if (match && match[1] && match[1].toLowerCase() !== 'the') { // Avoid capturing "The"
                                callerName = match[1];
                                break;
                            }
                        }
                    }

                    console.log(`Call ID: ${call.id}, Encoded Name: ${callerName}, Summary: ${call.summary}`);

                    // Try to find number (missing from schema in prompt, assuming `from_number` or generic)
                    // If not in columns, maybe in raw_data
                    // For now, placeholder

                    // Status Mapping
                    let status = "Completed";
                    const reason = (call.disconnection_reason || '').toLowerCase();
                    if (reason.includes('missed') || reason.includes('no_answer')) status = "Missed";
                    else if (reason.includes('voicemail')) status = "Voicemail";
                    else if (call.status === 'failed') status = "Failed";

                    // Time ago
                    const diffMs = new Date() - new Date(call.created_at);
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);
                    let timeAgo = `${diffMins} mins ago`;
                    if (diffHours > 0) timeAgo = `${diffHours} hours ago`;
                    if (diffHours > 24) timeAgo = `${Math.floor(diffHours / 24)} days ago`;

                    // Duration format
                    const dur = call.duration_seconds || 0;
                    const durMin = Math.floor(dur / 60);
                    const durSec = dur % 60;

                    return {
                        id: call.id,
                        name: callerName,
                        number: callerNumber, // Needs real field
                        type: 'incoming', // Default for now
                        status: status,
                        duration: `${durMin}m ${durSec}s`,
                        cost: `${currency.symbol}${(Number(call.cost) || 0).toFixed(2)}`,
                        time: timeAgo
                    };
                });
                setRecentCalls(formattedRecent);
            }

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (organization?.id) {
            fetchDashboardData();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [organization?.id, currency, authLoading]); // Re-fetch if org or currency changes

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-[#000103] text-white font-sans overflow-hidden relative">
            {/* Static Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            {/* New Small Blobs */}
            <div className="absolute top-[20%] right-[30%] w-[150px] h-[150px] bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] left-[25%] w-[120px] h-[120px] bg-pink-500/15 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[10%] w-[100px] h-[100px] bg-emerald-500/15 blur-[50px] rounded-full pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-[200px] fixed left-0 top-0 bottom-0 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border-r border-white/10 z-50 p-4 hidden lg:flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        {/* Brand Logo Placeholder */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                            <LayoutDashboard size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Controx AI</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { icon: PieChart, label: 'Overview' },
                            { icon: Phone, label: 'Call Logs' },
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
            <main className="flex-1 ml-0 lg:ml-[200px] p-4 lg:p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-6"
                >
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button className="lg:hidden p-2 text-gray-400 border border-white/10 rounded-lg bg-white/5">
                                <LayoutDashboard size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-white mb-0.5">
                                    {organization?.name || user?.email || 'Agent'}
                                </h1>
                                <p className="text-gray-400 text-[10px] lg:text-xs">Welcome back, Ready to manage your calls.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Home / Landing Page Button */}
                            <a
                                href="/"
                                className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                title="Back to Landing Page"
                            >
                                <Home size={16} />
                            </a>

                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center">
                                <SettingsIcon size={16} className="text-gray-400" />
                            </div>
                            <div className="h-9 w-9 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                                {(organization?.name || user?.email || 'A').substring(0, 2)}
                            </div>
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex items-center justify-center h-[50vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : activeTab === 'Overview' && (
                        <div className="space-y-5">
                            {/* Stats Grid - Internal animation handles stagger */}
                            <div>
                                <StatsGrid currency={currency} stats={stats} />
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Line Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="lg:col-span-2"
                                >
                                    <AnalyticsChart currency={currency} customData={activityData} />
                                </motion.div>

                                {/* Pie Chart */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                    className="lg:col-span-1"
                                >
                                    <AnalyticsPieChart data={pieData} />
                                </motion.div>
                            </div>

                            {/* Recent Calls */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.5 }}
                            >
                                <RecentCalls currency={currency} calls={recentCalls} />
                            </motion.div>
                        </div>
                    )}

                    {activeTab === 'Settings' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Settings currency={currency} setCurrency={setCurrency} />
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
