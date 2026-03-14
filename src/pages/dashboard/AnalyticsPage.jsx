import React from 'react';
import { Clock } from 'lucide-react';

const AnalyticsPage = () => {
    return (
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
    );
};

export default AnalyticsPage;
