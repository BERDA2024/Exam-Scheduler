import React, { useState } from "react";
import "./StylizedBlock.css";

const StylizedBlock = ({ title, children, canToggle = true, initiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    const toggleContent = () => {
        if (canToggle) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="stylized-block">
            <div className="stylized-block-header">
                {title && <h3 className="stylized-block-title">{title}</h3>}
                {canToggle && (
                    <button
                        className="toggle-button"
                        onClick={toggleContent}
                        aria-label={isOpen ? "Minimize content" : "Expand content"}
                    >
                        {isOpen ? "−" : "+"}
                    </button>
                )}
            </div>
            {isOpen && <div className="stylized-block-content">{children}</div>}
        </div>
    );
};

export default StylizedBlock;