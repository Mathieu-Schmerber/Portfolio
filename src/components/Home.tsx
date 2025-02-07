import React from "react";
import WelcomeSection from "./WelcomeSection.tsx";
import AboutSection from "./AboutSection.tsx";
import ProjectsSection from "./ProjectsSection.tsx";
import {SectionsContainer, Section} from 'react-fullpage';
import "./Home.css";

const Home: React.FC = () => {

    let options = {
        sectionClassName:     'section',
        anchors:              ['welcome', 'about', 'projects'],
        scrollBar:            false,
        navigation:           true,
        verticalAlign:        false,
        sectionPaddingTop:    '50px',
        sectionPaddingBottom: '50px',
        arrowNavigation:      true
    };


    return (
        <SectionsContainer {...options}>
            <Section>
                <WelcomeSection />
            </Section>
            <Section>
                <AboutSection />
            </Section>
            <Section>
                <ProjectsSection />
            </Section>
        </SectionsContainer>
    );
};

export default Home;