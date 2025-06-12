import React, { useState, useEffect } from 'react';
import TabsSection from '../components/sections/TabsSection';
import HeroSection from '../components/sections/HeroSection';
import { fetchTabsData } from '../utils/tabsApi';
import axios from 'axios';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [herosection, setHeroSection] = useState('');

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const cleanWordPressContent = (content) => {
    // First decode HTML entities
    let cleanedContent = decodeHtmlEntities(content);
    // Remove extra spaces
    cleanedContent = cleanedContent.replace(/\s+/g, ' ');
    // Add proper paragraph spacing
    cleanedContent = cleanedContent.replace(/\./g, '. ');
    return cleanedContent;
  };

  useEffect(() => {
    const loadTabsData = async () => {
      try {
        const data = await fetchTabsData();
        // Map WordPress data to match the required structure
        const mappedTabs = data.map(tab => ({
          title: tab.title,
          subtitle: 'Activities for well-being of health professionals',
          link: '/me',
          content: (
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div 
                  className="tab-text-content" 
                  dangerouslySetInnerHTML={{ 
                    __html: cleanWordPressContent(tab.content) 
                  }} 
                />
              </div>
              <div className="col-lg-4">
                <div className="tab-image-wrapper">
                  <img 
                    src={tab.featured_image || '/s2.png'} 
                    className="img-fluid" 
                    alt={tab.title} 
                  />
                </div>
              </div>
            </div>
          )
        }));
        setTabs(mappedTabs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading tabs data:', error);
        setLoading(false);
      }
    };

    loadTabsData();

    const fetchThemeOptions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/wp-json/custom/v1/options`);
        setHeroSection(res.data.home_hero_section);
        console.log(herosection)
      } catch (err) {
        console.error('Error fetching site logo:', err);
      }
    };

  fetchThemeOptions();
  }, []);

  const handlePlayClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <main>
      <HeroSection herosection={herosection} />
      {loading ? (
        <div className="container text-center py-5">
          <div className="loading">Loading...</div>
        </div>
      ) : (
        <TabsSection
          title="Choose a situation that applies to you or that interests you"
          tabs={tabs}
        />
      )}

      <section className="bg-light py-5 video-banner-section">
        <div className="container">
          <h4 className="text-center mb-3">
            Welcome to proven methods for <span className="text-primary">well-being and satisfaction</span>
          </h4>
          <h1 className="text-center mb-4">
            Tracing the footsteps of our history: <span className="text-primary">A deeper look</span>
          </h1>
          <div className="position-relative text-center">
            <img src="/video-img.jpg.png" alt="video image" className="img-fluid" />
            <img
              src="/play.png"
              className="position-absolute top-50 start-50 translate-middle"
              style={{ cursor: 'pointer' }}
              alt="Play video"
              onClick={handlePlayClick}
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={handleClose}>
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Video</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
