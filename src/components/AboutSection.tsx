import {Button} from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import "./AboutSection.css"

const AboutSection: React.FC = () => {
    return (
        <div>
            <Title level={1}>About</Title>
            <Button type="primary" size="large">Explore More</Button>
        </div>
    );
}

export default AboutSection;