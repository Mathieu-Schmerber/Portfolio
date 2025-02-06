import {ConfigProvider, Layout} from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HeaderMenu from "./components/HeaderMenu.tsx";
import Home from "./components/Home.tsx";
import About from "./components/About.tsx";
import Contact from "./components/Contact.tsx";
import React from "react";
import {projectFiles} from "./components/ProjectFiles.tsx";
import ProjectPage from "./components/ProjectPage.tsx";
const { Content } = Layout;

const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Ubuntu',
                },
            }}
        >
            <Router basename={import.meta.env.BASE_URL}>
                <Layout className="layout" style={{ minHeight: '100vh' }}>
                    <HeaderMenu />
                    <Content>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            {projectFiles.map((project) => (
                                <Route
                                    key={project.slug}
                                    path={`/projects/${project.slug}`}
                                    element={<ProjectPage project={project} path={`/projects/${project.slug}`} />}
                                />
                            ))}
                        </Routes>
                    </Content>
                    {/*<Footer style={{textAlign: 'center'}}>
                        Mathieu Schmerber ©2025
                    </Footer>*/}
                </Layout>
            </Router>
        </ConfigProvider>
    );
};

export default App;
