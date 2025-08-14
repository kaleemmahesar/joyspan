import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMenuItemsHeader } from '../../utils/menuApi';
import { useAuth } from '../../utils/AuthContext';
import Loader from '../Loader';
import './Header.css';
import axios from 'axios';

const Header = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchMenuItemsHeader();
        setMenuItems(items);
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();

    const fetchLogo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/wp-json/custom/v1/options`);
        setLogoUrl(res.data.site_logo);
      } catch (err) {
        console.error('Error fetching site logo:', err);
      }
    };

    fetchLogo();
  }, []);

  const cleanUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (error) {
      return url;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className={`top-header ${isMenuOpen ? 'hidden' : ''}`}>
        <div className="container">
          <div className="d-flex justify-content-center gap-4 align-items-center p-2">
            <p className="welcome-text">Find exercises that can help you, your patients and your team</p>
            {!user && (
              <Link to="/signup" className="join-us-btn">Join Us</Link>
            )}
          </div>
        </div>
      </div>
      <div className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto d-flex align-items-center logo-area">
              <Link to="/" className="logo">
                <img src='/microdosplus-logo.svg' alt="Microdoseplus" />
              </Link>
              <button 
  className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
  onClick={toggleMenu}
  aria-label="Toggle navigation"
>
  <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
</button>
            </div>
            <div className={`col mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <div className={`col main-nav-wrapper`}>
                <nav className="main-nav">
                  {loading ? (
                    <Loader size="small" color="primary" />
                  ) : (
                    <ul className="nav-list">
                      {menuItems.map((item) => (
                        <li key={item.id}>
                          <Link 
                            to={cleanUrl(item.object_slug)} 
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </nav>
              </div>
              <div className={`col-auto header-buttons`}>
                {user ? (
                  <div className="d-flex align-items-center gap-3">
                    <div className="user-info">
                      <span className="user-name">Welcome, <Link to='/profile'>{user.name}</Link></span>
                    </div>
                    <button 
                      className="btn btn-outline" 
                      onClick={handleLogout}
                      style={{ height: '38px', padding: '0 20px', fontSize: '16px', fontWeight: '500' }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-outline">Sign In</Link>
                    <Link to="/signup" className="btn btn-primary">Join</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
