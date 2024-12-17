import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import Layout from './Layout/Layout';
import NotificationSettingsPage from './Pages/NotificationSettingsPage';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Layout />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/notification-settings" element={<NotificationSettingsPage />} />
            </Routes>
        </Router>
    );
};

export default App;