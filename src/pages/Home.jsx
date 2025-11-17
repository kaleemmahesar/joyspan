import React, { useState, useEffect } from 'react';
import TabsSection from '../components/sections/TabsSection';
import HeroSection from '../components/sections/HeroSection';
import { useGetTabsDataQuery, useGetSiteOptionsQuery } from '../apiSlice';
import { refreshSiteOptions } from '../utils/cacheUtils';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use Redux Toolkit Query hooks for caching
  const { 
    data: tabsData, 
    isLoading: tabsLoading, 
    isError: tabsError
  } = useGetTabsDataQuery();
  
  const { 
    data: siteOptions, 
    isLoading: optionsLoading, 
    isError: optionsError
  } = useGetSiteOptionsQuery();

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
    if (tabsData) {
      // Map WordPress data to match the required structure
      const mappedTabs = tabsData.map((tab, index) => ({
        
        title: tab.title,
        subtitle: tab.excerpt ? tab.excerpt.replace(/<[^>]+>/g, '') : '',
        link: index === 0 ? '/me' : index === 1 ? '/you' : '/us',
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
    }
  }, [tabsData]);

  const handlePlayClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Function to refresh site options (useful when iframe HTML is updated in WordPress)
  

  return (
    <main>
      <HeroSection herosection={siteOptions?.home_hero_section} />
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
            Welcome to proven methods for <span className="text-primary">wellbeing and satisfaction</span>
          </h4>
          <h1 className="text-center mb-4">
            Tracing the footsteps of our history: <span className="text-primary">A deeper look</span>
          </h1>
          <div className="position-relative text-center">
            <img src="/video-img.jpg.png" alt="video image" className="img-fluid" />
            <img
              src="/play-green.png"
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
              <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                  {siteOptions?.home_video_url ? (
                    <div className='className="ratio ratio-16x9"' dangerouslySetInnerHTML={{ __html: siteOptions.home_video_url }} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <p className="text-muted">No video found</p>
                    </div>
                  )}
                </div>
              
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;