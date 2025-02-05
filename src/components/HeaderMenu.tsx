import {Menu, MenuProps} from "antd";
import {HomeOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {Header} from "antd/lib/layout/layout";
import React, {useState} from "react";

const HeaderMenu: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState<string>('home');

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <Header>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
            >
                <Menu.Item key="home" icon={<HomeOutlined />}>
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="about" icon={<UserOutlined />}>
                    <Link to="/about">About</Link>
                </Menu.Item>
                <Menu.Item key="contact" icon={<MailOutlined />}>
                    <Link to="/contact">Contact</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default HeaderMenu;