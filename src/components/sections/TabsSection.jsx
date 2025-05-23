import React, { useState } from 'react';
import './TabsSection.css';

const TabsSection = ({ tabs = [], title }) => {
  const [activeTab, setActiveTab] = useState(0);

  // If tabs is undefined or empty, show a fallback message
  if (!tabs || tabs.length === 0) {
    return (
      <section className="tabs-section">
        <div className="container">
          <div className="tabs-container">
            <div className="no-data-message">
              <h3>Content Unavailable</h3>
              <p>Unable to load content at this time. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tabs-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tabs-header">
              <div className="row g-0">
                {tabs.map((tab, index) => (
                  <div className="col-md-4 px-0" key={index}>
                    <button
                      className={`tab-button w-100 ${activeTab === index ? 'active' : ''}`}
                      onClick={() => setActiveTab(index)}
                    >
                      <b>{tab.title}</b>
                      <span>{tab.subtitle}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="tab-content">
              <div className="row">
                <div className="col-12">
                  <h2>{tabs[activeTab].title}</h2>
                  <div>{tabs[activeTab].content}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabsSection; 