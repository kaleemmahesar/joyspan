import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from './axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        //console.log('Checking auth - Stored user:', storedUser);
        //console.log('Checking auth - Token:', token);

        if (storedUser && token) {
          // Set the token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            // Verify the token is still valid
            const response = await axios.get('https://microdoseplus.com/wp/wp-json/wp/v2/users/me');
            //console.log('Auth check response:', response.data);
            
            if (response.data) {
              const userData = JSON.parse(storedUser);
              //console.log('Setting user data:', userData);
              setUser(userData);
            } else {
              //console.log('No user data in response, logging out');
              logout();
            }
          } catch (error) {
            console.error('Error verifying token:', error);
            logout();
          }
        } else {
          //console.log('No stored user or token found');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    //console.log('Login function called with user data:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set the token in axios headers
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const logout = () => {
    console.log('Logout function called');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.body.classList.remove('user-logged-in');
    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 