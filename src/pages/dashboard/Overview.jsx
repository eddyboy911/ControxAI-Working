import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import StatsGrid from '../../components/dashboard/StatsGrid';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import AnalyticsPieChart from '../../components/dashboard/AnalyticsPieChart';
import RecentCalls from '../../components/dashboard/RecentCalls';

const Overview = () => {
    const { 
        currency, 
        stats, 
        activityData, 
        pieData, 
        recentCalls, 
        overviewFilter, 
        setOverviewFilter 
    } = useOutletContext();
    const navigate = useNavigate();

    return (
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
                onViewAll={() => navigate('/dashboard/call-logs')}
            />
        </div>
    );
};

export default Overview;
