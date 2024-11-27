import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./VerticalNavbar.css"

const VerticalNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light ">
            <ul className="navbar-nav d-flex flex-column">
                <li className="nav-item"><a className="nav-link" href="#">Dashboard</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Calendar</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Exams</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Inbox</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Settings</a></li>
            </ul>
        </nav>
    );
};

export default VerticalNavbar;