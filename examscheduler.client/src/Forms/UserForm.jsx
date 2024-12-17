import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";

const UserForm = ({ user, onClose, onRefresh }) => {
    const [userDetails, setUserDetails] = useState(user ? user : { id: '', email: '', lastName: '', firstName: '', role: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');

        setUserDetails((userDetails) => ({
            ...userDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            const response = await fetch(address + `api/Admin/` + (user ? `edit` : ``), {
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

            const text = await response.text();  // Get raw response text

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                setError("Invalid server response.");
                console.error(e);
                return;
            }
            if (response.ok) {
                setSuccessMessage(result.message); // This will be the success message returned from the API
                onRefresh(); // Refresh the user list
                onClose(); // Close the form
            }
            else {
                setErrorMessage(result.message);
                console.error('Failed to change');
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>
                    {!user && (
                        <div className= "form-input-div">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-input-div">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
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

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

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