import React, { useState, useEffect } from 'react';
import { getUserRole } from '../Utils/RoleUtils';
import DashboardPage from '../Pages/DashboardPage';
import './Sidebar.css';

const Sidebar = ({ setActiveContent }) => {
    const [userRole, setUserRole] = useState(null);
    const [activeButton, setActiveButton] = useState(null); // Tracks the active button

    const roleButtons = {
        Admin: [
            { label: "Admin Dashboard", action: <DashboardPage /> },
            { label: "Calendar", action: "Calendar" },
        ],
        Secretary: [
            { label: "Manage Students", action: "loadManageStudents" },
            { label: "Manage Calendar", action: "loadManageCalendar" },
        ],
        Professor: [
            { label: "Set Availability", action: "loadAvailability" },
        ],
        Student: [
            { label: "View Exams", action: "loadExams" },
        ],
        GroupLeader: [
            { label: "Request Exam", action: "loadExamRequest" },
        ],
    };

    useEffect(() => {
        const role = getUserRole();
        setUserRole(role);
    }, []);

    if (!userRole) {
        return <div>Loading...</div>;
    }

    const buttons = roleButtons[userRole] || [];


    return (
        <nav className="sidebar">
            {buttons.map((button, index) => (
                <button
                    className={`sidebar-button ${activeButton === button.label ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                        setActiveContent(button.action);
                        setActiveButton(button.label); // Set the clicked button as active
                    }}
                >
                    {button.label}
                </button>
            ))}
        </nav>
    );
};

export default Sidebar;