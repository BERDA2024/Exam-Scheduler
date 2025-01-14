import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import DepartmentSelector from "../Utils/DepartmentSelector";
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";

const GroupForm = ({ group, onClose, onRefresh }) => {
    const [groupDetails, setGroupDetails] = useState(group ? group : { id: 0, departmentName: '', groupName: '', studyYear: 0 });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setGroupDetails((groupDetails) => ({
            ...groupDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            const response = await fetch(address + `api/Group/` + (group ? `${ groupDetails.id }` : ``), {
                method: (group? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: groupDetails.id,
                    DepartmentName: groupDetails.departmentName,
                    GroupName: groupDetails.groupName,
                    StudyYear: groupDetails.studyYear
                }),
            });
            if (response.ok) {
                setSuccessMessage(response.message);
                onRefresh(); // Refresh the list
                onClose(); // Close the form
            }
            else {
                setErrorMessage('Operation Failed');
                console.error(response);
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>

                     <div className="form-input-div">
                        <label>Department:</label>
                        <DepartmentSelector
                            selectName="departmentName" // Ensure this matches the key in groupDetails
                            departmentValue={groupDetails.departmentName}
                            onDepartmentChange={handleChange}
                            includeNone={true}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Group Name:</label>
                        <input
                            type="text"
                            name="groupName"
                            value={groupDetails.groupName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Study Year:</label>
                        <input
                            type="number"
                            name="studyYear"
                            value={groupDetails.studyYear}
                            min="1" // Minimum value allowed
                            max="6" // Maximum value allowed
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{group ? "Update" : "Add"} Group</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupForm;