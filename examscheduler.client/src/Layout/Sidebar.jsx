import React, { useEffect, useState } from 'react';
import CalendarPage from '../Pages/CalendarPage';
import DashboardPage from '../Pages/DashboardPage';
import ManageClassroomsPage from '../Pages/ManageClassroomsPage';
import ManageDepartmentsPage from '../Pages/ManageDepartmentsPage';
import ManageFacultiesPage from '../Pages/ManageFacultiesPage';
import ManageGroupsPage from '../Pages/ManageGroupsPage';
import ManageSubjectsPage from '../Pages/ManageSubjectsPage';
import ManageUsersPage from '../Pages/ManageUsersPage';
import NotificationsPage from '../Pages/NotificationsPage';
import ManageAvailability from '../Pages/AvailabilityManagementPage';
import ProfessorManagementPage from '../Pages/ProfessorManagementPage';
import ProfileSettingsPage from '../Pages/ProfileSettingsPage';
import ScheduleExamPage from '../Pages/ScheduleExamPage';
import { getUserRole } from '../Utils/RoleUtils';
import './Sidebar.css';

const Sidebar = ({ setActiveContent }) => {
    const [userRole, setUserRole] = useState(null);
    const [activeButton, setActiveButton] = useState(() => {
        return localStorage.getItem("activeButton") || null;
    });

    const roleButtons = {
        Admin: [
            { label: "Admin Dashboard", action: <DashboardPage /> },
            { label: "Manage Users", action: <ManageUsersPage /> },
            { label: "Manage Faculties", action: <ManageFacultiesPage /> },
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
            { label: "Manage Groups", action: <ManageGroupsPage /> },
        ],
        Professor: [
            { label: "Exams Management", action: <ProfessorManagementPage /> },
            { label: "Availability Management", action: <ManageAvailability /> },
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
        { label: "Notifications", action: <NotificationsPage /> }, // Butonul de notificări
    ];

    const getActionFromLabel = (label) => {
        const allButtons = [...Object.values(roleButtons).flat(), ...commonButtons];
        const button = allButtons.find((btn) => btn.label === label);
        return button ? button.action : null;
    };

    useEffect(() => {
        const role = getUserRole();
        setUserRole(role);

        const lastActiveLabel = localStorage.getItem("activeButton");
        if (lastActiveLabel) {
            const lastActiveContent = getActionFromLabel(lastActiveLabel);
            setActiveContent(lastActiveContent);
        }
    }, [setActiveContent]);

    const handleButtonClick = (button) => {
        setActiveContent(button.action);
        setActiveButton(button.label);
        localStorage.setItem("activeButton", button.label);
    };

    if (!userRole) {
        return <div>Loading...</div>;
    }

    const buttons = roleButtons[userRole] || [];

    return (
        <nav className="sidebar">
            {buttons.map((button, index) => (
                <button
                    className={`sidebar-button ${activeButton === button.label ? "active" : ""}`}
                    key={index}
                    onClick={() => handleButtonClick(button)}
                >
                    {button.label}
                </button>
            ))}

            {commonButtons.map((button, index) => (
                <button
                    className={`sidebar-button ${activeButton === button.label ? "active" : ""}`}
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
