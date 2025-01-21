import React, { useState, useEffect } from "react";
import "./ExamsTable.css"; // Importă fișierul CSS

const API_BASE_URL = "https://localhost:7118/api/Subject";

const ExamsTable = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch(API_BASE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch exams");
                }

                const data = await response.json();
                setExams(data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };

        fetchExams();
    }, []);

    return (
        <div className="exams-table-container">
            <h2 className="table-title">Exams List</h2>
            <table className="exams-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Long Name</th>
                        <th>Short Name</th>
                        <th>Professor ID</th>
                        <th>Department ID</th>
                        <th>Exam Duration</th>
                        <th>Exam Type</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <tr key={exam.id}>
                                <td>{exam.id}</td>
                                <td>{exam.longName}</td>
                                <td>{exam.shortName}</td>
                                <td>{exam.professorID}</td>
                                <td>{exam.departmentId}</td>
                                <td>{exam.examDuration}</td>
                                <td>{exam.examType}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No exams found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExamsTable;
