import React from 'react';
import GroupSubjectssManagementComponent from '../Components/ManagementComponents/GroupSubjectsManagementComponent';
import GroupsManagementComponent from '../Components/ManagementComponents/GroupsManagementComponent';
import StudentsManagementComponent from '../Components/ManagementComponents/StudentsManagementComponent';
import SubgroupsManagementComponent from '../Components/ManagementComponents/SubgroupsManagementComponent';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import '../Styles/DashboardPage.css';

const GroupsManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Groups" initiallyOpen={false}>
                            <div className="block-item">
                                <GroupsManagementComponent />
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Manage Subgroups" initiallyOpen={false}>
                            <div className="block-item">
                                <SubgroupsManagementComponent />
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Manage Group Subjects" initiallyOpen={false}>
                            <div className="block-item">
                                <GroupSubjectssManagementComponent />
                            </div>
                        </StylizedBlock>

                        <StylizedBlock title="Manage Students Group" initiallyOpen={false}>
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