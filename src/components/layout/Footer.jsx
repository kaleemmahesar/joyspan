import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RiYoutubeFill,
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiInstagramFill,
  RiLinkedinBoxFill
} from 'react-icons/ri';
import Loader from '../Loader';
import { useGetMenuItemsFooterQuery } from '../../apiSlice';

const Footer = () => {
  // Use Redux Toolkit Query hooks for caching
  const { 
    data: menuItems, 
    isLoading, 
    isError
  } = useGetMenuItemsFooterQuery();

  // Function to clean URL for React Router
  const cleanUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (error) {
      return url;
    }
  };

  return (
    <footer className="py-5 mt-auto">
      <div className="container">
        <div className="row align-items-center mb-4">
          <div className="col-md-3 text-center text-md-start footer-logo">
            <Link to="/">
              <img src="/thrivemedplus-logo.png" alt="Thrivemedplus" className="h-40" />
            </Link>
          </div>
          <div className="col-md-6">
            <nav className="d-flex justify-content-center">
              {isLoading ? (
                  <Loader size="small" color="primary" />
                ) : (
                  <ul className="nav">
                    {menuItems && menuItems.map((item) => (
                      <li key={item.id} className="nav-item">
                        <Link 
                          to={cleanUrl(item.object_slug)} 
                          className="nav-link text-dark"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        >
                          
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </nav>
          </div>
          <div className="col-md-3">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
            
              <a href="https://www.youtube.com/@GlobalPositiveHealth" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiYoutubeFill color='#047051' />
              </a>
              <a href="https://www.facebook.com/GlobalPositiveHealth" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiFacebookCircleFill color='#047051' />
              </a>
              <a href="https://www.instagram.com/globalpositivehealth" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiInstagramFill color='#047051' />
              </a>
              <a href="https://www.linkedin.com/groups/13982028/" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiLinkedinBoxFill color='#047051' />
              </a>
            </div>
          </div>
        </div>
        <div class="text-center border-top pt-3"><p class="mb-0">@2026 Thrivemedplus. All rights reserved.</p></div>
      </div>
    </footer>
  );
};

export default Footer;
