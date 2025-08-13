  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { TextField, Button, Paper, Typography, Box, Alert, CircularProgress, MenuItem, Autocomplete, Link } from '@mui/material';
  import { useAuth0 } from '@auth0/auth0-react';
  import { Formik, Form, Field } from 'formik';
  import * as Yup from 'yup';
  import axios from '../utils/axios';
  import '../styles/Login.css';

  const professions = [
    'Student',
    'Healthcare Professional',
    'Mental Health Professional',
    'Educator',
    'Business Professional',
    'Other'
  ];

  const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    // profession: Yup.string().required('Profession is required'),
    // phone: Yup.string().required('Phone number is required').matches(/^\+?[\d\s-]{10,}$/,'Please enter a valid phone number'),
    // organization: Yup.string().required('Organization is required'),
    country: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
  });

  const SignUp = () => {
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (values, { setSubmitting }) => {
      setError('');
      setSuccess('');
      try {
        // Create WordPress user
        const userData = {
          username: values.username,
          email: values.email,
          password: values.password,
          // fullname: values.fullname,
          // phone: values.phone,
          // organization: values.organization,
          country: values.country
        };
  
        //console.log('Attempting registration with:', userData);
  
        // Use the custom registration endpoint
        const response = await axios.post('/custom/v1/register', userData);
  
        if (response.data && response.data.user_id) {
          setSuccess('Registration successful! Please log in.');
          //console.log('Registration successful:', response.data);
          
          // Wait for 2 seconds to show success message
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          throw new Error('User creation failed: No user ID in response');
        }
      } catch (err) {
        console.error('Registration error:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
          if (err.response.data.message) {
            setError(err.response.data.message);
          } else if (err.response.data.code === 'registration_failed') {
            setError(err.response.data.message || 'Registration failed. Please try again.');
          } else if (err.response.data.code === 'missing_fields') {
            setError('Please fill in all required fields.');
          } else if (err.response.data.code === 'invalid_email') {
            setError('Please enter a valid email address.');
          } else if (err.response.data.code === 'password_too_short') {
            setError('Password must be at least 6 characters long.');
          } else {
            setError('Registration failed. Please try again.');
          }
        } else if (err.request) {
          setError('No response from server. Please try again.');
        } else {
          setError(err.message || 'An error occurred. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Box className="login-background">
        <Paper className="login-paper login-paper-signup">
          <Typography variant="h3">We're here for help and support</Typography>
          <Typography variant="h2">Sign Up</Typography>

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

          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
              country: ''
            }}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="login-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Username</label>
                    <Field
                      as={TextField}
                      name="username"
                      placeholder="Choose a username"
                      fullWidth
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />
                  </div>
                  <div className="form-field">
                    <label>Email</label>
                    <Field
                      as={TextField}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
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
                      placeholder="Create a password"
                      fullWidth
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </div>
                  <div className="form-field">
                    <label>Confirm Password</label>
                    <Field
                      as={TextField}
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      fullWidth
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                  </div>
                </div>
                <div className="form-row">
                  {/* <div className="form-field">
                    <label>Full Name</label>
                    <Field
                      as={TextField}
                      name="fullname"
                      select
                      fullWidth
                      error={touched.fullname && Boolean(errors.fullname)}
                      helperText={touched.fullname && errors.fullname}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => value || 'Enter Your Full Name'
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select your profession
                      </MenuItem>
                      {professions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Field>
                  </div> */}
                  <div className="form-field">
                    <label>Full Name</label>
                    <Field
                      as={TextField}
                      name="country"
                      placeholder="Full Name"
                      fullWidth
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                    />
                  </div>
                </div>
                {/* <div className="form-row">
                  <div className="form-field">
                    <label>Organization</label>
                    <Field
                      as={TextField}
                      name="organization"
                      placeholder="Enter your organization name"
                      fullWidth
                      error={touched.organization && Boolean(errors.organization)}
                      helperText={touched.organization && errors.organization}
                    />
                  </div>
                  <div className="form-field">
                    <label>Country</label>
                    <Field name="country">
                      {({ field, form }) => (
                        <Autocomplete
                          options={countries}
                          value={field.value}
                          onChange={(_, value) => {
                            form.setFieldValue('country', value || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search or select your country"
                              fullWidth
                              error={touched.country && Boolean(errors.country)}
                              helperText={touched.country && errors.country}
                            />
                          )}
                          freeSolo
                          disableClearable
                          blurOnSelect
                          autoComplete
                          includeInputInList
                          filterSelectedOptions
                          sx={{
                            '& .MuiAutocomplete-popper': {
                              backgroundColor: 'white !important',
                            },
                            '& .MuiAutocomplete-listbox': {
                              backgroundColor: 'white !important',
                            },
                            '& .MuiPaper-root': {
                              backgroundColor: 'white !important',
                            },
                            '& .MuiAutocomplete-paper': {
                              backgroundColor: 'white !important',
                            }
                          }}
                          ListboxProps={{
                            sx: {
                              backgroundColor: 'white !important',
                            }
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </div> */}
                <div className="form-buttons">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="login-button"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
                  </Button>
                  <Link
                    href="javascript:void(0)"
                        variant="body2"
                    color="primary"
                    className="signup-button"
                    onClick={() => navigate('/login')}
                    fullWidth
                  >
                    Already have an account? Log in
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    );
  };

  export default SignUp;