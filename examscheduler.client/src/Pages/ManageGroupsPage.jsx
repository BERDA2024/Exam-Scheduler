import React from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import GroupsManagementComponent from '../Components/ManagementComponents/GroupsManagementComponent';
import SubgroupsManagementComponent from '../Components/ManagementComponents/SubgroupsManagementComponent';
import StudentsManagementComponent from '../Components/ManagementComponents/StudentsManagementComponent';
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
                        <StylizedBlock title="Manage Subgroups">
                            {/* Availability block */}
                            <div className="block-item">
                                <SubgroupsManagementComponent />
                            </div>
                        </StylizedBlock>
                        <StylizedBlock title="Manage Students Group">
                            {/* Availability block */}
                            <div className="block-item">
                                <StudentsManagementComponent />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default GroupsManagementPage;