import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';
import "../Styles/ProfileSettingsPage.css";

const ChangePassword = () => {
    const [detailsModel, setDetailsModel] = useState({ CurrentPassword: '', NewPassword: '', ConfirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetailsModel((detailsModel) => ({
            ...detailsModel,
            [name]: value
        }));
    };

    // Handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        // Check if the new password and confirm password match
        if (detailsModel.NewPassword !== detailsModel.ConfirmPassword) {
            setErrorMessage('New password and confirmation do not match.');
            return;
        }
        if (authHeader != null) {
            try {
                const response = await fetch('https://localhost:7118/api/User/change-password', {
                    method: 'POST',
                    headers: {
                        ...authHeader,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        CurrentPassword: detailsModel.CurrentPassword,
                        NewPassword: detailsModel.NewPassword,
                        ConfirmPassword: detailsModel.ConfirmPassword
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

                setSuccessMessage(result.message); // This will be the success message returned from the API
                if (response.ok) {
                    console.log('Password changed successfully.');
                    setDetailsModel({ CurrentPassword: '', NewPassword: '', ConfirmPassword: '' });
                } else {
                    console.error('Failed to change');
                }
            } catch (error) {
                // Handle API error (e.g., incorrect current password)
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.errors || 'Something went wrong.');
                } else {
                    setErrorMessage('An error occurred while changing the password.');
                }
            }
        } else {
            alert("User not authenticated");
        }
    };

    return (
        <div className="change-password-form">
            <h2>Change Password</h2>

            {/* Display success message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Display error message */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="CurrentPassword"  // This needs to match the state key
                        value={detailsModel.CurrentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="NewPassword"  // This needs to match the state key
                        value={detailsModel.NewPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="ConfirmPassword"  // This needs to match the state key
                        value={detailsModel.ConfirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;