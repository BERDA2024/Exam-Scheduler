import React, { useState } from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'

import '../Styles/DashboardPage.css';
import AvailabilityManagementComponent from '../Components/ManagementComponents/AvailabilityManagementComponent';

const AvailabilityManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Departments">
                            {/* Availability block */}
                            <div className="block-item">
                                <AvailabilityManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityManagementPage;