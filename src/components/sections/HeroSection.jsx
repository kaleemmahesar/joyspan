import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-4 mb-4">Toolkit uniquely brings together</h1>
              <p className="lead mb-4">
                Welcome! This toolkit uniquely brings together in one place 90 evidence-based/science-backed 
                positive psychology and mindfulness activities. These activities have been adapted specifically 
                for health professionals and are proven to lower stress, improve mental, emotional and physical 
                well-being.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image text-center">
              <img src="/imagesection1.png" alt="Joyful Living" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <h2>Choose a situation that applies to you or that interests you</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 