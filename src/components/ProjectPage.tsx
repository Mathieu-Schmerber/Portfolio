import React, { useEffect, useRef, useState } from "react";
import { getFile, Project } from "./Project.tsx";
import PlayButton from "./PlayButton.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faExpand} from "@fortawesome/free-solid-svg-icons";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import HeaderMenu from "./HeaderMenu.tsx";
import SlideShow from "./SlideShow.tsx";
import './ProjectPage.css';
import {Space} from "antd";

const isYouTubeLink = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/(?:www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/|shorts\/|playlist\?)|youtu\.be\/)[^\s]+)/;
    return youtubeRegex.test(url);
};

const ProjectPage: React.FC<{ project: Project, path: string }> = ({ project, path }) => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [mainAsset, setMainAsset] = useState<string | null>(null);
    const [build, setBuild] = useState<string | null>(null);
    const [isBuildSelected, setIsBuildSelected] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isPlayButtonPressed, setIsPlayButtonPressed] = useState(false);
    const [visibleImages, setVisibleImages] = useState<string[]>([]);

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const elementCount = project.images.length + (project.buildFile ? 1 : 0);

    useEffect(() => {
        fetch(getFile(project, `${project.slug}.md`))
            .then((response) => response.text())
            .then((data) => setMarkdownContent(data))
            .catch((err) => console.error('Error loading markdown file:', err));

        if (project.images && project.images.length > 0) {
            const images = project.images.map((image: string) => getFile(project, image));
            setImages(images);
            setVisibleImages([...images, ...images, ...images]); // Triple for seamless scrolling
            setMainAsset(images[0]);
        }

        if (project.buildFile) {
            const buildPath = getFile(project, project.buildFile);
            setBuild(buildPath);
        }
    }, [path, project.slug, project.images, project.buildFile]);


    const selectAsset = (index: number) => {
        let adjustedIndex = index % elementCount;
        if (adjustedIndex <= 0) {
            adjustedIndex += elementCount;
        }

        if (adjustedIndex === elementCount) {
            setIsBuildSelected(true);
        } else {
            setIsPlayButtonPressed(false)
            setIsBuildSelected(false);
            setMainAsset(images[adjustedIndex - 1]);
        }
    }

    const handlePlayButtonClick = () => {
        setIsPlayButtonPressed(true);
        setTimeout(() => {
            iframeRef.current?.focus(); // Ensure the iframe gets focus
        }, 0);
    };

    const handleFullscreen = () => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            }
        }
    }

    const renderAsset = (asset: string) => {
        const index = images.indexOf(asset) + (build ? 1 : 0)

        if (isYouTubeLink(asset)) {
            return (
                <div style={{ position: 'relative' }} onClick={() => selectAsset(index)}>
                    <div style={{position: 'absolute', height: '100%', width: '100%'}}></div>
                    <iframe
                    className={"asset-image"}
                    src={`https://www.youtube.com/embed/${asset.split('v=')[1]}`}
                    title="YouTube Video"
                    allow={""}/>
                </div>)
        }
        return <img src={asset} alt="Asset" className="asset-image" onClick={() => selectAsset(index)}/>;
    };

    return (
        <div>
            <HeaderMenu/>
            <div className="project-page">
                <div className="markdown-container">
                    <MarkdownRenderer>{markdownContent}</MarkdownRenderer>
                </div>

                {/* SELECTED ASSET DISPLAY */}
                <div className="assets-container">
                    <div className="main-asset">
                        {isBuildSelected && build ? (
                            isPlayButtonPressed ? (
                                <div className={"iframe-container"}>
                                    <iframe
                                        ref={iframeRef}
                                        tabIndex={0}
                                        src={build}
                                        title="Unity Build"
                                    />
                                    <button onClick={handleFullscreen} className="fullscreen-button">
                                        <FontAwesomeIcon icon={faExpand} size="2x" />
                                    </button>
                                </div>
                            ) : (
                                <div className="main-asset-build" onClick={handlePlayButtonClick}>
                                    <PlayButton />
                                    <img src={visibleImages[0]} alt="Asset" className="main-asset-build-background" />;
                                </div>
                            )
                        ) : (
                            mainAsset && (
                                isYouTubeLink(mainAsset) ? (
                                    <div className={"iframe-container"}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${mainAsset.split('v=')[1]}?autoplay=1`}
                                            title="YouTube Video"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <img src={mainAsset} alt="Main Asset" className="asset-image main"/>
                                )
                            )
                        )}
                    </div>

                    <SlideShow
                        pagingPosition={'top'}
                        itemHeight={150}
                        itemAspectRatio={16 / 9}
                        gap={10}
                        onSelected={(index: number) => selectAsset(index)}
                    >
                        {Array.from({length: elementCount}).map((_, index) => (
                                index === 0 && build ? (
                                    <div key={index} className="asset-build">
                                        <PlayButton/>
                                        {renderAsset(images[0])}
                                    </div>
                                ) : (
                                    <div key={index} className="asset-item">
                                        {renderAsset(images[build ? index - 1 : index])}
                                    </div>
                                )
                        ))}
                    </SlideShow>
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;