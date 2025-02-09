import Title from "antd/lib/typography/Title";
import React from "react";
import { projectFiles } from "./ProjectFiles.tsx";
import { Link } from "react-router-dom";
import { getFile } from "./Project.tsx";
import SlideShow from "./SlideShow.tsx";
import './ProjectsSection.css';

const ProjectsSection: React.FC = () => {

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="page-container">
            <Title className={'ubuntu'}>My projects</Title>
            <Title className={'ubuntu'} level={3}>Some projects</Title>
            <SlideShow className={"projects-scroll"} gap={10} itemHeight={200} itemAspectRatio={16/9}>
                {projectFiles.map((project, index) => (
                    <Link to={`/projects/${project.slug}`} key={index} className="card-link">
                        <div className="card">
                            <div className="card-cover">
                                <img alt={project.title} src={getFile(project, project.cover)} />
                            </div>
                            <div className="card-meta">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </SlideShow>

            <Title className={'ubuntu'} level={3}>Some other projects</Title>
            <SlideShow className={"projects-scroll"} gap={10} itemHeight={200} itemAspectRatio={16/9}>
                {projectFiles.map((project, index) => (
                    <Link to={`/projects/${project.slug}`} key={index} className="card-link">
                        <div className="card">
                            <div className="card-cover">
                                <img alt={project.title} src={getFile(project, project.cover)} />
                            </div>
                            <div className="card-meta">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </SlideShow>
        </div>
    );
};

export default ProjectsSection;
