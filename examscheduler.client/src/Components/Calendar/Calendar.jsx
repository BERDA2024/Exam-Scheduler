import React, { useState, useEffect } from 'react';
import DayDetail from './DayDetail';
import './Calendar.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [examDays, setExamDays] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const authHeader = getAuthHeader();

    useEffect(() => {
        generateCalendarDays();
        fetchExamDays();
    }, [currentDate]);

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInThisMonth = new Date(year, month + 1, 0).getDate();
        const daysInLastMonth = new Date(year, month, 0).getDate();

        const leadingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];

        for (let i = leadingDays; i > 0; i--) {
            days.push({
                date: new Date(year, month - 1, daysInLastMonth - i + 1),
                isCurrentMonth: false,
            });
        }

        for (let i = 1; i <= daysInThisMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true,
            });
        }

        const trailingDays = 7 - (days.length % 7);
        for (let i = 1; i <= trailingDays && trailingDays < 7; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
            });
        }

        setCalendarDays(days);
    };

    const fetchExamDays = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'GET',
                headers: authHeader,
            });
            const data = await response.json();

            const filteredExams = data.filter((exam) => exam.requestStateID === 2);

            const daysWithExams = filteredExams.reduce((acc, exam) => {
                const examDate = new Date(exam.startDate);
                const examKey = `${examDate.getFullYear()}-${examDate.getMonth()}-${examDate.getDate()}`;

                if (!acc[examKey]) acc[examKey] = [];
                acc[examKey].push({
                    subject: exam.subjectName || 'Unknown',
                    classroom: exam.classroomName || 'Unknown',
                    time: examDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    examType: exam.examType || 'Unknown',
                    duration: exam.examDuration || 0,
                });

                return acc;
            }, {});

            setExamDays(daysWithExams);
        } catch (error) {
            console.error('Error fetching exam days:', error);
        }
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDay(null);
    };

    const handleDayClick = (day) => {
        if (day.isCurrentMonth) {
            setSelectedDay(day.date.getDate());
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={handlePreviousMonth}>&lt;</button>
                <h2>
                    {currentDate.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="weekday">
                        {day}
                    </div>
                ))}
            </div>
            <div className="calendar">
                {calendarDays.map((day, index) => {
                    const dayKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
                    const hasExam = examDays[dayKey];
                    return (
                        <div
                            key={index}
                            className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'
                                } ${hasExam ? 'has-exam' : ''} ${selectedDay === day.date.getDate() && day.isCurrentMonth ? 'selected' : ''
                                }`}
                            onClick={() => handleDayClick(day)}
                        >
                            {day.date.getDate()}
                        </div>
                    );
                })}
            </div>
            {selectedDay && (
                <DayDetail
                    selectedDay={selectedDay}
                    events={
                        selectedDay
                            ? examDays[
                            `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`
                            ] || []
                            : []
                    }
                />
            )}
        </div>
    );
};

export default Calendar;
