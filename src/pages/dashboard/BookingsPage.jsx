import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Bookings from '../../components/dashboard/Bookings';

const BookingsPage = () => {
    const { bookings, allCalls, bookingsLoading } = useOutletContext();

    return (
        <Bookings
            bookings={bookings}
            calls={allCalls}
            loading={bookingsLoading}
        />
    );
};

export default BookingsPage;
