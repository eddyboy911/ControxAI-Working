import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import {
    LayoutDashboard,
    Building2,
    Bot,
    BarChart3,
    LogOut,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Users,
    PhoneCall,
    DollarSign,
    Activity,
    Edit,
    Trash2,
    X,
    TrendingUp,
    Zap,
} from 'lucide-react';

const AdminDashboard = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    // Persist active tab in localStorage
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('adminActiveTab') || 'overview';
    });

    // Save to localStorage whenever activeTab changes
    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    const [searchQuery, setSearchQuery] = useState('');

    // Modal states - persisted in localStorage
    const [showCreateOrgModal, setShowCreateOrgModal] = useState(() => {
        return localStorage.getItem('showCreateOrgModal') === 'true';
    });
    
    // Edit Org state (not persisted, session only)
    const [showEditOrgModal, setShowEditOrgModal] = useState(false);
    const [editOrgForm, setEditOrgForm] = useState({ id: '', name: '', email: '' });

    const [showLinkAgentModal, setShowLinkAgentModal] = useState(() => {
        return localStorage.getItem('showLinkAgentModal') === 'true';
    });
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    // Form states - persisted in localStorage
    const [orgForm, setOrgForm] = useState(() => {
        const saved = localStorage.getItem('orgForm');
        return saved ? JSON.parse(saved) : { name: '', email: '' };
    });
    const [agentForm, setAgentForm] = useState(() => {
        const saved = localStorage.getItem('agentForm');
        return saved ? JSON.parse(saved) : { orgId: '', agentName: '', retellId: '' };
    });

    // Save modal states to localStorage
    useEffect(() => {
        localStorage.setItem('showCreateOrgModal', showCreateOrgModal);
    }, [showCreateOrgModal]);

    useEffect(() => {
        localStorage.setItem('showLinkAgentModal', showLinkAgentModal);
    }, [showLinkAgentModal]);

    // Save form data to localStorage
    useEffect(() => {
        localStorage.setItem('orgForm', JSON.stringify(orgForm));
    }, [orgForm]);

    useEffect(() => {
        localStorage.setItem('agentForm', JSON.stringify(agentForm));
    }, [agentForm]);

    // Track if modals were just opened (for animation) vs restored from localStorage
    const [isOrgModalNewlyOpened, setIsOrgModalNewlyOpened] = useState(!localStorage.getItem('showCreateOrgModal'));
    const [isAgentModalNewlyOpened, setIsAgentModalNewlyOpened] = useState(!localStorage.getItem('showLinkAgentModal'));

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call Edge Function to create organization + user automatically
            const { data, error } = await supabase.functions.invoke('create-organization', {
                body: {
                    name: orgForm.name,
                    email: orgForm.email
                }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            // Success!
            alert(`✅ Organization "${data.organization.name}" created successfully!

👤 User Account Auto-Created:
Email: ${data.credentials.email}
Password: ${data.credentials.password}

✉️ The user can now log in immediately with these credentials!
They should change their password after first login.`);

            setShowCreateOrgModal(false);
            setOrgForm({ name: '', email: '' });

            // Clear localStorage
            localStorage.removeItem('showCreateOrgModal');
            localStorage.removeItem('orgForm');

            // Refresh organizations list
            console.log('Refreshing organizations list...');
            await fetchOrganizations();

            // Auto-switch to Organizations tab to show the new org
            setActiveTab('organizations');

        } catch (err) {
            console.error('Error creating organization:', err);
            alert(`❌ Error creating organization: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkAgent = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Insert agent into database
            const { data, error } = await supabase
                .from('agents')
                .insert([{
                    organization_id: agentForm.orgId,
                    name: agentForm.agentName,
                    retell_agent_id: agentForm.retellId,
                    is_active: true
                }])
                .select()
                .single();

            if (error) throw error;

            alert(`✅ Agent "${agentForm.agentName}" linked successfully!`);

            setShowLinkAgentModal(false);
            setAgentForm({ orgId: '', agentName: '', retellId: '' });

            // Clear localStorage
            localStorage.removeItem('showLinkAgentModal');
            localStorage.removeItem('agentForm');

            // Refresh organizations list to update agent counts
            await fetchOrganizations();
            // Refresh agents list to show new agent
            await fetchAgents();

        } catch (err) {
            console.error('Error linking agent:', err);
            alert(`❌ Error linking agent: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrg = async (orgId) => {
        if (!confirm('Are you sure you want to delete this organization? This will also delete all associated agents and data.')) {
            setActiveActionMenu(null);
            return;
        }

        setLoading(true);

        try {
            // Delete organization (cascade will handle agents and members)
            const { error } = await supabase
                .from('organizations')
                .delete()
                .eq('id', orgId);

            if (error) throw error;

            alert('✅ Organization deleted successfully!');

            // Refresh organizations list
            await fetchOrganizations();

        } catch (err) {
            console.error('Error deleting organization:', err);
            alert(`❌ Error deleting organization: ${err.message}`);
        } finally {
            setLoading(false);
            setActiveActionMenu(null);
        }
    };

    const handleEditOrg = (orgId) => {
        const org = organizations.find(o => o.id === orgId);
        if (org) {
            setEditOrgForm({ id: org.id, name: org.name, email: org.email });
            setShowEditOrgModal(true);
        }
        setActiveActionMenu(null);
    };

    const submitEditOrg = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('organizations')
                .update({ name: editOrgForm.name })
                .eq('id', editOrgForm.id);

            if (error) throw error;
            
            alert('✅ Organization updated successfully!');
            setShowEditOrgModal(false);
            await fetchOrganizations();
        } catch (err) {
            console.error('Error updating organization:', err);
            alert(`❌ Error updating organization: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (activeActionMenu !== null) {
                setActiveActionMenu(null);
            }
        };

        if (activeActionMenu !== null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeActionMenu]);

    // Sidebar tabs configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'organizations', label: 'Organizations', icon: Building2 },
        { id: 'agents', label: 'Agents', icon: Bot },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];



    // Real data from Supabase
    const [organizations, setOrganizations] = useState([]);
    const [agents, setAgents] = useState([]);
    const [overviewStats, setOverviewStats] = useState({
        totalOrgs: 0,
        activeAgents: 0,
        totalCalls: 0,
        totalCost: 0,
        activityData: [] // For the graph
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch organizations from Supabase
    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('organizations')
                .select(`
                    id,
                    name,
                    billing_email,
                    status,
                    created_at,
                    agents (count)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('Fetched organizations from Supabase:', data);

            // Format the data
            const formattedOrgs = data.map(org => ({
                id: org.id,
                name: org.name,
                email: org.billing_email,
                status: org.status || 'active',
                agents: org.agents?.[0]?.count || 0,
                created: new Date(org.created_at).toLocaleDateString()
            }));

            console.log('Formatted organizations:', formattedOrgs);

            setOrganizations(formattedOrgs);
            setError(null);
        } catch (err) {
            console.error('Error fetching organizations:', err);
            setError(err.message);
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch agents from Supabase
    const fetchAgents = async () => {
        try {
            const { data, error } = await supabase
                .from('agents')
                .select(`
                    id,
                    name,
                    retell_agent_id,
                    is_active,
                    created_at,
                    organizations (
                        id,
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('Fetched agents from Supabase:', data);

            // Format the data
            const formattedAgents = data.map(agent => ({
                id: agent.id,
                name: agent.name,
                retellId: agent.retell_agent_id,
                organization: agent.organizations?.name || 'Unknown',
                organizationId: agent.organizations?.id || '',
                status: agent.is_active ? 'active' : 'inactive',
                created: new Date(agent.created_at).toLocaleDateString()
            }));

            console.log('Formatted agents:', formattedAgents);

            setAgents(formattedAgents);
        } catch (err) {
            console.error('Error fetching agents:', err);
            setAgents([]);
        }
    };

    // Fetch overview stats
    const fetchOverviewStats = async () => {
        try {
            // Fetch Organization Count
            const { count: orgCount, error: orgError } = await supabase
                .from('organizations')
                .select('*', { count: 'exact', head: true });

            if (orgError) throw orgError;

            // Fetch Active Agents Count
            const { count: agentCount, error: agentError } = await supabase
                .from('agents')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            if (agentError) throw agentError;

            // Fetch Total Calls Count
            const { count: callCount, error: callError } = await supabase
                .from('calls')
                .select('*', { count: 'exact', head: true });

            if (callError) {
                console.warn('Error fetching calls count:', callError);
            }

            // Fetch Total Cost
            const { data: costData, error: costError } = await supabase
                .from('calls')
                .select('cost');

            let totalCost = 0;
            if (!costError && costData) {
                totalCost = costData.reduce((sum, call) => sum + (Number(call.cost) || 0), 0);
            }

            // Fetch calls for graph (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today + 6 days back
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const { data: callsData, error: graphError } = await supabase
                .from('calls')
                .select('started_at, cost')
                .gte('started_at', sevenDaysAgo.toISOString());

            if (graphError) throw graphError;

            // Process graph data
            const activityMap = new Map();

            // Initialize last 7 days with 0
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
                activityMap.set(dayName, { name: dayName, calls: 0, cost: 0, date: d });
            }

            // Aggregate data
            if (callsData) {
                callsData.forEach(call => {
                    const date = new Date(call.started_at);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    if (activityMap.has(dayName)) {
                        const dayStats = activityMap.get(dayName);
                        dayStats.calls += 1;
                        dayStats.cost += (call.cost || 0);
                    }
                });
            }

            // Convert to array and sort by date (oldest to newest)
            const recentActivity = Array.from(activityMap.values())
                .sort((a, b) => a.date - b.date)
                .map(item => ({
                    name: item.name,
                    calls: item.calls,
                    cost: Number(item.cost.toFixed(2))
                }));

            setOverviewStats(prev => ({
                ...prev,
                totalOrgs: orgCount || 0,
                activeAgents: agentCount || 0,
                totalCalls: callCount || 0,
                totalCost: totalCost,
                activityData: recentActivity
            }));

        } catch (err) {
            console.error('Error fetching overview stats:', err);
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchOrganizations();
        fetchAgents();
        fetchOverviewStats();
    }, []);

    // Stats data - Moved here to access overviewStats state
    const stats = [
        { label: 'Total Organizations', value: overviewStats.totalOrgs, icon: Building2, trend: '+0%' },
        { label: 'Active Agents', value: overviewStats.activeAgents, icon: Zap, trend: '+0%' },
        { label: 'Total Calls', value: overviewStats.totalCalls, icon: PhoneCall, trend: '+0%' },
        { label: 'Total Cost', value: `$${overviewStats.totalCost.toFixed(2)}`, icon: DollarSign, trend: '+0%' },
    ];

    // Stagger animation variants (opacity only - no slide)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B0F] text-white relative overflow-hidden">
            {/* Animated background blobs - matching client dashboard */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-blob animation-delay-2000" />
                <div className="absolute top-[20%] right-[30%] w-[150px] h-[150px] bg-cyan-500/20 blur-[80px] rounded-full animate-blob animation-delay-4000" />
                <div className="absolute bottom-[20%] left-[25%] w-[120px] h-[120px] bg-pink-500/15 blur-[60px] rounded-full animate-blob animation-delay-6000" />
                <div className="absolute top-[40%] left-[10%] w-[100px] h-[100px] bg-emerald-500/15 blur-[50px] rounded-full" />
            </div>

            {/* Glass Sidebar */}
            <aside className="fixed left-4 top-4 bottom-4 w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl z-50">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                Controx AI
                            </h1>
                            <p className="text-xs text-gray-400">Super Admin</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? 'bg-[#0044CE] text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{tab.label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-80 mr-4 my-4 min-h-[calc(100vh-2rem)]">
                {/* Glass Header */}
                <header className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-6 mb-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-1">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-sm text-gray-400">Manage your organizations and AI agents</p>
                        </div>
                        {activeTab === 'organizations' && (
                            <motion.button
                                onClick={() => {
                                    setIsOrgModalNewlyOpened(true);
                                    setShowCreateOrgModal(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-2xl font-medium shadow-xl shadow-purple-500/20 transition-all duration-300"
                            >
                                <Plus size={18} />
                                Create Organization
                            </motion.button>
                        )}
                        {activeTab === 'agents' && (
                            <motion.button
                                onClick={() => {
                                    setIsAgentModalNewlyOpened(true);
                                    setShowLinkAgentModal(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-2xl font-medium shadow-xl shadow-purple-500/20 transition-all duration-300"
                            >
                                <Plus size={18} />
                                Link Agent
                            </motion.button>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <div className="space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Stats Grid with Stagger Animation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-xl cursor-pointer transition-all duration-300"
                                        >
                                            {/* Horizontal layout: icon left, text right */}
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 flex-shrink-0">
                                                    <Icon size={24} className="text-gray-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
                                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                                </div>
                                                <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20 flex-shrink-0">
                                                    {stat.trend}
                                                </span>
                                            </div>

                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Activity Card */}
                            <motion.div
                                variants={itemVariants}
                                // Removed specific styling here as AnalyticsChart contains its own GlassCard
                                className=""
                            >
                                <AnalyticsChart
                                    currency={{ symbol: '$', code: 'USD' }}
                                    customData={overviewStats.activityData.length > 0 ? overviewStats.activityData : undefined}
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Organizations Tab */}
                    {activeTab === 'organizations' && (
                        <div className="space-y-6">
                            {/* Search and Filters */}
                            <motion.div
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex-1 relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search organizations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-4 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/20 rounded-2xl transition-all"
                                >
                                    <Filter size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-300">Filter</span>
                                </motion.button>
                            </motion.div>

                            {/* Organizations Table */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-visible"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left px-8 py-5 text-sm font-semibold text-gray-300">Organization</th>
                                                <th className="text-left px-8 py-5 text-sm font-semibold text-gray-300">Email</th>
                                                <th className="text-left px-8 py-5 text-sm font-semibold text-gray-300">Status</th>
                                                <th className="text-left px-8 py-5 text-sm font-semibold text-gray-300">Agents</th>
                                                <th className="text-left px-8 py-5 text-sm font-semibold text-gray-300">Created</th>
                                                <th className="text-right px-8 py-5 text-sm font-semibold text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="px-8 py-16 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="w-8 h-8 border-2 border-gray-500/30 border-t-gray-300 rounded-full animate-spin"></div>
                                                            <span className="text-gray-400">Loading organizations...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td colSpan="6" className="px-8 py-16 text-center">
                                                        <div className="text-red-400">
                                                            <p className="mb-2">Error loading organizations</p>
                                                            <p className="text-sm text-gray-500">{error}</p>
                                                            <button
                                                                onClick={fetchOrganizations}
                                                                className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm transition-all"
                                                            >
                                                                Retry
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : organizations.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-8 py-16 text-center text-gray-400">
                                                        <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                                                        <p className="text-lg">No organizations yet</p>
                                                        <p className="text-sm mt-2">Click "Create Organization" to get started</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                organizations.map((org, index) => (
                                                    <motion.tr
                                                        key={org.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                                    >
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-11 h-11 bg-gradient-to-br from-slate-500/20 to-slate-700/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
                                                                    <Building2 size={18} className="text-gray-300" />
                                                                </div>
                                                                <span className="font-medium text-white">{org.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-gray-400 text-sm">{org.email}</td>
                                                        <td className="px-8 py-5">
                                                            <span
                                                                className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${org.status === 'active'
                                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                                    }`}
                                                            >
                                                                {org.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 text-gray-400 text-sm">{org.agents} linked</td>
                                                        <td className="px-8 py-5 text-gray-400 text-sm">{org.created}</td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center justify-end gap-2 relative">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveActionMenu(activeActionMenu === org.id ? null : org.id);
                                                                    }}
                                                                    className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                                                                >
                                                                    <MoreVertical size={16} className="text-gray-400" />
                                                                </motion.button>

                                                                {/* Dropdown Menu */}
                                                                {activeActionMenu === org.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        className="absolute right-0 top-full mt-2 bg-[#1A1B1F]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 py-2 min-w-[160px]"
                                                                    >
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditOrg(org.id);
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                                                                        >
                                                                            <Edit size={16} />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteOrg(org.id);
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                            Delete
                                                                        </button>
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Agents Tab */}
                    {activeTab === 'agents' && (
                        <div className="space-y-6">
                            {/* Agents Table */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-6 px-8 text-sm font-medium text-gray-400">Agent Name</th>
                                                <th className="text-left py-6 px-8 text-sm font-medium text-gray-400">Retell ID</th>
                                                <th className="text-left py-6 px-8 text-sm font-medium text-gray-400">Organization</th>
                                                <th className="text-left py-6 px-8 text-sm font-medium text-gray-400">Status</th>
                                                <th className="text-left py-6 px-8 text-sm font-medium text-gray-400">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agents.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-12 text-gray-400">
                                                        <Bot size={48} className="mx-auto mb-3 opacity-30" />
                                                        <p>No agents linked yet</p>
                                                        <p className="text-sm mt-2">Use "Link Agent" button to add agents</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                agents.map((agent) => (
                                                    <motion.tr
                                                        key={agent.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                                        className="border-b border-white/5 last:border-0 cursor-pointer transition-colors"
                                                    >
                                                        <td className="py-6 px-8">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white/10 rounded-xl">
                                                                    <Bot size={18} className="text-gray-300" />
                                                                </div>
                                                                <span className="font-medium text-white">{agent.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-8 text-gray-300 font-mono text-sm">{agent.retellId}</td>
                                                        <td className="py-6 px-8 text-gray-300">{agent.organization}</td>
                                                        <td className="py-6 px-8">
                                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${agent.status === 'active'
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                                                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                                                                }`}>
                                                                {agent.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-8 text-gray-400 text-sm">{agent.created}</td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-xl"
                        >
                            <BarChart3 size={64} className="mx-auto mb-6 text-gray-400 opacity-50" />
                            <h3 className="text-2xl font-bold mb-3 text-white">Analytics Dashboard</h3>
                            <p className="text-gray-400">Comprehensive analytics and insights coming soon...</p>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Create Organization Modal */}
            {showCreateOrgModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        // Only close if clicking the backdrop itself, not bubbled events
                        if (e.target === e.currentTarget) {
                            setShowCreateOrgModal(false);
                        }
                    }}
                >
                    <motion.div
                        initial={isOrgModalNewlyOpened ? { opacity: 0, scale: 0.9, y: 20 } : false}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Create Organization
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowCreateOrgModal(false)}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                            >
                                <X size={20} className="text-gray-400" />
                            </motion.button>
                        </div>

                        <form onSubmit={handleCreateOrg} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={orgForm.name}
                                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                                    required
                                    placeholder="Acme Corp"
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Admin Email
                                </label>
                                <input
                                    type="email"
                                    value={orgForm.email}
                                    onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                                    required
                                    placeholder="admin@acme.com"
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                />
                            </div>

                            <p className="text-sm text-gray-400 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
                                User account will be auto-created with password: <span className="text-gray-300 font-mono font-semibold">123456</span>
                            </p>

                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowCreateOrgModal(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium transition-all"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-2xl font-medium shadow-xl shadow-purple-500/20 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Edit Organization Modal */}
            {showEditOrgModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowEditOrgModal(false);
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Edit Organization
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowEditOrgModal(false)}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                            >
                                <X size={20} className="text-gray-400" />
                            </motion.button>
                        </div>
                        <form onSubmit={submitEditOrg} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={editOrgForm.name}
                                    onChange={(e) => setEditOrgForm({ ...editOrgForm, name: e.target.value })}
                                    required
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Admin Email <span className="text-gray-500">(Cannot be changed)</span>
                                </label>
                                <input
                                    type="email"
                                    value={editOrgForm.email}
                                    disabled
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-gray-400 opacity-70 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowEditOrgModal(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium transition-all"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-2xl font-medium shadow-xl shadow-purple-500/20 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Link Agent Modal */}
            {showLinkAgentModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        // Only close if clicking the backdrop itself
                        if (e.target === e.currentTarget) {
                            setShowLinkAgentModal(false);
                        }
                    }}
                >
                    <motion.div
                        initial={isAgentModalNewlyOpened ? { opacity: 0, scale: 0.9, y: 20 } : false}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Link Agent
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowLinkAgentModal(false)}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
                            >
                                <X size={20} className="text-gray-400" />
                            </motion.button>
                        </div>

                        <form onSubmit={handleLinkAgent} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Organization
                                </label>
                                <select
                                    value={agentForm.orgId}
                                    onChange={(e) => setAgentForm({ ...agentForm, orgId: e.target.value })}
                                    required
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                >
                                    <option value="" className="bg-[#1A1B1F]">Select organization...</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id} className="bg-[#1A1B1F]">
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    value={agentForm.agentName}
                                    onChange={(e) => setAgentForm({ ...agentForm, agentName: e.target.value })}
                                    required
                                    placeholder="My AI Agent"
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Retell Agent ID
                                </label>
                                <input
                                    type="text"
                                    value={agentForm.retellId}
                                    onChange={(e) => setAgentForm({ ...agentForm, retellId: e.target.value })}
                                    required
                                    placeholder="agent_xxxxxxxxxx"
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setShowLinkAgentModal(false)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium transition-all"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-2xl font-medium shadow-xl shadow-purple-500/20 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Linking...' : 'Link Agent'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 20s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
