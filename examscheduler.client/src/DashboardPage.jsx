import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('authToken');
            console.log(token);

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
                    console.log(result);
                    setUser(result);
                } else if (response.status === 401) {
                    localStorage.removeItem('authToken');  // Clear expired token
                    navigate('/login');
                }
                console.log(response);
            } catch (error) {
                console.error('Failed to fetch user profile', error);
                navigate('/login'); // Redirect to login on error
            }
        };

        fetchUserProfile();
    }, [navigate]);

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
        <div className="dashboard">
            <h2>Welcome, {user ? user.FullName : 'Loading...'}</h2>
            <p>Email: {user ? user.Email : 'Loading...'}</p>
            <button onClick={logout}>Logout</button>  {/* Logout button */}
        </div>
    );
};

export default DashboardPage;