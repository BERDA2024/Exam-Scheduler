import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import Layout from './Layout/Layout';
import NotificationsPage from './Pages/NotificationsPage'; // Import corectat pentru NotificationsPage

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Layout />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/notifications" element={<NotificationsPage />} /> {/* Pagina notificărilor */}
            </Routes>
        </Router>
    );
};

export default App;
