import React, { ReactNode, useEffect, useState, useRef, useCallback } from "react";

interface FullPageProps {
    children: ReactNode[];
    activeSection?: number; // Optional prop to control active section externally
    onSectionChange?: (index: number) => void; // Callback to notify parent of section change
    onScrollPositionChange?: (y: number) => void; // Callback to notify parent of scroll position (Y)
    renderNavigation?: () => JSX.Element; // Optional navigation component renderer
    delay?: number; // Cooldown in ms between two scrolls or swipes
}

export default function FullPage({
                                     children,
                                     activeSection,
                                     onSectionChange,
                                     onScrollPositionChange,
                                     renderNavigation,
                                     delay = 500,
                                 }: FullPageProps): JSX.Element {
    const [internalActiveIndex, setInternalActiveIndex] = useState<number>(0);
    const [isScrollCooldown, setIsScrollCooldown] = useState<boolean>(false);
    const totalSections: number = children.length;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([]); // To store references to each section

    const activeIndex = activeSection !== undefined ? activeSection : internalActiveIndex; // Use external control if provided

    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    // Normalize scroll delta to account for trackpad vs mouse
    const normalizeScrollDelta = (deltaY: number): number => {
        const SCROLL_SENSITIVITY = 50; // Adjust sensitivity as needed
        return deltaY > SCROLL_SENSITIVITY ? 1 : deltaY < -SCROLL_SENSITIVITY ? -1 : 0;
    };

    // Scroll handling for mouse wheel
    const handleScroll = useCallback(
        (event: WheelEvent): void => {
            if (isScrollCooldown) return;
            event.preventDefault();
            const normalizedDelta = normalizeScrollDelta(event.deltaY);
            if (normalizedDelta === 0) return;

            const newIndex =
                normalizedDelta < 0 ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, totalSections - 1);

            if (onSectionChange) onSectionChange(newIndex); // Notify parent of section change
            if (onScrollPositionChange) {
                const scrollPosition = sectionsRef.current[newIndex]?.offsetTop || 0;
                onScrollPositionChange(scrollPosition); // Notify parent of scroll position (Y)
            }

            setInternalActiveIndex(newIndex);
            setIsScrollCooldown(true);
            setTimeout(() => setIsScrollCooldown(false), delay);
        },
        [activeIndex, totalSections, onSectionChange, onScrollPositionChange, isScrollCooldown, delay]
    );

    // Keyboard arrow navigation
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (isScrollCooldown) return;
            let newIndex = activeIndex;
            if (event.key === "ArrowDown") {
                newIndex = Math.min(activeIndex + 1, totalSections - 1);
            } else if (event.key === "ArrowUp") {
                newIndex = Math.max(activeIndex - 1, 0);
            }
            if (newIndex !== activeIndex) {
                if (onSectionChange) onSectionChange(newIndex);
                if (onScrollPositionChange) {
                    const scrollPosition = sectionsRef.current[newIndex]?.offsetTop || 0;
                    onScrollPositionChange(scrollPosition); // Notify parent of scroll position (Y)
                }

                setInternalActiveIndex(newIndex);
                setIsScrollCooldown(true);
                setTimeout(() => setIsScrollCooldown(false), delay);
            }
        },
        [activeIndex, totalSections, onSectionChange, onScrollPositionChange, isScrollCooldown, delay]
    );

    // Scroll animation
    useEffect(() => {
        if (containerRef.current) {
            const scrollOffset = sectionsRef.current[activeIndex]?.offsetTop || 0;
            containerRef.current.style.transform = `translateY(-${scrollOffset}px)`; // Dynamic scroll offset
            if (onScrollPositionChange) {
                onScrollPositionChange(scrollOffset); // Notify parent of scroll position (Y)
            }
        }
    }, [activeIndex, onScrollPositionChange]);

    // Setup scroll event listener for mouse
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleScroll, { passive: false });
        }
        return () => container?.removeEventListener("wheel", handleScroll);
    }, [handleScroll]);

    // Setup keyboard event listener
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Handle touch start
    const handleTouchStart = (event: TouchEvent): void => {
        touchStartY.current = event.touches[0].clientY;
    };

    // Handle touch end
    const handleTouchEnd = (): void => {
        if (touchStartY.current !== null && touchEndY.current !== null && !isScrollCooldown) {
            const distance = touchStartY.current - touchEndY.current;
            if (Math.abs(distance) > 50) {
                const newIndex =
                    distance > 0
                        ? Math.min(activeIndex + 1, totalSections - 1)
                        : Math.max(activeIndex - 1, 0);
                if (onSectionChange) onSectionChange(newIndex);
                if (onScrollPositionChange) {
                    const scrollPosition = sectionsRef.current[newIndex]?.offsetTop || 0;
                    onScrollPositionChange(scrollPosition); // Notify parent of scroll position (Y)
                }

                setInternalActiveIndex(newIndex);
                setIsScrollCooldown(true);
                setTimeout(() => setIsScrollCooldown(false), delay);
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
    }, [activeIndex, isScrollCooldown, delay]);

    return (
        <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
            {/* Render the navigation if provided */}
            {renderNavigation && renderNavigation()}

            <div
                ref={containerRef}
                style={{
                    height: "100%",
                    width: "100%",
                    transition: "transform 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "200px", // Allow space for the fixed navigation
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
