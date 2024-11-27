import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import AvailabilityPage from './Pages/AvailabilityPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/availability" element={<AvailabilityPage />} />
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;