import React from 'react';
import './DayDetail.css';

const DayDetail = ({ selectedDay, events }) => {

    if (!selectedDay || events.length === 0) {
        return <div className="day-detail">No exams scheduled for this day.</div>;
    }

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
                                    <strong>Time:</strong> {event.time} <br />
                                    <strong>Type:</strong> {event.examType} <br />
                                    <strong>Duration:</strong> {event.duration} minutes <br />
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
