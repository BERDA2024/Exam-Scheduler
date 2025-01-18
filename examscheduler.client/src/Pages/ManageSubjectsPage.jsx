import React from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import SubjectsManagementComponent from '../Components/ManagementComponents/SubjectsManagementComponent';
import '../Styles/DashboardPage.css';

const SubjectsManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Subjects">
                            {/* Availability block */}
                            <div className="block-item">
                                <SubjectsManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default SubjectsManagementPage;