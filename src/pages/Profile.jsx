import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { PhotoCamera, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Email, Phone, Business, LocationOn } from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import axios from '../utils/axios';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Detailed logging of the response
        console.log('Full API Response:', response);
        console.log('User data from API:', response.data);
        console.log('Email from API:', response.data.email);
        console.log('Meta data:', response.data.meta);

        const userData = response.data;
        
        // Map the WordPress user data to our profile data using meta fields
        setProfileData({
          name: userData.name || '',
          email: userData.email || userData.user_email || '', // Try both email fields
          username: userData.username || '',
          profession: userData.meta?.profession || '',
          phone: userData.meta?.phone || '',
          organization: userData.meta?.organization || '',
          country: userData.meta?.country || '',
          avatar: userData.avatar_urls?.['96'] || ''
        });

        // Log the final profile data
        console.log('Final profile data:', {
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

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/wp/v2/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setProfileData({
        ...profileData,
        avatar: response.data.source_url
      });
      setSuccess('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/wp/v2/users/me', {
        name: profileData.name,
        email: profileData.email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-background">
        <Container maxWidth="lg">
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-background">
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Paper elevation={3} className="profile-paper">
            <div className="profile-header">
              <div className="avatar-container">
                <Avatar
                  src={profileData.avatar}
                  alt={profileData.name}
                  sx={{ width: 120, height: 120 }}
                  className="profile-avatar"
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    className="avatar-upload-button"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
              <Typography variant="h4" className="profile-name">
                {profileData.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" className="profile-profession">
                {profileData.profession || 'No profession specified'}
              </Typography>
            </div>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <div className="profile-info">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <div className="info-item">
                    <Email className="info-icon" />
                    <div className="info-content">
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{profileData.email}</Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div className="info-content">
                      <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">{profileData.phone || 'Not provided'}</Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="info-item">
                    <Business className="info-icon" />
                    <div className="info-content">
                      <Typography variant="subtitle2" color="textSecondary">Organization</Typography>
                      <Typography variant="body1">{profileData.organization || 'Not provided'}</Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="info-item">
                    <LocationOn className="info-icon" />
                    <div className="info-content">
                      <Typography variant="subtitle2" color="textSecondary">Country</Typography>
                      <Typography variant="body1">{profileData.country || 'Not provided'}</Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>

            <Divider sx={{ my: 4 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="profile-button"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      className="profile-button"
                      onClick={() => setIsEditing(false)}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="profile-button"
                    onClick={() => setIsEditing(true)}
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Profile; 