import React from "react";
import {projectFiles} from "./ProjectFiles.tsx";
import './Home.css'
import {Link} from "react-router-dom";
import {getFile} from "./Project.tsx";

const Home: React.FC = () => {
    return (
        <div className="card-container">
            {projectFiles.map((project, index) => (
                <Link to={`/projects/${project.slug}`} key={index} className="card-link">
                    <div className="card" key={index}>
                        <div className="card-cover">
                            <img
                                alt={project.title}
                                src={getFile(project, project.cover)}
                            />
                        </div>
                        <div className="card-meta">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Home;