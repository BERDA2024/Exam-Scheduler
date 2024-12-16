import React, { useState } from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import ScheduleRequestForm from '../Components/ScheduleRequest/ScheduleRequestForm';
import PendingExamsListForm from '../Components/PendingExamsList/PendingExamsListForm';
import AcceptedExamsListForm from '../Components/AcceptedExamsList/AcceptedExamsListForm';
import DeclinedExamsListForm from '../Components/DeclinedExamsList/DeclinedExamsListForm';
import '../Styles/DashboardPage.css';
import '../Styles/ScheduleExamPage.css';


const ScheduleExamPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Schedule Request">
                            {/* Availability block */}
                            <div className="block-item">
                                <ScheduleRequestForm />
                            </div>
                        </StylizedBlock>
                        <StylizedBlock title="Accepted List">
                            {/* Availability block */}
                            <div className="block-item">
                                <AcceptedExamsListForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>

                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Pending List">
                            {/* Availability block */}
                            <div className="block-item">
                                <PendingExamsListForm />
                            </div>
                        </StylizedBlock>
                        
                        <StylizedBlock title="Decline List">
                            {/* Availability block */}
                            <div className="block-item">
                                <DeclinedExamsListForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ScheduleExamPage;

