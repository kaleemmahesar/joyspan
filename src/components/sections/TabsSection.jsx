import React, { useState } from 'react';
import './TabsSection.css';

const TabsSection = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  console.log(tabs)
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