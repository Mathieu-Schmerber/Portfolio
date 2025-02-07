import React, {useState, useEffect, ReactNode} from "react";
import WelcomeSection from "./WelcomeSection.tsx";
import AboutSection from "./AboutSection.tsx";
import ProjectsSection from "./ProjectsSection.tsx";
import FullPage from "./FullPage.tsx";
import "./Home.css";
import {Steps} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

const items = [
    {
        title: 'Welcome'
    },
    {
        title: 'About me'
    },
    {
        title: 'My Projects'
    },
];

const Home: React.FC = () => {
    const [activeSection, setActiveSection] = useState<number>(0);

    const sectionList: string[] = ["welcome", "about", "projects"];

    // Initialize activeSection based on the current URL hash
    const getInitialSection = () => {
        const hash = window.location.hash.replace("#", "");
        const sectionIndex = sectionList.indexOf(hash);
        return sectionIndex !== -1 ? sectionIndex : 0; // Default to 0 if no valid hash
    };

    // Update active section based on hash change
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            const sectionIndex = sectionList.indexOf(hash);
            if (sectionIndex !== -1) {
                setActiveSection(sectionIndex);
            }
        };

        // Listen for hash changes
        window.addEventListener("hashchange", handleHashChange);

        setActiveSection(getInitialSection());

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    // Function to update the hash on section change
    const handleSectionChange = (newSection: number) => {
        setActiveSection(newSection);
        window.location.hash = `#${sectionList[newSection]}`;
    };

    const renderNavigation = (): JSX.Element => {
        const handleStepChange = (current: number) => {
            setActiveSection(current);
        };

        const handleArrowNavigation = (direction: 'up' | 'down') => {
            if (direction === 'up' && activeSection > 0) {
                setActiveSection(activeSection - 1);
            }
            if (direction === 'down' && activeSection < sectionList.length - 1) {
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
                        pointerEvents: activeSection > 0 ? "auto" : "none"
                    }}
                    onClick={() => handleArrowNavigation('up')}
                >
                    <FontAwesomeIcon icon={faChevronUp} />
                </div>

                <div className="navigation-container" style={{
                    opacity: activeSection > 0 ? "1" : "0",
                    pointerEvents: activeSection > 0 ? "auto" : "none"
                }}>
                    <Steps
                        className={'navigation'}
                        current={activeSection}
                        direction={'vertical'}
                        items={items}
                        onChange={handleStepChange}
                    />
                </div>

                {/* Down Arrow */}
                <div
                    className="arrow arrow-down"
                    style={{
                        opacity: activeSection < sectionList.length - 1 ? 1 : 0,
                        pointerEvents: activeSection < sectionList.length - 1 ? "auto" : "none"
                    }}
                    onClick={() => handleArrowNavigation('down')}
                >
                    <FontAwesomeIcon icon={faChevronDown} />
                </div>
            </div>
        )
    }


    return (
        <FullPage
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            renderNavigation={renderNavigation}
        >
            <div className={"section home"}>
                <WelcomeSection />
            </div>
            <div className={"section about"}>
                <AboutSection />
            </div>
            <div className={"section projects"}>
                <ProjectsSection />
            </div>
        </FullPage>
    );
};

export default Home;
