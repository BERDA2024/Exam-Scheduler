import React, { useState, useRef, useEffect } from "react";
import "./StylizedBlock.css";

const StylizedBlock = ({ title, children, canToggle = true, initiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [isRendered, setIsRendered] = useState(false); // Tracks when the component is rendered
    const contentRef = useRef(null); // Ref to measure the content height

    useEffect(() => {
        // Trigger a re-render once the DOM is fully loaded to apply correct animation
        setTimeout(() => setIsRendered(true), 0);
    }, []);

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
            <div
                className={`stylized-block-content-wrapper ${isOpen ? "open" : "closed"}`}
                style={{
                    maxHeight: isRendered && isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
                }}
                ref={contentRef}
            >
                <div className="stylized-block-content">{children}</div>
            </div>
        </div>
    );
};

export default StylizedBlock;