import React, { useState, useEffect } from 'react';
import '../Styles/DashboardPage.css';
import Layout from "../Layout/Layout";
import AvailabilityForm from '../Forms/AvailabilityForm';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Availability">
                            {/* Recents block */}
                            <div className="block recents">
                                <h3>Recents</h3>
                                <div className="block-item">
                                    <AvailabilityForm />
                                </div>
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Availability">
                            {/* Agenda block */}
                            <div className="block agenda">
                                <h3>Agenda</h3>
                                <div className="block-item">
                                    <span>16:00 | Examen Ingineria Programelor | Turcu Cristina Elena</span>
                                </div>
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Availability">
                            {/* Docs block */}
                            <div className="block docs">
                                <h3>Docs</h3>
                                <div className="block-item">
                                    <span>12/10/24 15:00 | Organizare examen Ingineria Programelor</span>
                                </div>
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Availability">
                            {/* Inbox block */}
                            <div className="block inbox">
                                <h3>Inbox</h3>
                                <div className="block-item">
                                    <span>You have an exam today at 16:00 in C202</span>
                                </div>
                                <div className="block-item">
                                    <span>You have an exam tomorrow, 22/10/24, at 16:00</span>
                                </div>
                                <div className="block-item">
                                    <span>New Doc was added by Turcu Cristina Elena at 15:00 12/10/24</span>
                                </div>
                                <div className="block-item">
                                    <span>New Exam was added at 14:46 12/10/24</span>
                                </div>
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
