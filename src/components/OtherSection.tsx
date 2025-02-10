import React, { useState } from "react";
import Title from "antd/lib/typography/Title";
import { projectFiles } from "./ProjectFiles.tsx";
import ProjectCard from "./ProjectCard.tsx";
import './OtherSection.css';
import {Pagination} from "antd";

const OtherSection = (): JSX.Element => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 10; // Number of projects per page

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Calculate the current projects to display based on the page
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = [...projectFiles, ...projectFiles, ...projectFiles, ...projectFiles].slice(indexOfFirstProject, indexOfLastProject);

    return (
        <div className="projects-container">
            <Title className="ubuntu" style={{ textAlign: 'center' }}>Some more projects</Title>
            <div className="projects-grid">
                {currentProjects.map((project, index) => (
                    <div key={index} className="project-item">
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
            <div className="pagination-container">
                <Pagination
                    current={currentPage}
                    total={([...projectFiles, ...projectFiles, ...projectFiles, ...projectFiles].length)}
                    pageSize={projectsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default OtherSection;
