import React from "react";
import { Link } from "react-router-dom";
import { getFile, Project } from "./Project.tsx";
import './ProjectCard.css';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Link to={`/projects/${project.slug}`} className="card-link">
            <div className="card">
                <div className="card-cover">
                    <img alt={project.title} src={getFile(project, project.cover)} />
                </div>
                <div className="card-content">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="card-description">{project.description}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
