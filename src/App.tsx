import { ConfigProvider, Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./components/Home.tsx";
import { projectFiles } from "./components/ProjectFiles.tsx";
import ProjectPage from "./components/ProjectPage.tsx";

const { Content } = Layout;

const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Ubuntu',
                    colorPrimary: "#f2a06e",
                    colorInfo: "#f2a06e",
                    colorBgLayout: '#f5f5f5',
                    colorBgContainer: '#ffffff',
                    colorBorder: "#f2a16eb3",
                    colorBorderSecondary: "#f2a16e40"
                },
            }}
        >
            <Router>
                <Layout className="layout" style={{ minHeight: '100vh' }}>
                    <Content>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {projectFiles.map((project) => (
                                <Route
                                    key={project.slug}
                                    path={`/projects/${project.slug}`}
                                    element={<ProjectPage project={project} path={`/projects/${project.slug}`} />}
                                />
                            ))}
                        </Routes>
                    </Content>
                </Layout>
            </Router>
        </ConfigProvider>
    );
};

export default App;
