import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { projectFiles } from "./ProjectFiles.tsx";
import SlideShow from "./SlideShow.tsx";
import ProjectCard from "./ProjectCard.tsx";
import './ProjectsSection.css';

const ProjectsSection: React.FC = () => {
    return (
        <div className="page-container">
            <Title className={'ubuntu'}>My projects</Title>
            <Title className={'ubuntu'} level={3}>Some projects</Title>
            <SlideShow className={"projects-scroll"} gap={10} itemWidth={250} itemHeight={192} >
                {projectFiles.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </SlideShow>

            <Title className={'ubuntu'} level={3}>Some other projects</Title>
            <SlideShow className={"projects-scroll"} gap={10} itemWidth={250} itemHeight={192} >
                {projectFiles.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </SlideShow>
        </div>
    );
};

export default ProjectsSection;