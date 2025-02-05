import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import "./PlayButton.css";

interface PlayButtonProps {
    onClick?: () => void;
    label?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, label = "Run Game" }) => {
    return (
        <div className="play-button" onClick={onClick}>
      <span>
        <FontAwesomeIcon icon={faPlayCircle} size="2x" />
          {label}
      </span>
        </div>
    );
};

export default PlayButton;