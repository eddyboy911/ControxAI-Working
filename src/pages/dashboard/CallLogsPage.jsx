import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CallLogs from '../../components/dashboard/CallLogs';

const CallLogsPage = () => {
    const { currency, formattedAllCalls, loading } = useOutletContext();

    return (
        <CallLogs
            currency={currency}
            calls={formattedAllCalls}
            loading={loading}
        />
    );
};

export default CallLogsPage;
