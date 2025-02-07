import React, { useState, useEffect } from "react";
import WelcomeSection from "./WelcomeSection.tsx";
import AboutSection from "./AboutSection.tsx";
import ProjectsSection from "./ProjectsSection.tsx";
import FullPage from "./FullPage.tsx";
import "./Home.css";

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

    return (
        <FullPage activeSection={activeSection} onSectionChange={handleSectionChange}>
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
