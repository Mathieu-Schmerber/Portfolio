import Title from "antd/lib/typography/Title";
import React from "react";
import "./WelcomeSection.css"

const WelcomeSection: React.FC = () => {
    return (
        <div>
            <Title className={'header-title'}>Welcome to my Portfolio</Title>
            <Title className={'header-subtitle'}>Mathieu Schmerber</Title>
        </div>
    );
}

export default WelcomeSection;