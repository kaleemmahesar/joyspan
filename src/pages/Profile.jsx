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
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

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
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('/wp/v2/users/me', {
          headers: { Authorization: `Bearer ${token}` }
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

        setNewEmail(userData.email || '');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEmailChange = (e) => setNewEmail(e.target.value);

  const handleEmailUpdate = async () => {
    try {
      setError('');
      setSuccessMsg('');
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/custom/v1/change-email',
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfileData((prev) => ({ ...prev, email: newEmail }));
      setSuccessMsg('Email updated successfully');
      setIsEditingEmail(false);
    } catch (err) {
      console.error('Error updating email:', err);
      setError(err?.response?.data?.message || 'Failed to update email');
    }
  };

  if (loading) {
    return (
      <div className="profile-background">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-background">
      <div className="container py-5">
        <div className="card profile-card shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="rounded-circle me-3"
                width="80"
                height="80"
              />
              <div>
                <h4 className="mb-0 text-capitalize">{profileData.name}</h4>
              </div>
            </div>

            <div className="info-section">
              {/* Email Field */}
              <div className="info-item d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-envelope me-2 text-primary" />
                  {isEditingEmail ? (
                    <input
                      type="email"
                      className="form-control d-inline-block w-auto"
                      value={newEmail}
                      onChange={handleEmailChange}
                    />
                  ) : (
                    <span className="text-muted">{profileData.email}</span>
                  )}
                </div>
                <div>
                  {isEditingEmail ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={handleEmailUpdate}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditingEmail(false)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditingEmail(true)}>
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Other Info */}

              {/* Feedback */}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}
            </div>
          </div>
        </div>

        {/* Wellness History */}
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="fas fa-history me-2"></i>
              Wellness History
            </h5>
            <WellnessHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
