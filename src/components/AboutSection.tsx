import {Avatar, Button} from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import mathieu from '../assets/mathieu.jpg'
import "./AboutSection.css"
import Paragraph from "antd/es/skeleton/Paragraph";

const AboutSection: React.FC = () => {
    return (
        <div>
            <div className="container">
                <div className="avatar-container">
                    <Avatar className={"avatar"} src={mathieu}/>
                </div>
                <div className="info">
                    <Title className={"ubuntu"}>Mathieu Schmerber</Title>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut nisi viverra, venenatis orci
                        eget, sollicitudin sapien. Nulla sodales mollis elementum. Cras dictum nibh turpis, volutpat
                        ultrices nisi faucibus vel. Donec sed ex mi. Orci varius natoque penatibus et magnis dis
                        parturient montes, nascetur ridiculus mus. Nunc a blandit metus. Proin a ex id velit blandit
                        accumsan sit amet eu mauris. Cras et elit non mi fringilla vehicula.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut nisi viverra, venenatis orci
                        eget, sollicitudin sapien. Nulla sodales mollis elementum. Cras dictum nibh turpis, volutpat
                        ultrices nisi faucibus vel. Donec sed ex mi. Orci varius natoque penatibus et magnis dis
                        parturient montes, nascetur ridiculus mus. Nunc a blandit metus. Proin a ex id velit blandit
                        accumsan sit amet eu mauris. Cras et elit non mi fringilla vehicula.</p>
                </div>
            </div>
        </div>
    );
}

export default AboutSection;