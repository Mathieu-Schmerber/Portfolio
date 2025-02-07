import React, {useEffect, useRef, useState} from "react";
import './SlideShow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface SlideShowProps {
    children: React.ReactNode[];
    itemHeight: number;
    itemAspectRatio: number;
    gap: number;
    className?: string; // Optional className prop
}

const SlideShow = ({
                       children,
                       gap,
                       itemHeight,
                       itemAspectRatio,
                       className = "" // Default to an empty string if className is not provided
                   }: SlideShowProps): JSX.Element => {

    const [selectedIndex, setSelectedIndex] = useState(0);
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
        } else {
            centerAsset(adjustedIndex + elementCount, true);
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

    useEffect(() => {
        centerAsset(elementCount, false);
    }, []);

    return (
        <div className={`slideshow-container ${className}`}> {/* Apply the className prop */}
            <div className="slideshow">
                <button className="left-arrow" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} size={'2x'} />
                </button>
                <div ref={scrollContainerRef} className="scroll" style={{ gap: `${gap}px` }}>
                    {[...children, ...children, ...children].map((child, index) => (
                        <div
                            className="item"
                            style={{ height: `${itemHeight}px`, aspectRatio: `${itemAspectRatio}` }}
                            key={index}
                        >
                            {child}
                        </div>
                    ))}
                </div>
                <button className="right-arrow" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} size={'2x'} />
                </button>
            </div>

            {/* PAGINATION */}
            <div className="pagination-container">
                {Array.from({ length: children.length }).map((_, index) => (
                    <div
                        key={index}
                        className={`pagination-dot ${index === selectedIndex ? 'active' : ''}`}
                        onClick={() => selectAsset(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SlideShow;
