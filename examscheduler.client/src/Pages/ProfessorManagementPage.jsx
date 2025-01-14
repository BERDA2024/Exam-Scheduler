import React from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import EditSubjectsForm from '../Components/EditSubjects/EditSubjectsForm';
import AddAvailabilityForm from '../Components/AddAvailability/AddAvailabilityForm';
import ManageScheduleRequestsForm from '../Components/ManageScheduleRequests/ManageScheduleRequestsForm';
import '../Styles/DashboardPage.css';
import '../Styles/ProfessorManagementPage.css';

const ProfessorManagementPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Edit Subjects">
                            {/* Block for editing subjects */}
                            <div className="block-item">
                                <EditSubjectsForm />
                            </div>
                        </StylizedBlock>
                        <StylizedBlock title="Add Availability">
                            {/* Block for adding availability */}
                            <div className="block-item">
                                <AddAvailabilityForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>

                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Manage Schedule Requests">
                            {/* Block for managing schedule requests */}
                            <div className="block-item">
                                <ManageScheduleRequestsForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ProfessorManagementPage;
