import React, { useState, useEffect } from 'react';
import { getUserRole } from '../Utils/RoleUtils';
import './Sidebar.css';
import DashboardPage from '../Pages/DashboardPage';



const Sidebar = ({ setActiveContent }) => {
    const [userRole, setUserRole] = useState(null);

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
                    className="sidebar-button"
                    key={index}
                    onClick={() => setActiveContent(button.action)}
                >
                    {button.label}
                </button>
            ))}
        </nav>
    );
};

export default Sidebar;