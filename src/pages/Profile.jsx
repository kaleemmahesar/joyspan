import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import axios from '../utils/axios';
import WellnessHistory from '../components/WellnessHistory';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    profession: '',
    phone: '',
    organization: '',
    country: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = response.data;
        
        setProfileData({
          name: userData.name || '',
          email: userData.email || userData.user_email || '',
          username: userData.username || '',
          profession: userData.meta?.profession || '',
          phone: userData.meta?.phone || '',
          organization: userData.meta?.organization || '',
          country: userData.meta?.country || '',
          avatar: userData.avatar_urls?.['96'] || ''
        });

      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-background">
        <div className="container">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-background">
      <div className="container">
        <div className="main-body">
          {/* Profile Header */}
          <div className="profile-header">
            <div className='row'>
              <div className='col-md-12'>
            <div className="profile-info">
              <h4 className="mb-1 text-capitalize">{profileData.name}</h4>
              <p className="text-muted mb-3">
                {profileData.profession || 'No profession specified'}
              </p>
              <div className="profile-card-body">
                  <div className="contact-info-item">
                    <i className="fas fa-envelope me-2"></i>
                    <span>{profileData.email}</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-phone me-2"></i>
                    <span>{profileData.phone || 'Not provided'}</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-building me-2"></i>
                    <span>{profileData.organization || 'Not provided'}</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <span>{profileData.country || 'Not provided'}</span>
                  </div>
                </div>
            </div>
            </div>
            
            </div>
          </div>

          <div className="row">
            {/* Right Column - Wellness History */}
            <div className="col-md-12">
              <div className="card">
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <div>
                    <h6 className="card-title mb-3">
                      <i className="fas fa-history me-2"></i>
                      Wellness History
                    </h6>
                    <WellnessHistory />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 