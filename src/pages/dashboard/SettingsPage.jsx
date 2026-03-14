import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Settings from '../../components/dashboard/Settings';

const SettingsPage = () => {
    const { currency, setCurrency } = useOutletContext();

    return (
        <Settings currency={currency} setCurrency={setCurrency} />
    );
};

export default SettingsPage;
