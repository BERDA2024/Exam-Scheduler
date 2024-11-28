import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const [showProfileTooltip, setShowProfileTooltip] = useState(false);
    const [user, setUser] = useState();
    const navigate = useNavigate();

    // Fetch user profile when the component mounts
    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    const contents = user === undefined
        ? <span><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></span>
        : <span>
            <span>{user.fullName}</span>
            <br></br>
            <span>Email: {user.email}</span>
        </span>;

    async function fetchUserProfile() {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        try {
            const response = await fetch('https://localhost:7118/api/User/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,  // Ensure the token is being passed correctly
                },
            });

            if (response.ok) {
                const result = await response.json();
                setUser(result);
            } else if (response.status === 401) {
                localStorage.removeItem('authToken');  // Clear expired token
                navigate('/login');
            }
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            navigate('/login'); // Redirect to login on error
        }
    }

    // Logout function
    const logout = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        try {
            // Call the logout API
            const response = await fetch('https://localhost:7118/api/User/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token with the request
                },
            });

            if (response.ok) {
                console.log('Logout successful');
                localStorage.removeItem('authToken');  // Clear the token from local storage
                navigate('/login');  // Redirect to login page after logging out
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <span className="logo">Exam Scheduler</span>
            </div>
            <div className="header-middle">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                />
            </div>
            <div className="header-right">
                <button className="icon-button">📅</button>
                <button className="icon-button">📝</button>
                <div
                    className="profile-icon-container"
                    onMouseEnter={() => setShowProfileTooltip(true)}
                    onMouseLeave={() => setShowProfileTooltip(false)}>
                    <button className="icon-button">👤</button>
                    {showProfileTooltip && (
                        <div className="profile-tooltip">
                            {contents}
                            <button>View Profile</button>
                            <button>Settings</button>
                            <button onClick={logout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;