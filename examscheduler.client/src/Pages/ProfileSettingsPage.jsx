import React, { useState } from 'react';
import { getAuthHeader } from '../Utils/AuthUtils';
import ChangePasswordForm from '../Forms/ChangePasswordForm';
import ScrollableContainer from '../Components/ScrollableContainer/ScrollableContainer';
import StylizedBlock from '../Components/StylizedBlock/StylizedBlock';
import '../Styles/DashboardPage.css';

const ProfileSettingsPage = () => {
    return (
        <div className="dashboard-container">
            {/* Body */}
            <div className="dashboard-body">
                {/* Main content */}
                <div className="main-content">
                    <ScrollableContainer>
                        <StylizedBlock title="Change Password">
                            {/* Availability block */}
                            <div className="block-item">
                                <ChangePasswordForm />
                            </div>
                        </StylizedBlock>
                    </ScrollableContainer>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;