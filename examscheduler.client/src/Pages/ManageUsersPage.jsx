import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';
import "../Styles/ManageUsersPage.css";

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
};

export default ChangePassword;