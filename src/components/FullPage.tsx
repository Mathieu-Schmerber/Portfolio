import React, { ReactNode, useEffect, useState, useRef, useCallback } from "react";

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

    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    // Scroll handling for mouse wheel
    const handleScroll = useCallback(
        (event: WheelEvent): void => {
            event.preventDefault();
            const newIndex =
                event.deltaY < 0 ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, totalSections - 1);
            if (onSectionChange) onSectionChange(newIndex); // Notify parent of section change
            setInternalActiveIndex(newIndex);
        },
        [activeIndex, totalSections, onSectionChange]
    );

    // Scroll animation
    useEffect(() => {
        if (containerRef.current) {
            const scrollOffset = sectionsRef.current[activeIndex]?.offsetTop || 0;
            containerRef.current.style.transform = `translateY(-${scrollOffset}px)`; // Dynamic scroll offset
        }
    }, [activeIndex]);

    // Setup scroll event listener for mouse
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleScroll, { passive: false });
        }
        return () => container?.removeEventListener("wheel", handleScroll);
    }, [handleScroll]);

    // Handle touch start
    const handleTouchStart = (event: TouchEvent): void => {
        touchStartY.current = event.touches[0].clientY;
    };

    // Handle touch end
    const handleTouchEnd = (): void => {
        if (touchStartY.current !== null && touchEndY.current !== null) {
            const distance = touchStartY.current - touchEndY.current;
            if (Math.abs(distance) > 50) {
                const newIndex =
                    distance > 0
                        ? Math.min(activeIndex + 1, totalSections - 1)
                        : Math.max(activeIndex - 1, 0);
                if (onSectionChange) onSectionChange(newIndex);
                setInternalActiveIndex(newIndex);
            }
        }
        touchStartY.current = null;
        touchEndY.current = null;
    };

    // Handle touch move
    const handleTouchMove = (event: TouchEvent): void => {
        touchEndY.current = event.touches[0].clientY;
    };

    // Setup touch event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("touchstart", handleTouchStart, { passive: true });
            container.addEventListener("touchmove", handleTouchMove, { passive: true });
            container.addEventListener("touchend", handleTouchEnd, { passive: true });
        }
        return () => {
            container?.removeEventListener("touchstart", handleTouchStart);
            container?.removeEventListener("touchmove", handleTouchMove);
            container?.removeEventListener("touchend", handleTouchEnd);
        };
    }, [activeIndex]);

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
        </div>
    );
}
