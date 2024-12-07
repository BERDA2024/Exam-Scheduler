import React, { useState, useRef, useEffect } from "react";
import "./StylizedBlock.css";

const StylizedBlock = ({ title, children, canToggle = true, initiallyOpen = true }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [isRendered, setIsRendered] = useState(false); // Tracks when the component is rendered
    const contentRef = useRef(null); // Ref to measure the content height
    const wrapperRef = useRef(null); // Ref to the content wrapper

    useEffect(() => {
        // Trigger a re-render once the DOM is fully loaded to apply correct animation
        setTimeout(() => setIsRendered(true), 0);
    }, []);

    // Set up a ResizeObserver to adjust the block's height when content changes
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            // Only adjust height if wrapperRef and contentRef are available
            if (wrapperRef.current && contentRef.current && isOpen) {
                const contentHeight = contentRef.current.scrollHeight;
                wrapperRef.current.style.maxHeight = `${contentHeight}px`;
            }
        });

        // Start observing contentRef
        if (contentRef.current) {
            observer.observe(contentRef.current);
        }

        // Clean up the observer when the component is unmounted or contentRef changes
        return () => {
            if (contentRef.current) {
                observer.unobserve(contentRef.current);
            }
        };
    }, [isOpen]); // Only trigger when the block is open

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
                ref={wrapperRef} // Reference for the wrapper to adjust height
                style={{
                    maxHeight: isRendered && isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease-out",
                }}
            >
                <div className="stylized-block-content" ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StylizedBlock;