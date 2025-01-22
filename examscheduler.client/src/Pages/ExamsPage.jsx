import React from "react";
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import '../Styles/DashboardPage.css';

import ExamsTable from "../Components/ExamTable";

const ExamsPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Exam List">
                            {/* Availability block */}
                            <div className="block-item">
                                <ExamsTable />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ExamsPage;
