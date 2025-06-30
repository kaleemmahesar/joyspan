import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import axios from '../utils/axios';
import { useAuth } from '../utils/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './Login.css';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user: auth0User, getAccessTokenSilently } = useAuth0();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  
  // Handle Auth0 authentication success
  React.useEffect(() => {
    const handleAuth0Login = async () => {
      if (isAuthenticated && auth0User) {
        try {
          // Get Auth0 token
          const token = await getAccessTokenSilently();
          
          // Create user data from Auth0 user
          const userData = {
            id: auth0User.sub,
            name: auth0User.name,
            email: auth0User.email,
            username: auth0User.email.split('@')[0], // Use email prefix as username
            picture: auth0User.picture
          };

          // Store token
          localStorage.setItem('token', token);
          // Login with user data
          await login(userData);
          console.log('Auth0 login successful, redirecting...');
          navigate('/');
        } catch (err) {
          console.error('Auth0 login error:', err);
          setError('Failed to complete login. Please try again.');
        }
      }
    };

    handleAuth0Login();
  }, [isAuthenticated, auth0User, getAccessTokenSilently, login, navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setForgotPasswordLoading(true);

    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your email address');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.post('/custom/v1/lost-password', {
        email: forgotPasswordEmail
      });

      if (response.data) {
        setForgotPasswordSuccess('Password reset instructions have been sent to your email. Please check your inbox and follow the link to reset your password.');
        setForgotPasswordEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordSuccess('');
        }, 5000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to process password reset. Please try again.';
      setForgotPasswordError(errorMessage);
      
      if (err.response?.data?.debug) {
        console.error('Debug information:', err.response.data.debug);
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      console.log('Attempting login with:', values);
      const response = await axios.post(
        '/jwt-auth/v1/token',
        {
          username: values.username,
          password: values.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Get user data
        const userResponse = await axios.get(
          '/wp/v2/users/me',
          {
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          }
        );
        
        console.log('User data:', userResponse.data);
        
        if (!userResponse.data) {
          throw new Error('Failed to get user data');
        }

        // Create user object with necessary data
        const userData = {
          id: userResponse.data.id,
          name: userResponse.data.name || '',
          email: userResponse.data.email || '',
          username: userResponse.data.username || '',
          role: userResponse.data.roles && userResponse.data.roles.length > 0 
            ? userResponse.data.roles[0] 
            : 'subscriber' // Default role if none is set
        };

        // Login with user data
        await login(userData);
        console.log('Login successful, redirecting...');
        document.body.classList.add('user-logged-in');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Invalid username or password');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        setError('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-background">
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} className='login-paper'>
            <h3>We're here for help and support</h3>
            <h2>Sign In</h2>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="login-form">
                
                {forgotPasswordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {forgotPasswordError}
                  </Alert>
                )}
                
                {forgotPasswordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {forgotPasswordSuccess}
                  </Alert>
                )}

                <div className="form-row">
                  <div className="form-field">
                    <label>Email Address</label>
                    <TextField
                      fullWidth
                      id="forgot-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      autoFocus
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="login-button"
                    fullWidth
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    className="signup-button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setForgotPasswordError('');
                      setForgotPasswordSuccess('');
                    }}
                    fullWidth
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="login-form">
                    <div className="form-row">
                      <div className="form-field">
                        <label>Username or Email</label>
                        <Field
                          as={TextField}
                          name="username"
                          placeholder="Enter your username"
                          fullWidth
                          error={touched.username && Boolean(errors.username)}
                          helperText={touched.username && errors.username}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label>Password</label>
                        <Field
                          as={TextField}
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          fullWidth
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                    <Link
                      href="#"
                        variant="body2"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotPasswordEmail('');
                          setForgotPasswordError('');
                          setForgotPasswordSuccess('');
                        }}
                        className="forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="form-buttons">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="login-button"
                        fullWidth
                        disabled={isSubmitting}
                      >
                        Log In
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        className="signup-button"
                        onClick={() => navigate('/signup')}
                        fullWidth
                      >
                        Don't have an account? Sign up
                      </Button>
                      
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;