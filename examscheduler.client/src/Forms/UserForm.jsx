import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import "./UserForm.css";

const UserForm = ({ user, onClose, onRefresh }) => {
    const [userDetails, setUserDetails] = useState(user ? user : { id: '', email: '', lastName: '', firstName: '', role: '' });
    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((userDetails) => ({
            ...userDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authHeader) {
            const response = await fetch(`https://localhost:7118/api/Admin/` + (user ? `edit` : ``), {
                method: (user ? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: userDetails.id,
                    Email: userDetails.email,
                    FirstName: userDetails.firstName,
                    LastName: userDetails.lastName,
                    Role: userDetails.role
                }),
            });

            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                console.error('Request Failed');
            }
        }
        onRefresh(); // Refresh the user list
        onClose(); // Close the form
    };

    return (
        <div className="user-form-container">
            <div className="user-form">
                <form onSubmit={handleSubmit}>
                    {!user && (
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Role:</label>
                        <select
                            name="role"
                            value={userDetails.role}
                            onChange={handleChange} required>
                            <option value=''>None</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Professor">Professor</option>
                            <option value="DepartmentHead">Department Head</option>
                            <option value="Student">Student</option>
                            <option value="StudentGroupLeader">Student Group Leader</option>
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button type="submit">{user ? "Update" : "Add"} User</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;