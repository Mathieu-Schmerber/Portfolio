import {Button} from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";

const Contact: React.FC = () => {
    return (
        <div>
            <Title level={1}>Contact</Title>
            <Button type="primary" size="large">Explore More</Button>
        </div>
    );
}

export default Contact;