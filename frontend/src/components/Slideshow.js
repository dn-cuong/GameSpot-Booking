import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Slideshow.css';

const images = [
  require("../assets/images/image1.png"),
  require("../assets/images/image2.jpeg"),
  require("../assets/images/image3.jpeg"),
  require("../assets/images/image4.jpeg"),
];

const Slideshow = ({ role }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slideshow">
      {images.map((image, index) => (
        <img 
          key={index} 
          src={image} 
          alt={`Slideshow ${index + 1}`} 
          className={`slideshow-image ${index === currentIndex ? 'active' : ''}`} 
        />
      ))}
      <div className="overlay">
        <div className="text-overlay">PLAYING IN THE ESPORT LAB</div>
        {role !== 'admin' ? (
          <Link to="/reserve" className="reserve-button">
            <span>Reserve a seat now</span>
          </Link>
        ) : (
          <Link to="/dashboard" className="reserve-button">
            <span>Go to Dashboard</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Slideshow;
