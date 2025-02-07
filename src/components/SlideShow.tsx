import React, { useEffect, useRef, useState } from "react";
import './SlideShow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface SlideShowProps {
    children: React.ReactNode[];
    itemHeight: number;
    itemAspectRatio: number;
    gap: number;
    className?: string; // Optional className prop
    selectedIndex?: number; // External selected index
    onSelected?: (index: number) => void; // Callback when selected index changes
    pagingPosition?: 'top' | 'bottom'; // Paging position prop
}

const SlideShow = ({
                       children,
                       gap,
                       itemHeight,
                       itemAspectRatio,
                       className = "", // Default to an empty string if className is not provided
                       selectedIndex: externalSelectedIndex = 0,
                       onSelected,
                       pagingPosition = 'bottom', // Default to 'bottom' if pagingPosition is not provided
                   }: SlideShowProps): JSX.Element => {

    const [selectedIndex, setSelectedIndex] = useState(externalSelectedIndex);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const elementCount = children.length;
    const width = itemHeight * itemAspectRatio + gap;

    const centerAsset = (index: number, isSmooth: boolean) => {
        const container = scrollContainerRef.current;
        const assetWidth = width;
        const containerWidth = container!.clientWidth;
        const scrollPosition = index * assetWidth - (containerWidth / 2) + (assetWidth / 2);

        if (!isSmooth)
            container!.scrollLeft = scrollPosition;
        else
            container!.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
    };

    const selectAsset = (index: number) => {
        const clockwiseDelta = (index - selectedIndex + elementCount) % elementCount;
        const counterClockwiseDelta = (selectedIndex - index + elementCount) % elementCount;
        const delta = clockwiseDelta <= counterClockwiseDelta ? clockwiseDelta : -counterClockwiseDelta;

        let adjustedIndex = index % elementCount;
        if (adjustedIndex <= 0) {
            adjustedIndex += elementCount;
        }

        setSelectedIndex(adjustedIndex);

        if (adjustedIndex === elementCount) {
            setSelectedIndex(0);
            centerAsset(delta > 0 ? elementCount - 1 : elementCount + 1, false); // Reset position
            centerAsset(elementCount, true); // Scroll smoothly
            onSelected?.(elementCount);
        } else {
            centerAsset(adjustedIndex + elementCount, true);
            onSelected?.(adjustedIndex + elementCount);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            selectAsset(selectedIndex - 1);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            selectAsset(selectedIndex + 1);
        }
    };

    // Function to handle resizing and recentering
    const handleResize = () => {
        centerAsset(selectedIndex, true); // Recenter the selected asset after resizing
    };

    // Swipe handling for mobile
    const [startX, setStartX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isSwiping) {
            const moveX = e.touches[0].clientX;
            if (moveX - startX > 50) { // Swipe right
                scrollLeft();
                setIsSwiping(false);
            } else if (startX - moveX > 50) { // Swipe left
                scrollRight();
                setIsSwiping(false);
            }
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
    };

    useEffect(() => {
        centerAsset(elementCount, false);
    }, []);

    useEffect(() => {
        if (externalSelectedIndex !== selectedIndex) {
            setSelectedIndex(externalSelectedIndex);
            centerAsset(externalSelectedIndex + elementCount, true);
        }
    }, [externalSelectedIndex]);

    // Add the resize event listener
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedIndex]);

    const pagination = (
        <div className="pagination-container">
            {Array.from({ length: children.length }).map((_, index) => (
                <div
                    key={index}
                    className={`pagination-dot ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => selectAsset(index)}
                />
            ))}
        </div>
    );

    return (
        <div className={`slideshow-container ${className}`}> {/* Apply the className prop */}
            {pagingPosition === 'top' && pagination}
            <div className="slideshow">
                <button className="left-arrow" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} size={'2x'} />
                </button>
                <div
                    ref={scrollContainerRef}
                    className="scroll"
                    style={{ gap: `${gap}px` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {[...children, ...children, ...children].map((child, index) => (
                        <div
                            className="item"
                            style={{ height: `${itemHeight}px`, aspectRatio: `${itemAspectRatio}` }}
                            key={index}
                            onClick={() => selectAsset(index)}>
                            {child}
                        </div>
                    ))}
                </div>
                <button className="right-arrow" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} size={'2x'} />
                </button>
            </div>
            {pagingPosition === 'bottom' && pagination}
        </div>
    );
};

export default SlideShow;
