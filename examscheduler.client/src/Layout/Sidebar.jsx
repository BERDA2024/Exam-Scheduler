import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <nav className="sidebar">
            <button className="sidebar-button active">Home</button>
            <button className="sidebar-button">Exams</button>
            <button className="sidebar-button">Inbox</button>
            <button className="sidebar-button">Docs</button>
            <button className="sidebar-button">Calendar</button>
        </nav>
    );
}

export default Sidebar;