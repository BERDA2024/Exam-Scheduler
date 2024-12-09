import React, { useState } from 'react';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock'
import ScheduleRequestForm from '../Components/ScheduleRequest/ScheduleRequestForm';
import ExamListForm from '../Components/ExamList/ExamListForm';
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
                    </ScrollableContainer>
                </div>

                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Exams List">
                            {/* Availability block */}
                            <div className="block-item">
                                <ExamListForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ScheduleExamPage;

