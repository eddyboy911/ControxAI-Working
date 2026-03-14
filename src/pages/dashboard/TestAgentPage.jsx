import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TestAgent from '../../components/dashboard/TestAgent';

const TestAgentPage = () => {
    const { organization } = useOutletContext();

    return (
        <div className="flex justify-start">
            <TestAgent organization={organization} />
        </div>
    );
};

export default TestAgentPage;
