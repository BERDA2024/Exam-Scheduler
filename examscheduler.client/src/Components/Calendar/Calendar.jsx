import React, { useState, useEffect } from 'react';
import DayDetail from './DayDetail';
import './Calendar.css';
import { getAuthHeader } from '../../Utils/AuthUtils';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [examDays, setExamDays] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const authHeader = getAuthHeader();

    useEffect(() => {
        loadCalendar();
        fetchExamDays();
    }, [currentDate]);

    const loadCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Numărul de zile în luna curentă
        const daysInThisMonth = new Date(year, month + 1, 0).getDate();
        setDaysInMonth(Array.from({ length: daysInThisMonth }, (_, i) => i + 1));
    };

    const fetchExamDays = async () => {
        try {
            const response = await fetch('https://localhost:7118/api/ScheduleRequest', {
                method: 'GET',
                headers: authHeader
            });
            const data = await response.json();

            const filteredExams = data.filter((exam) => exam.requestStateID === 2);

            const daysWithExams = filteredExams.reduce((acc, exam) => {
                const examDate = new Date(exam.startDate);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                if (
                    examDate.getFullYear() === year &&
                    examDate.getMonth() === month
                ) {
                    const day = examDate.getDate();
                    if (!acc[day]) acc[day] = [];
                    acc[day].push({
                        subject: exam.subjectName || 'Unknown',
                        classroom: exam.classroomName || 'Unknown',
                        time: examDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    });
                }
                return acc;
            }, {});

            setExamDays(daysWithExams);
        } catch (error) {
            console.error('Error fetching exam days:', error);
        }
    };

    const handlePreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
        setSelectedDay(null);
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
            <div className="calendar">
                {daysInMonth.map((day) => (
                    <div
                        key={day}
                        className={`calendar-day ${examDays[day] ? 'has-exam' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>
            <DayDetail
                selectedDay={selectedDay}
                events={examDays[selectedDay] || []}
            />
        </div>
    );
};

export default Calendar;
