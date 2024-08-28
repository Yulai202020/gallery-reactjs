import React, { useState, useEffect, TouchEvent } from "react";
import { useParams } from "react-router-dom";

import config from "./config.json";
import "./fullscreen.css";
import useTitle from "./useTitle";
import { basepath } from "../config.json"

interface ImageData {
  id: number;
  alt: string;
}

function Home() {
  const { folder: folderName } = useParams<{ folder?: string }>();
  const [images, setImages] = useState<ImageData[]>([]);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const filteredImages = folderName ? config.filter(item => item.category === folderName) : config as ImageData[];
    setImages(filteredImages);
    setIndex(null);
  }, [folderName]);

  useTitle("Home");

  const handleClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
    event.stopPropagation();
    setIndex(index);
    setIsFullscreen(true);
  };

  const handleClose = () => {
    setIsFullscreen(false);
    setIndex(null);
  };

  const handleNext = () => {
    if (images.length > 0 && index !== null) {
      setIndex((prevIndex) => (prevIndex! + 1) % images.length);
    }
  };

  const handlePrevious = () => {
    if (images.length > 0 && index !== null) {
      setIndex((prevIndex) => (prevIndex! - 1 + images.length) % images.length);
    }
  };

  const handleFirst = () => {
    if (images.length > 0) setIndex(0);
  };

  const handleLatest = () => {
    if (images.length > 0) setIndex(images.length - 1);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startX === null || startY === null) return;

    const touch = e.touches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    if (Math.abs(diffX) < Math.abs(diffY)) {
      if (diffY > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    setStartX(null);
    setStartY(null);
  };

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
  }, [images, index, isFullscreen]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  return (
    <div className="gallery">
      {images.map((item, i) => (
        <div className="gallery-item" key={item.id}>
          <img
            src={`${basepath}/photos/${item.id}/original.avif`}
            alt={item.alt}
            id={i.toString()}
            onClick={(event) => handleClick(event, i)}
          />
          <figcaption className="figure-caption">{item.alt}</figcaption>
        </div>
      ))}

      {isFullscreen && index !== null && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className="fullscreen-overlay">
          <span className="close-button" onClick={handleClose}>&times;</span>
          <img src={`${basepath}/photos/${images[index].id}/original.avif`} alt={images[index].alt} className="fullscreen-image" />
          <div className="fullscreen-content">
            <p>{images[index].alt}</p>
            {/* <a href={`/api/image/${images[index].id}/download`}>Download Image</a> */}
            <a href={`${basepath}/photos/${images[index].id}/original.avif`} target="_blank">Open Image</a>
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
