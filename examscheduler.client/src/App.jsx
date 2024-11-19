import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [formData, setFormData] = useState({
        subject: '',
        scheduledDate: '',
        roomId: '',
        professorId: '',
        capacity: ''
    });

    useEffect(() => {
        fetchExams();
    }, []);

    async function fetchExams() {
        const response = await fetch('https://localhost:7115/api/exams');
        if (response.ok) {
            const data = await response.json();
            setExams(data);
        }
    }

    async function saveExam() {
        const method = selectedExam ? 'PUT' : 'POST';
        const url = selectedExam ? `https://localhost:7115/api/exams/${selectedExam.id}` : 'https://localhost:7115/api/exams';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.text();
                alert(`Failed to save exam: ${error}`);
                return;
            }

            await fetchExams();
            resetForm();
        } catch (error) {
            console.error('Error during save:', error);
            alert('An unexpected error occurred.');
        }
    }

    async function deleteExam(id) {
        const response = await fetch(`https://localhost:7115/api/exams/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await fetchExams();
        }
    }

    function resetForm() {
        setSelectedExam(null);
        setFormData({
            subject: '',
            scheduledDate: '',
            roomId: '',
            professorId: '',
            capacity: ''
        });
    }

    function handleEdit(exam) {
        setSelectedExam(exam);
        setFormData({
            subject: exam.subject,
            scheduledDate: exam.scheduledDate,
            roomId: exam.roomId,
            professorId: exam.professorId,
            capacity: exam.capacity
        });
    }

    const contents = exams.length === 0
        ? <p><em>No exams available. Add a new one below!</em></p>
        : <table className="table table-striped">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Scheduled Date</th>
                    <th>Room</th>
                    <th>Professor</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {exams.map(exam =>
                    <tr key={exam.id}>
                        <td>{exam.subject}</td>
                        <td>{new Date(exam.scheduledDate).toLocaleString()}</td>
                        <td>{exam.roomId}</td>
                        <td>{exam.professorId}</td>
                        <td>{exam.capacity}</td>
                        <td>
                            <button onClick={() => handleEdit(exam)}>Edit</button>
                            <button onClick={() => deleteExam(exam.id)}>Delete</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div className="container">
            <h1>Exam Scheduler</h1>
            {contents}
            <h2>{selectedExam ? 'Edit Exam' : 'Add Exam'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); saveExam(); }}>
                <div>
                    <label>Subject:</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Scheduled Date:</label>
                    <input
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Room ID:</label>
                    <input
                        type="number"
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Professor ID:</label>
                    <input
                        type="number"
                        value={formData.professorId}
                        onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Capacity:</label>
                    <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">{selectedExam ? 'Save Changes' : 'Add Exam'}</button>
                {selectedExam && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>
        </div>
    );
}

export default App;
