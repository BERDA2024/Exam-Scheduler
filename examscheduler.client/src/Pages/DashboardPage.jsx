import React, { useState, useEffect } from 'react';
import AvailabilityForm from '../Forms/AvailabilityForm';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import '../Styles/DashboardPage.css';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Availability">
                            {/* Availability block */}
                            <div className="block-item">
                                <AvailabilityForm />
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Agenda">
                            {/* Agenda block */}
                            <div className="block-item">
                                <span>16:00 | Examen Ingineria Programelor | Turcu Cristina Elena</span>
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Docs">
                            {/* Docs block */}
                            <div className="block-item">
                                <span>12/10/24 15:00 | Organizare examen Ingineria Programelor</span>
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Inbox">
                            {/* Inbox block */}
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
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
