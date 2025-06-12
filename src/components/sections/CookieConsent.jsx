import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className='container'>
        <div className="cookie-message">
          <span>
            We use cookies to improve your experience. By using our site, you accept our use of cookies.
          </span>
          <button className="cookie-button" onClick={handleAccept}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
