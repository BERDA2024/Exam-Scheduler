import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';
import "./ChangePasswordForm.css";

const ChangePasswordForm = () => {
    const [detailsModel, setDetailsModel] = useState({ CurrentPassword: '', NewPassword: '', ConfirmPassword: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const authHeader = getAuthHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSuccessMessage('');
        setErrorMessage('');
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

                if (response.ok) {
                    setSuccessMessage(result.message); // This will be the success message returned from the API
                    console.log('Password changed successfully.');
                    detailsModel.ConfirmPassword = '';
                    detailsModel.NewPassword = '';
                    detailsModel.CurrentPassword = '';
                    setDetailsModel(detailsModel);
                } else {
                    setErrorMessage(result.message);
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
        setDetailsModel(detailsModel);
    };

    return (
        <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="change-password-form div">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="CurrentPassword"
                    value={detailsModel.CurrentPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="change-password-form div">
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    name="NewPassword"
                    value={detailsModel.NewPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="change-password-form div">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="ConfirmPassword"
                    value={detailsModel.ConfirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Display success message */}
            {successMessage && <div className="message message-success">{successMessage}</div>}

            {/* Display error message */}
            {errorMessage && <div className="message message-error">{errorMessage}</div>}

            <button type="submit">Change Password</button>

        </form>
    );
};

export default ChangePasswordForm;