import React from 'react';
import './DayDetail.css';

const DayDetail = ({ selectedDay, events }) => {
    return (
        <div className="day-detail">
            {selectedDay ? (
                <>
                    <h3>Day {selectedDay}</h3>
                    <div className="events-list">
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <div key={index} className="event-item">
                                    <strong>Subject:</strong> {event.subject} <br />
                                    <strong>Classroom:</strong> {event.classroom} <br />
                                    <strong>Time:</strong> {event.time}
                                </div>
                            ))
                        ) : (
                            <p>No exams for this day.</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Select a day to see details.</p>
            )}
        </div>
    );
};

export default DayDetail;
