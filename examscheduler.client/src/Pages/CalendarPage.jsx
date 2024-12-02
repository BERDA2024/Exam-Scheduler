import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';
import Calendar from '../Components/Calendar/Calendar';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import '../Styles/DashboardPage.css';

const CalendarPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Calendar">
                            {/* Availability block */}
                            <div className="block-item">
                                <Calendar />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;