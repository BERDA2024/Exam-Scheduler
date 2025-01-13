import React, { useState } from "react";
import { getAuthHeader } from '../Utils/AuthUtils';
import { getURL } from '../Utils/URLUtils';
import "./FormStyles.css";
import DepartmentSelector from "../Utils/DepartmentSelector";

const SubjectForm = ({ subject, onClose, onRefresh }) => {
    const [subjectDetails, setSubjectDetails] = useState(subject ? subject : { id: 0, longName: '', shortName: '', professorName: '', departmentShortName: '', examDuration: 0, examType: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const authHeader = getAuthHeader();
    const address = getURL();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuccessMessage('');
        setErrorMessage('');
        setSubjectDetails((subjectDetails) => ({
            ...subjectDetails,
            [name]: value, // Dynamically update the corresponding property
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset any previous messages
        setErrorMessage('');
        setSuccessMessage('');

        if (authHeader) {
            console.log(subjectDetails);
            const response = await fetch(address + `api/Subject/add/` + (subject ? `${ subjectDetails.id }` : ``), {
                method: (subject? "PUT" : "POST"),
                headers: { ...authHeader, "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: subjectDetails.id,
                    LongName: subjectDetails.longName,
                    ShortName: subjectDetails.shortName,
                    ProfessorName: subjectDetails.professorName,
                    DepartmentShortName: subjectDetails.departmentShortName,
                    ExamDuration: Number(subjectDetails.examDuration),
                    ExamType: subjectDetails.examType
                }),
            });
            const data = response.json();
            if (response.ok) {
                setSuccessMessage(response.message);
                onRefresh(); // Refresh the list
                onClose(); // Close the form
            }
            else {
                setErrorMessage('Operation Failed');
                console.error(data.message);
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={handleSubmit}>

                    <div className="form-input-div">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            name="longName"
                            value={subjectDetails.longName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Short Name:</label>
                        <input
                            type="text"
                            name="shortName"
                            value={subjectDetails.shortName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Professor Name:</label>
                        <input
                            type="text"
                            name="professorName"
                            value={subjectDetails.professorName}
                            onChange={handleChange}
                        />
                    </div>
                     <div className="form-input-div">
                        <label>Department:</label>
                        <DepartmentSelector
                            selectName="departmentShortName" // Ensure this matches the key in groupDetails
                            departmentValue={subjectDetails.departmentShortName}
                            onDepartmentChange={handleChange}
                            includeNone={true}
                        />
                    </div>

                    <div className="form-input-div">
                        <label>Exam Duration:</label>
                        <input
                            type="number"
                            name="examDuration"
                            value={subjectDetails.examDuration}
                            min="30" // Minimum value allowed
                            max="300" // Maximum value allowed
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-input-div">
                        <label>Exam type:</label>
                        <input
                            type="text"
                            name="examType"
                            value={subjectDetails.examType}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Display success message */}
                    {successMessage && <div className="message message-success">{successMessage}</div>}

                    {/* Display error message */}
                    {errorMessage && <div className="message message-error">{errorMessage}</div>}

                    <div className="form-buttons">
                        <button type="submit">{subject ? "Update" : "Add"} Subject</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubjectForm;