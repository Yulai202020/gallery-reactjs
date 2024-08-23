import BackendData from "./config.json";
import { useState, useEffect } from "react";
import useTitle from "./useTitle";
import "./fullscreen.css";

function Home() {
    useTitle("Home");

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [index, setIndex] = useState(-1);

    const handleClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
      event.stopPropagation();
      setIndex(index);
      setIsFullscreen(true);
    };

    const handleClose = () => {
      setIsFullscreen(false);
      setIndex(-1);
    };

    const handleNext = () => {
      setIndex((prevIndex) => (prevIndex + 1) % BackendData.length);
    };

    const handlePrevious = () => {
      setIndex((prevIndex) => (prevIndex - 1 + BackendData.length) % BackendData.length);
    };

    const handleFirst = () => {
      setIndex(0);
    }

    const handleLatest = () => {
      setIndex(BackendData.length - 1);
    }

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          handlePrevious();
        } else if (event.key === "ArrowRight") {
          handleNext();
        } else if (event.key === "ArrowUp") {
          handleFirst();
        } else if (event.key === "ArrowDown") {
          handleLatest();
        } else if (event.key === "Escape") {
          handleClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    return (
        <div className="gallery">
          {BackendData.map((item, i) => (
            <div className="gallery-item" key={i}>
                <img
                  src={item.href}
                  alt={item.alt}
                  id={i.toString()}
                  onClick={(event) => handleClick(event, i)}
                />
                <figcaption className="figure-caption">{item.alt}</figcaption>
            </div>
          ))}

          {isFullscreen && index >= 0 && index < BackendData.length && (
            <div className="fullscreen-overlay">
              <span className="close-button" onClick={handleClose}>&times;</span>
              <img src={BackendData[index].href} alt={BackendData[index].alt} className="fullscreen-image" />

              <div className="fullscreen-content">
                <p>{BackendData[index].alt}</p>
                <a href={`/api/image/${BackendData[index].id}/download`}>Download Image</a>
              </div>

              <div>
                <button className="button button-left" onClick={handlePrevious}>&lt;</button>
                <button className="button button-right" onClick={handleNext}>&gt;</button>
              </div>
            </div>
          )}
        </div>
    );
}

export default Home;
