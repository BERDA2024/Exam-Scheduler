import React, { useState, useEffect } from 'react';
import { getUserRole } from '../Utils/RoleUtils';
import DashboardPage from '../Pages/DashboardPage';
import ProfileSettingsPage from '../Pages/ProfileSettingsPage';
import ManageUsersPage from '../Pages/ManageUsersPage';
import ManageFacultiesPage from '../Pages/ManageFacultiesPage';
import ManageDepartmentsPage from '../Pages/ManageDepartmentsPage';
import ManageGroupsPage from '../Pages/ManageGroupsPage';
import ManageSubjectsPage from '../Pages/ManageSubjectsPage';
import CalendarPage from '../Pages/CalendarPage';
import NotificationSettingsPage from '../Pages/NotificationSettingsPage'; // Import nou
import ScheduleExamPage from '../Pages/ScheduleExamPage';
import ProfessorManagementPage from '../Pages/ProfessorManagementPage';
import './Sidebar.css';
import ManageClassroomsPage from '../Pages/ManageClassroomsPage';

const Sidebar = ({ setActiveContent }) => {
    const [userRole, setUserRole] = useState(null);
    const [activeButton, setActiveButton] = useState(() => {
        // Retrieve the last selected button from localStorage or default to null
        return localStorage.getItem('activeButton') || null;
    });

    const roleButtons = {
        Admin: [
            { label: "Admin Dashboard", action: <DashboardPage /> },
            { label: "Manage Users", action: <ManageUsersPage /> },
            { label: "Manage Faculties", action: <ManageFacultiesPage /> }
            
        ],
        FacultyAdmin: [
            { label: "Manage Users", action: <ManageUsersPage /> },
            { label: "Manage Departments", action: <ManageDepartmentsPage /> },
            { label: "Manage Classrooms", action: <ManageClassroomsPage /> },
            { label: "Manage Subjects", action: <ManageSubjectsPage /> },
            { label: "Manage Groups", action: <ManageGroupsPage /> }
        ],
        Secretary: [
            { label: "Manage Users", action: <ManageUsersPage /> },
            { label: "Manage Groups", action: <ManageGroupsPage /> }
        ],
        Professor: [
            { label: "Exams Management", action: <ProfessorManagementPage /> },
        ],
        Student: [
            { label: "View Exams", action: "loadExams" },
        ],
        StudentGroupLeader: [
            { label: "Request Exam", action: <ScheduleExamPage /> },
        ],
    };

    const commonButtons = [
        { label: "Calendar", action: <CalendarPage /> },
        { label: "Settings", action: <ProfileSettingsPage /> },
        { label: "Notificări", action: <NotificationSettingsPage /> }, // Buton adăugat aici
    ];

    const getActionFromLabel = (label) => {
        // Find the corresponding action based on the label
        const allButtons = [...Object.values(roleButtons).flat(), ...commonButtons];
        const button = allButtons.find((btn) => btn.label === label);
        return button ? button.action : null;
    };

    useEffect(() => {
        const role = getUserRole();
        setUserRole(role);

        // Load the last active content from localStorage on initial load
        const lastActiveLabel = localStorage.getItem('activeButton');
        if (lastActiveLabel) {
            const lastActiveContent = getActionFromLabel(lastActiveLabel);
            setActiveContent(lastActiveContent);
        }
    }, [setActiveContent]);

    const handleButtonClick = (button) => {
        setActiveContent(button.action);
        setActiveButton(button.label);

        // Persist the active button label in localStorage
        localStorage.setItem('activeButton', button.label);
    };

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
                    onClick={() => handleButtonClick(button)}
                >
                    {button.label}
                </button>
            ))}

            {commonButtons.map((button, index) => (
                <button
                    className={`sidebar-button ${activeButton === button.label ? 'active' : ''}`}
                    key={index}
                    onClick={() => handleButtonClick(button)}
                >
                    {button.label}
                </button>
            ))}
        </nav>
    );
};

export default Sidebar;
