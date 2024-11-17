import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'react-calendar/dist/Calendar.css';

function App() {
    const [exams, setExams] = useState();

    useEffect(() => {
        fetchExams();
    }, []);

    const contents = exams === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Room</th>
                </tr>
            </thead>
            <tbody>
                {exams.map(exam =>
                    <tr key={exam.id}>
                        <td>{exam.ScheduledDate}</td>
                        <td>{exam.Subject}</td>
                        <td>{exam.Room?.Name}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Exams</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function fetchExams() {
        const response = await fetch('exams');
        if (response.ok) {
            const data = await response.json();
            setExams(data);
        }
        else
            setExams([]);
    };
}

    
export default App;