import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import './ProjectPage.css';
import { getFile, Project } from "./Project.tsx";
import PlayButton from "./PlayButton.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

const isYouTubeLink = (url: string) => {
    return url.match(/^(https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+)|youtu\.be\/\S+)$/);
};

const ProjectPage: React.FC<{ project: Project, path: string }> = ({ project, path }) => {
    const [markdownContent, setMarkdownContent] = useState('');
    const [mainAsset, setMainAsset] = useState<string | null>(null);
    const [build, setBuild] = useState<string | null>(null);
    const [isBuildSelected, setIsBuildSelected] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [isPlayButtonPressed, setIsPlayButtonPressed] = useState(false);
    const [visibleImages, setVisibleImages] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const size = 200 * (16 / 9);
    const gap = 10;
    const elementCount = project.images.length + (project.buildFile ? 1 : 0);

    useEffect(() => {
        fetch(`${path}/${project.slug}.md`)
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

    useEffect(() => {
        if (scrollContainerRef.current && visibleImages.length > 0) {
            // Center cover first
            centerAsset(elementCount, false);
            if (build) setIsBuildSelected(true);
        }
    }, [visibleImages]);

    const centerAsset = (index: number, isSmooth: boolean) => {
        const container = scrollContainerRef.current;
        const assetWidth = size + gap;
        const containerWidth = container!.clientWidth;
        const scrollPosition = index * assetWidth - (containerWidth / 2) + (assetWidth / 2);

        if (!isSmooth)
            container!.scrollLeft = scrollPosition;
        else
            container!.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            selectAsset(selectedIndex - 1);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            selectAsset(selectedIndex + 1);
        }
    };

    const selectAsset = (index: number) => {
        const clockwiseDelta = (index - selectedIndex + elementCount) % elementCount;
        const counterClockwiseDelta = (selectedIndex - index + elementCount) % elementCount;
        const delta = clockwiseDelta <= counterClockwiseDelta ? clockwiseDelta : -counterClockwiseDelta;

        let adjustedIndex = index % elementCount;
        if (adjustedIndex <= 0) {
            adjustedIndex += elementCount;
        }

        setSelectedIndex(adjustedIndex);
        if (adjustedIndex === elementCount) {
            setIsBuildSelected(true);
            setSelectedIndex(0);
            centerAsset(delta > 0 ? elementCount - 1 : elementCount + 1, false); // Reset position
            centerAsset(elementCount, true); // Scroll smoothly
        } else {
            setIsPlayButtonPressed(false)
            setIsBuildSelected(false);
            setMainAsset(images[adjustedIndex - 1]);
            centerAsset(adjustedIndex + elementCount, true);
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
        <div className="project-page">
            <div className="markdown-container">
                <Markdown>{markdownContent}</Markdown>
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

                {/* PAGINATION */}
                <div className="pagination-container">
                    {Array.from({ length: elementCount }).map((_, index) => (
                        <div
                            key={index}
                            className={`pagination-dot ${index === selectedIndex ? 'active' : ''}`}
                            onClick={() => selectAsset(index)}
                        />
                    ))}
                </div>

                {/* SLIDE SHOW */}
                <div className="assets-scroll-container">
                    <button className="left-arrow" onClick={scrollLeft} />
                    <div className="assets-scroll" ref={scrollContainerRef}>
                        {build && (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <React.Fragment key={i}>
                                        {/* Add the build image */}
                                        <div className="asset-build" onClick={() => selectAsset(0)}>
                                            <PlayButton />
                                            {renderAsset(visibleImages[0])}
                                        </div>
                                        {visibleImages.slice(i * images.length, (i + 1) * images.length).map((image, index) => (
                                            <div key={index + i * images.length} className="asset-item">
                                                {renderAsset(image)}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                        {!build && visibleImages.map((image, index) => (
                            <div key={index} className="asset-item">
                                {renderAsset(image)}
                            </div>
                        ))}
                    </div>
                    <button className="right-arrow" onClick={scrollRight} />
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;