import React from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import FacultiesManagementComponent from '../Components/ManagementComponents/FacultiesManagementComponent';
import '../Styles/DashboardPage.css';

const FacultiesManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Faculties">
                            {/* Availability block */}
                            <div className="block-item">
                                <FacultiesManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default FacultiesManagementPage;