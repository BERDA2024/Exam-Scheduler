import React from 'react';
import './DayDetail.css';

const DayDetail = ({ selectedDay, events, onAddEventClick }) => {
    return (
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
                    <button onClick={onAddEventClick}>Add Event</button>
                </>
            ) : (
                <p>Select a day to see details.</p>
            )}
        </div>
    );
};

export default DayDetail;