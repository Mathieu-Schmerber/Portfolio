import { Menu, MenuProps } from "antd";
import {FolderOutlined, HomeOutlined, UserOutlined} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { Header } from "antd/lib/layout/layout";
import React, { useState, useEffect } from "react";
import icon from "../assets/logo.svg";

const HeaderMenu: React.FC = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>('home');

    // This effect runs whenever the URL's hash changes
    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash) {
            setSelectedKey(hash);
        } else {
            setSelectedKey('home'); // Default to 'home' when no hash
        }
    }, [location.hash]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKey(e.key);
    };

    const handleLogoClick = () => {
        setSelectedKey('home');
    };

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                height: 'auto',
                backgroundColor: 'var(--color-bg-container)',
                position: 'sticky',
                top: 0,
                zIndex: 1000, // Ensure it stays above other content
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={handleLogoClick}>
                <img
                    src={icon}
                    alt="Logo"
                    style={{ width: 40, height: 40, marginRight: 16 }}
                />
            </Link>
            <Menu
                mode="horizontal"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                style={{ flex: 1 }}
            >
                <Menu.Item key="welcome" icon={<HomeOutlined />}>
                    <Link to={`${window.location.origin}${import.meta.env.BASE_URL}#welcome`}>Welcome</Link>
                </Menu.Item>
                <Menu.Item key="about" icon={<UserOutlined />}>
                    <Link to={`${window.location.origin}${import.meta.env.BASE_URL}#about`}>About</Link>
                </Menu.Item>
                <Menu.Item key="projects" icon={<FolderOutlined   />}>
                    <Link to={`${window.location.origin}${import.meta.env.BASE_URL}#projects`}>Projects</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default HeaderMenu;
