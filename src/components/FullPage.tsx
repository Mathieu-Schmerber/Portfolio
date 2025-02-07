import React, { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { Button } from "antd";

interface FullPageProps {
    children: ReactNode[];
    activeSection?: number; // Optional prop to control active section externally
    onSectionChange?: (index: number) => void; // Callback to notify parent of section change
}

export default function FullPage({
                                     children,
                                     activeSection,
                                     onSectionChange,
                                 }: FullPageProps): JSX.Element {
    const [internalActiveIndex, setInternalActiveIndex] = useState<number>(0);
    const totalSections: number = children.length;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([]); // To store references to each section

    const activeIndex = activeSection !== undefined ? activeSection : internalActiveIndex; // Use external control if provided

    // Scroll handling
    const handleScroll = useCallback((event: WheelEvent): void => {
        event.preventDefault();
        const newIndex = event.deltaY < 0 ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, totalSections - 1);
        if (onSectionChange) onSectionChange(newIndex); // Notify parent of section change
        setInternalActiveIndex(newIndex);
    }, [activeIndex, totalSections, onSectionChange]);

    // Scroll animation
    useEffect(() => {
        if (containerRef.current) {
            const totalHeight = sectionsRef.current.reduce((acc, section) => acc + (section?.clientHeight || 0), 0);
            const scrollOffset = sectionsRef.current[activeIndex]?.offsetTop || 0;
            containerRef.current.style.transform = `translateY(-${scrollOffset}px)`; // Dynamic scroll offset
        }
    }, [activeIndex]);

    // Setup scroll event listener
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleScroll, { passive: false });
        }
        return () => container?.removeEventListener("wheel", handleScroll);
    }, [handleScroll]);

    // Handle clicking on a button (to navigate to a section)
    const handleButtonClick = (index: number): void => {
        if (onSectionChange) onSectionChange(index); // Notify parent of section change
        setInternalActiveIndex(index);
    };

    return (
        <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
            <div
                ref={containerRef}
                style={{
                    height: "100%",
                    width: "100%",
                    transition: "transform 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        ref={(el) => (sectionsRef.current[index] = el)} // Save reference to each section
                        style={{ width: "100%" }}
                    >
                        {child}
                    </div>
                ))}
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "8px"
                }}
            >
            </div>
        </div>
    );
}
