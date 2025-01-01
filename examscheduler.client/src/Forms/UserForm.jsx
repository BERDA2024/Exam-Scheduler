import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getUserRole } from '../Utils/RoleUtils';
import { getURL } from '../Utils/URLUtils';
import RoleSelector from '../Utils/RoleSelector';
import FacultySelector from '../Utils/FacultySelector';
import "./FormStyles.css";

const UserForm = ({ user, onClose, onRefresh }) => {
    const [userDetails, setUserDetails] = useState(user ? user : { id: '', email: '', lastName: '', firstName: '', role: '', faculty:'' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();
    const role = getUserRole();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setUserDetails((userDetails) => ({
            ...userDetails,
            [name]: value, // Dynamically update the corresponding property
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
                    Role: userDetails.role,
                    Faculty: userDetails.faculty
                }),
            });

            const text = await response.text();  // Get raw response text

            let result;
            try {
                result = JSON.parse(text);  // Attempt to parse it as JSON
            } catch (e) {
                setErrorMessage("Invalid server response.");
                console.error(text);
                return;
            }
            if (response.ok) {
                setSuccessMessage(result.message); // This will be the success message returned from the API
                onRefresh(); // Refresh the user list
                onClose(); // Close the form
            }
            else {
                setErrorMessage('Operation Failed');
                console.error(result.message);
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
                        <RoleSelector
                            selectName="role" // Ensure this matches the key in userDetails
                            roleValue={userDetails.role}
                            onRoleChange={handleChange}
                            includeAllRoles={false}
                            includeNone={true}
                        />
                    </div>

                    {role == 'Admin' && <div className="form-input-div">
                        <label>Faculty:</label>
                        <FacultySelector
                            selectName="faculty" // Ensure this matches the key in userDetails
                            facultyValue={userDetails.faculty}
                            onFacultyChange={handleChange}
                            includeNone={true}
                        />
                    </div>}

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