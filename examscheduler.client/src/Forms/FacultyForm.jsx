import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";

const FacultyForm = ({ faculty, onClose, onRefresh }) => {
    const [facultyDetails, setFacultyDetails] = useState(faculty ? faculty : { id: 0, longName: '', shortName: ''});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setFacultyDetails((facultyDetails) => ({
            ...facultyDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            console.log(facultyDetails);
            const response = await fetch(address + `api/Admin/faculties/` + (faculty ? `edit` : ``), {
                method: (faculty ? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: facultyDetails.id,
                    LongName: facultyDetails.longName,
                    ShortName: facultyDetails.shortName,
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

                    <div className="form-input-div">
                        <label>Long Name:</label>
                        <input
                            type="text"
                            name="longName"
                            value={facultyDetails.longName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Short Name:</label>
                        <input
                            type="text"
                            name="shortName"
                            value={facultyDetails.shortName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{faculty ? "Update" : "Add"} Faculty</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FacultyForm;