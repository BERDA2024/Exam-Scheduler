import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";

const ClassroomForm = ({ classroom, onClose, onRefresh }) => {
    const [classroomDetails, setClassDetails] = useState(classroom ? classroom : { id: 0, name: '', shortName: '', buildingName:'' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setClassDetails((classDetails) => ({
            ...classDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            console.log(classroomDetails);
            const response = await fetch(address + `api/Classroom/` + (classroom ? `${ classroomDetails.id }` : ``), {
                method: (classroom? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: classroomDetails.id,
                    Name: classroomDetails.name,
                    ShortName: classroomDetails.shortName,
                    BuildingName: classroomDetails.buildingName
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
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={classroomDetails.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Short Name:</label>
                        <input
                            type="text"
                            name="shortName"
                            value={classroomDetails.shortName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Building Name:</label>
                        <input
                            type="text"
                            name="buildingName"
                            value={classroomDetails.buildingName}
                            onChange={handleChange}
                        />
                    </div>

                    

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{classroom ? "Update" : "Add"} Classroom</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassroomForm;