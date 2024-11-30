import React from 'react';
import "./StylizedBlock.css";

const StylizedBlock = ({ title, children }) => {
    return (
        <div className="stylized-block">
            {title && <h3 className="stylized-block-title">{title}</h3>}
            <div className="stylized-block-content">
                {children}
            </div>
        </div>
    );
};

export default StylizedBlock;