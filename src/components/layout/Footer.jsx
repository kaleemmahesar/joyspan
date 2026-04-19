import React from 'react';
import { Link } from 'react-router-dom';
import { 
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
          <div className="col-md-3 text-center text-md-start">
            <Link to="/">
              <img src="/microdosplus-logo.svg" alt="Microdoseplus" className="h-40" />
            </Link>
          </div>
<<<<<<< HEAD
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
        </div>
        <div className="text-center border-top pt-3"><p className="mb-0">© {new Date().getFullYear()} MicrodosePlus. All rights reserved.</p></div>
      </div>
    </footer>
  );
};

export default Footer;