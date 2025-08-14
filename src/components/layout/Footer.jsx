import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiInstagramFill,
  RiLinkedinBoxFill
} from 'react-icons/ri';
import Loader from '../Loader';
import { fetchMenuItemsFooter } from '../../utils/menuApi';

const Footer = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const loadMenuItems = async () => {
        try {
          const items = await fetchMenuItemsFooter();
          setMenuItems(items);
        } catch (error) {
          console.error('Error loading menu items:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadMenuItems();
    }, []);
  
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
          <div className="col-md-6">
            <nav className="d-flex justify-content-center">
              {loading ? (
                  <Loader size="small" color="primary" />
                ) : (
                  <ul className="nav">
                    {menuItems.map((item) => (
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
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiFacebookCircleFill color='#047051' />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiInstagramFill color='#047051' />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <RiLinkedinBoxFill color='#047051' />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center border-top pt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Joyspan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 