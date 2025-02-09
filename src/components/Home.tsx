import React, {useState, useEffect} from "react";
import WelcomeSection from "./WelcomeSection.tsx";
import AboutSection from "./AboutSection.tsx";
import ProjectsSection from "./ProjectsSection.tsx";
import FullPage from "./FullPage.tsx";
import cube1 from "../assets/cube1.png";
import cube2 from "../assets/cube2.png";
import cube3 from "../assets/cube3.png";
import cube4 from "../assets/cube4.png";
import logo from "../assets/logo.svg";
import Navigation from "./Navigation.tsx";
import "./Home.css";
import ParallaxLayer from "./ParallaxLayer.tsx";

const Home: React.FC = () => {
    const [activeSection, setActiveSection] = useState<number>(0);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
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

    // Scroll handler for parallax effect
    const handleScroll = (y: number) => {
        setScrollPosition(y); // Update scroll position
    };

    return (
        <div>
            <div className="overlay">
                <div className="background-container">
                    <img alt={'logo'} src={logo} className={'background-logo'}/>
                </div>
                {/* Apply parallax effect based on scroll position */}
                <ParallaxLayer zDepth={1} scrollPosition={scrollPosition}>
                    <img className={'cube'} src={cube1} alt="cube"
                         style={{
                             height: '5.21vw',
                             left: '5.73vw',
                             bottom: `8.21vw`,
                         }}/>
                    <img className={'cube'} src={cube2} alt="cube"
                         style={{
                             height: '5.21vw',
                             right: '20.83vw',
                             bottom: `-65.21vw`,
                         }}/>
                </ParallaxLayer>

                <ParallaxLayer zDepth={2} scrollPosition={scrollPosition}>
                    <img className={'cube'} src={cube3} alt="cube"
                         style={{
                             height: '5.21vw',
                             right: '15.63vw',
                             top: `16.52vw`,
                         }}/>
                    <img className={'cube'} src={cube3} alt="cube"
                         style={{
                             height: '5.21vw',
                             left: '13.02vw',
                             top: `55.04vw`,
                         }}/>
                </ParallaxLayer>

                <ParallaxLayer zDepth={3} scrollPosition={scrollPosition}>
                    <img className={'cube'} src={cube4} alt="cube"
                         style={{
                             height: '5.21vw',
                             left: '39.58vw',
                             top: `27.48vw`,
                         }}/>
                </ParallaxLayer>

                <ParallaxLayer zDepth={4} scrollPosition={scrollPosition}>
                    <img className={'cube'} src={cube2} alt="cube"
                         style={{
                             height: '5.21vw',
                             left: '23.65vw',
                             top: `-3.30vw`,
                         }}/>
                    <img className={'cube'} src={cube4} alt="cube"
                         style={{
                             height: '5.21vw',
                             right: '10.42vw',
                             top: `40.46vw`,
                         }}/>
                </ParallaxLayer>
            </div>
            <FullPage
                onScrollPositionChange={handleScroll}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                renderNavigation={() =>
                    <Navigation
                        activeSection={activeSection}
                        setActiveSection={handleSectionChange}
                        items={["Welcome", "About me", "My Projects"]}
                        handleStepChange={handleSectionChange}
                    />
                }>
                <div className={"section home"}>
                    <WelcomeSection/>
                </div>
                <div className={"section about"}>
                    <AboutSection/>
                </div>
                <div className={"section projects"}>
                    <ProjectsSection/>
                </div>
            </FullPage>
        </div>
    );
};

export default Home;
