import React from 'react';
import './TabsSection.css';
import { Link } from 'react-router-dom';

const TabsSection = ({ tabs = [], title }) => {
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
                    <Link
                      to={tab.link || '#'}
                      className={`tab-button w-100 ${index === 0 ? 'active' : ''} ${index === 2 ? 'last' : ''}`}
                    >
                      <b>{tab.title}</b>
                      <span>{tab.subtitle}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="tab-content">
              <div className="row">
                <div className="col-12">
                  <div>{tabs[0].content}</div>
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
