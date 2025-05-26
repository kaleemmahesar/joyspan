import React from 'react';
import './Loader.css';

const Loader = ({ size = 'large', color = 'primary' }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div 
          className={`loader-spinner ${size} ${color}`}
          role="status" 
          aria-label="loading"
        >
        </div>
        <div className={`loader-pulse ${size}`}></div>
      </div>
    </div>
  );
};

export default Loader; 