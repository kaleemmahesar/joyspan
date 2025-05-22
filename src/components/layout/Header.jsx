import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMenuItems } from '../../utils/menuApi';
import { useAuth } from '../../utils/AuthContext';
import './Header.css';

const Header = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchMenuItems();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="top-header">
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
            <div className="col-auto">
              <Link to="/" className="logo">
                <img src="/logo.png" alt="JoySpan" />
              </Link>
            </div>
            <div className="col">
              <nav className="main-nav">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <ul className="nav-list">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Link 
                          to={cleanUrl(item.url)} 
                          className="nav-link"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </div>
            <div className="col-auto">
              <div className="header-buttons">
                {user ? (
                  <div className="d-flex align-items-center gap-3">
                    <div className="user-info">
                      <span className="user-name">Welcome, {user.name}</span>
                    </div>
                    <button 
                      className="btn btn-outline" 
                      onClick={handleLogout}
                      style={{ 
                        height: '38px',
                        padding: '0 20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
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