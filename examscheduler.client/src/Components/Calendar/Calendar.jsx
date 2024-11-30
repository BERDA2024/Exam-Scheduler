import React, { useState, useEffect } from 'react';
import DayDetail from './DayDetail';
import AddEventPopup from './AddEventPopup';
import './Calendar.css';

const Calendar = () => {
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [events, setEvents] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        // Logic to fetch days of the current month and events for the selected day
        loadCalendar();
    }, []);

    const loadCalendar = () => {
        // Simulate loading the days of the month
        const days = Array.from({ length: 31 }, (_, i) => i + 1); // Example days of the month
        setDaysInMonth(days);

        if (selectedDay) {
            fetchEvents(selectedDay);
        }
    };

    const fetchEvents = (day) => {
        // Replace this with an actual API call to fetch events for a day
        setEvents([
            { id: 1, name: "Sample Event 1" },
            { id: 2, name: "Sample Event 2" }
        ]);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        fetchEvents(day);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                {daysInMonth.map(day => (
                    <div key={day} className="calendar-day" onClick={() => handleDayClick(day)}>
                        {day}
                    </div>
                ))}
            </div>
            <div className="day-detail">
                {selectedDay ? (
                    <>
                        <h3>Day {selectedDay}</h3>
                        <div className="events-list">
                            {events.length > 0 ? (
                                events.map(event => (
                                    <div key={event.id} className="event-item">
                                        {event.name}
                                    </div>
                                ))
                            ) : (
                                <p>No events for this day.</p>
                            )}
                        </div>
                        <button onClick={handleOpenPopup}>Add Event</button>
                    </>
                ) : (
                    <p>Select a day to see details.</p>
                )}
            </div>

            {isPopupOpen && <AddEventPopup onClose={handleClosePopup} />}
        </div>
    );
};

export default Calendar;