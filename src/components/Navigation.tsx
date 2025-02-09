import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Steps } from 'antd';
import './Navigation.css'

interface NavigationProps {
    activeSection: number;
    setActiveSection: (sectionIndex: number) => void;
    items: string[];
    handleStepChange: (current: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({
                                                   activeSection,
                                                   setActiveSection,
                                                   items,
                                                   handleStepChange,
                                               }) => {

    const handleArrowNavigation = (direction: 'up' | 'down') => {
        if (direction === 'up' && activeSection > 0) {
            setActiveSection(activeSection - 1);
        }
        if (direction === 'down' && activeSection < items.length - 1) {
            setActiveSection(activeSection + 1);
        }
    };

    return (
        <div className="navigation-wrapper">
            {/* Up Arrow */}
            <div
                className="arrow arrow-up"
                style={{
                    opacity: activeSection > 0 ? 1 : 0,
                    pointerEvents: activeSection > 0 ? 'auto' : 'none',
                }}
                onClick={() => handleArrowNavigation('up')}
            >
                <FontAwesomeIcon icon={faChevronUp} />
            </div>

            <div
                className="navigation-container"
                style={{
                    opacity: activeSection > 0 ? '1' : '0',
                    pointerEvents: activeSection > 0 ? 'auto' : 'none',
                }}
            >
                <Steps
                    className="navigation"
                    current={activeSection}
                    direction="vertical"
                    items={items.map((item) => ({ title: item }))}
                    onChange={handleStepChange}
                />

            </div>

            {/* Down Arrow */}
            <div
                className="arrow arrow-down"
                style={{
                    opacity: activeSection < items.length - 1 ? 1 : 0,
                    pointerEvents: activeSection < items.length - 1 ? 'auto' : 'none',
                }}
                onClick={() => handleArrowNavigation('down')}
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
    );
};

export default Navigation;