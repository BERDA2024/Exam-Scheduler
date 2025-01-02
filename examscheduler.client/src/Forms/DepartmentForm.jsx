import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";

const DepartmentForm = ({ department, onClose, onRefresh }) => {
    const [departmentDetails, setDepDetails] = useState(department ? department : { id: 0, longName: '', shortName: '',facultyName:'' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setDepDetails((depDetails) => ({
            ...depDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            console.log(departmentDetails);
            const response = await fetch(address + `api/Department/` + (department ? `${ departmentDetails.id }` : ``), {
                method: (department? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: departmentDetails.id,
                    ShortName: departmentDetails.shortName,
                    LongName: departmentDetails.longName,
                    FacultyName: departmentDetails.facultyName
                }),
            });

            if (response.ok) {
                setSuccessMessage(response.message);
                onRefresh(); // Refresh the list
                onClose(); // Close the form
            }
            else {
                setErrorMessage('Operation Failed');
                console.error(response.message);
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
                            value={departmentDetails.longName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Short Name:</label>
                        <input
                            type="text"
                            name="shortName"
                            value={departmentDetails.shortName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{department ? "Update" : "Add"} Department</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;