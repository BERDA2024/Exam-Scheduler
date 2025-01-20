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
                        <StylizedBlock title="Info" canToggle={false}>
                            {/* Availability block */}
                            <div className="block-item">
                                <span>Empty</span>
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
                                <span>Empty</span>
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
