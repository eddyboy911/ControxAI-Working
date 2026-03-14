import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Billing from '../../components/dashboard/Billing';

const BillingPage = () => {
    const { currency, allCalls } = useOutletContext();

    return (
        <Billing currency={currency} calls={allCalls} />
    );
};

export default BillingPage;
