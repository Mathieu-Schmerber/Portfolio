import React from "react";
import './ParallaxLayer.css';

interface ParallaxLayerProps {
    zDepth: number;
    scrollPosition: number;
    children: React.ReactNode;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ zDepth, scrollPosition, children }) => {

    const transformValue = `translateY(${-scrollPosition / 2 * (1 / zDepth)}px)`;

    const blurValue = (4 / zDepth) * zDepth;
    const scaleValue = (1 / zDepth) * 4;
    const speedValue = `${zDepth * 0.8}s`;
    const opacityValue = 1 - (zDepth * 0.1) + 0.1;

    const childStyle = {
        transform: `scale(${scaleValue})`
    };

    const childrenWithStyles = React.Children.map(children, (child) =>
        React.isValidElement(child) ?
            React.cloneElement(child, {style: { ...child.props.style, ...childStyle }})
            : child
    );

    return (
        <div
            className={'parallax-layer'}
            style={{
                transform: `${transformValue}`,
                filter: `blur(${blurValue}px)`,
                transition: `transform ${speedValue}, filter ${speedValue}`,
                opacity: `${opacityValue}`,
            }}
        >
            {childrenWithStyles}
        </div>
    );
};

export default ParallaxLayer;