import React from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import GroupsManagementComponent from '../Components/ManagementComponents/GroupsManagementComponent';
import '../Styles/DashboardPage.css';

const GroupsManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Groups">
                            {/* Availability block */}
                            <div className="block-item">
                                <GroupsManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default GroupsManagementPage;