import BackendData from "./config.json";
import { useState } from "react";
import "./fullscreen.css";

function Home() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [Index, setIndex] = useState(-1);


    const handleClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
      event.stopPropagation();
      setIndex(Number(index));
      setIsFullscreen(true);
    };

    const handleClose = () => {
      setIsFullscreen(false);
      setIndex(-1);
    };
    return (
        <div className="gallery">
          {BackendData.map((item, index) => (
            <div className="gallery-item">
                <img src={item.href} alt={item.alt} id={index.toString()} onClick={(event) => handleClick(event, index)} />
                <figcaption className="figure-caption">{item.alt}</figcaption>
            </div>
          ))}

          {isFullscreen && Index >= 0 && (
            <div className="fullscreen-overlay" onClick={handleClose}>
              <span className="close-button">&times;</span>
              <img
                src={BackendData[Index].href}
                alt={BackendData[Index].alt}
                className="fullscreen-image"
              />

              <div className="fullscreen-content">
                <p>{BackendData[Index].alt}</p>
                <a href="#" download>Download Image</a>
              </div>
            </div>
          )}
        </div>
    );
}

export default Home;