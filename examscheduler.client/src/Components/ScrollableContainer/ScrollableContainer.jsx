import React from 'react';
import "./ScrollableContainer.css";

const ScrollableContainer = ({ children }) => {
    return <div className="scrollable-container">{children}</div>;
};

export default ScrollableContainer;