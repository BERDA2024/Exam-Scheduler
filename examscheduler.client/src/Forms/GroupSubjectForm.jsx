import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";
import GroupSelector from "../Utils/GroupSelector";
import SubjectSelector from "../Utils/SubjectSelector";

const GroupSubjectForm = ({ groupSubject, onClose, onRefresh }) => {
    const [groupSubjectDetails, setGroupSubjectDetails] = useState(groupSubject ? groupSubject : { id: 0, subjectName: '', groupName: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setGroupSubjectDetails((groupSubjectDetails) => ({
            ...groupSubjectDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            const response = await fetch(address + `api/GroupSubject/` + (groupSubject ? `${groupSubjectDetails.id}` : ``), {
                method: (groupSubject ? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: groupSubjectDetails.id,
                    SubjectName: groupSubjectDetails.subjectName,
                    GroupName: groupSubjectDetails.groupName,
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
                        <label>Group:</label>
                        <GroupSelector
                            selectName="groupName" // Ensure this matches the key in groupDetails
                            groupValue={groupSubjectDetails.groupName}
                            onGroupChange={handleChange}
                            includeNone={true}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Group:</label>
                        <SubjectSelector
                            selectName="subjectName" // Ensure this matches the key in groupDetails
                            subjectValue={groupSubjectDetails.subjectName}
                            onSubjectChange={handleChange}
                            includeNone={true}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{groupSubject ? "Update" : "Add"} Group Subject</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupSubjectForm;