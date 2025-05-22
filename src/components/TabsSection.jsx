import React, { useState, useEffect } from 'react';
import { fetchTabsData } from '../utils/tabsApi';
import './TabsSection.css';
import TabsSection from '../components/sections/TabsSection';

const TabsSection = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTabsData = async () => {
      try {
        const data = await fetchTabsData();
        // Map WordPress data to include subtitle (from excerpt or leave blank)
        const mappedTabs = data.map(tab => ({
          ...tab,
          subtitle: tab.excerpt ? tab.excerpt.replace(/<[^>]+>/g, '') : '' // Remove HTML tags from excerpt
        }));
        setTabs(mappedTabs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading tabs data:', error);
        setLoading(false);
      }
    };
    loadTabsData();
  }, []);

  if (loading) {
    return (
      <section className="tabs-section">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </section>
    );
  }

  if (!tabs || tabs.length === 0) {
    return (
      <section className="tabs-section">
        <div className="container">
          <div className="tabs-container">
            <div className="no-data-message">
              <h3>No Content Available</h3>
              <p>Please add content in WordPress to display tabs here.</p>
              <p>Steps to add content:</p>
              <ol>
                <li>Go to WordPress admin panel</li>
                <li>Create new posts in category ID 4</li>
                <li>Add title and content for each tab</li>
                <li>Publish the posts</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    // <section className="tabs-section">
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-12">
    //         <div className="tabs-header">
    //           <div className="row g-0">
    //             {tabs.map((tab, index) => (
    //               <div className="col-md-4 px-0" key={tab.id}>
    //                 <button
    //                   className={`tab-button w-100 ${activeTab === index ? 'active' : ''}`}
    //                   onClick={() => setActiveTab(index)}
    //                 >
    //                   <b>{tab.title}</b>
    //                   {tab.subtitle && <span>{tab.subtitle}</span>}
    //                 </button>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //         <div className="tab-content">
    //           <div className="row">
    //             <div className="col-12">
    //               <h2>{tabs[activeTab].title}</h2>
    //               <div dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <TabsSection
        title="Choose a situation that applies to you or that interests you"
        tabs={tabs}
      />
  );
};

export default TabsSection; 