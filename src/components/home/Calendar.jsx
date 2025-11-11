import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarSabha = () => {

    const adminReducer = useSelector(state => state.adminReducer)
    const [events, setEvents] = useState([]);

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && events.find(eventDate => isSameDay(eventDate, date))) {
            return <div className="dot"></div>; // Red dot for event dates
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Assuming adminReducer.attendance is an array of objects with a date property
            if (adminReducer && adminReducer.attendance) {
                const allIds = await Promise.all(adminReducer.attendance.map(async (option) => {
                    const date = new Date(option.date);
                    return date;
                }));
                setEvents(allIds);
            }
        };

        fetchData();

        return () => { };
    }, []);

    return (
        <div className='mt-4'>
            <Calendar
                tileContent={tileContent}
                formatShortWeekday={(locale, date) => {
                    const day = date.toLocaleDateString(locale, { weekday: 'short' });
                    return day.charAt(0); // Return only the first letter of the day name
                }}
            />
        </div>
    )
}

export default CalendarSabha