import React, { useState } from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import ClassroomsManagementComponent from '../Components/ManagementComponents/ClassroomsManagementComponent';
import '../Styles/DashboardPage.css';

const ManageClassroomsPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Users">
                            {/* Availability block */}
                            <div className="block-item">
                                <ClassroomsManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ManageClassroomsPage