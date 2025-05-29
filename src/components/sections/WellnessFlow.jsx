import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Divider,
  Card,
  CardContent,
  Link,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { jsPDF } from 'jspdf';
import Loader from '../Loader';
import './WellnessFlow.css';
import { useNavigate } from 'react-router-dom';

const steps = ['How are you feeling?', 'Choose an activity', 'Your personalized plan', 'Complete'];

const initialValues = {
  feeling: '',
  activity: ''
};

const WellnessFlow = ({
  feelingCategoryId,
  activityCategoryId,
  feelingPostType,
  activityPostType,
  title
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [feelingOptions, setFeelingOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const [activityDescriptions, setActivityDescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activityPdfUrls, setActivityPdfUrls] = useState({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('/wp/v2/users/me');
        if (userResponse.data?.email) setUserEmail(userResponse.data.email);
      } catch {}

      try {
        const feelingsRes = await axios.get(`/wp/v2/${feelingPostType}`, {
          params: { per_page: 100, categories: feelingCategoryId }
        });
        const formattedFeelings = feelingsRes.data.map(post => ({
          value: post.slug,
          label: post.title.rendered,
          description: post.content.rendered
        }));
        setFeelingOptions(formattedFeelings);

        const activitiesRes = await axios.get(`/wp/v2/${activityPostType}`, {
          params: { per_page: 100, categories: activityCategoryId }
        });
        
        // Debug log to see the structure
        console.log('Activity with PDF:', activitiesRes.data.find(post => post.acf?.attached_pdf));
        
        const formattedActivities = activitiesRes.data.map(post => ({
          name: post.title.rendered,
          description: post.content.rendered,
          pdfUrl: post.acf?.attached_pdf?.url || ''
        }));

        setActivityOptions(formattedActivities.map(a => a.name));
        setActivityDescriptions(Object.fromEntries(
          formattedActivities.map(a => [a.name, a.description])
        ));
        
        // Create PDF URLs map
        const pdfUrlsMap = Object.fromEntries(
          formattedActivities.map(a => [a.name, a.pdfUrl])
        );
        
        console.log('PDF URLs Map:', pdfUrlsMap);
        setActivityPdfUrls(pdfUrlsMap);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching WordPress data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [feelingCategoryId, activityCategoryId, feelingPostType, activityPostType]);

  const getFeelingBasedDescription = (feeling) => {
    const feelingData = feelingOptions.find(opt => opt.value === feeling);
    return feelingData ? feelingData.description : "We've selected activities that will help you improve your overall well-being and find balance in your life.";
  };

  // Comment out PDF generation function
  /*
  const generatePDF = async (values) => {
    try {
      const feelingOption = feelingOptions.find(opt => opt.value === values.feeling);
      const doc = new jsPDF();
      doc.setFont('helvetica');
      doc.setFillColor(10, 165, 197);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 105, 25, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('How are you feeling:', 20, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(feelingOption ? feelingOption.label : values.feeling, 30, 70);

      doc.setFontSize(12);
      const feelingDescription = getFeelingBasedDescription(values.feeling);
      const splitDescription = doc.splitTextToSize(feelingDescription, 170);
      doc.text(splitDescription, 20, 85);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 110, 190, 110);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Selected Activity:', 20, 130);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(values.activity, 30, 140);

      const activityDescription = activityDescriptions[values.activity];
      const splitActivityDesc = doc.splitTextToSize(activityDescription, 170);
      doc.setFontSize(12);
      doc.text(splitActivityDesc, 20, 155);

      doc.line(20, 180, 190, 180);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Practice Tips:', 20, 200);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      const practiceTips = [
        '• Practice this activity daily for best results',
        '• Find a quiet, comfortable space',
        '• Set aside 10-15 minutes for your practice',
        '• Be patient with yourself and celebrate small progress',
        '• Track your progress in a journal if helpful'
      ];
      practiceTips.forEach((tip, i) => {
        doc.text(tip, 30, 210 + i * 10);
      });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 280);
      doc.setFontSize(8);
      doc.text('Created with JoySpan', 105, 285, { align: 'center' });

      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'wellness-plan.pdf');

      try {
        const response = await axios.post('http://localhost/joyspan-server/upload_pdf.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        });

        if (response.data?.success && response.data.url) {
          setPdfUrl(response.data.url);
          return response.data.url;
        }
      } catch (uploadError) {
        console.warn('PDF upload failed, but continuing with wellness data save:', uploadError);
        // Continue with the process even if PDF upload fails
        return null;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };
  */

  const handleNext = (values, { setTouched }) => {
    console.log('Current step:', activeStep);
    console.log('Required values:', values);

    // Check if required values are present based on current step
    if (activeStep === 0 && !values.feeling) {
      setTouched({ feeling: true });
      return;
    }
    if (activeStep === 1 && !values.activity) {
      setTouched({ activity: true });
      return;
    }

    // If we're at the second-to-last step, save the data
    if (activeStep === steps.length - 2) {
      handleSubmit(values);
    }

    // Move to next step
    setActiveStep(prev => {
      console.log('Moving from step', prev, 'to step', prev + 1);
      return prev + 1;
    });
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (values) => {
    console.log('Submitting wellness data...');
    
    // Get the feeling label from the selected option
    const feelingOption = feelingOptions.find(opt => opt.value === values.feeling);
    console.log('Selected feeling option:', feelingOption);
    const path = window.location.pathname;
    const section = path.split('/')[1]; // Get 'me', 'you', or 'us' from the URL
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    console.log('Section name:', sectionName);  
    const wellnessData = {
      feeling: feelingOption ? feelingOption.label : values.feeling,
      feeling_value: values.feeling,
      activity: values.activity,
      section: sectionName,
      completed_at: new Date().toISOString(),
      activity_description: activityDescriptions[values.activity],
      feeling_description: getFeelingBasedDescription(values.feeling),
      activity_pdf_url: activityPdfUrls[values.activity] || '',
    };

    console.log('Saving wellness datagggggg:', wellnessData);

    try {
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      const response = await axios.post('/wp/v2/wellness-history', wellnessData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Wellness data saved successfullygfgf:', response.data);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error saving wellness data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleSendEmail = async (values) => {
    if (!values.activity || !activityPdfUrls[values.activity]) return;
    
    setIsSendingEmail(true);
    try {
      const formData = new FormData();
      formData.append('pdf_url', activityPdfUrls[values.activity]);
      formData.append('action', 'send_email');
      formData.append('user_email', userEmail);
      
      try {
        await axios.post('http://localhost/joyspan-server/upload_pdf.php', formData);
        alert('PDF has been sent to your email!');
      } catch (error) {
        console.warn('Email sending failed:', error);
        alert('Failed to send PDF to email. You can still download it manually.');
      }
    } catch (error) {
      console.error('Error in email process:', error);
      alert('Failed to process email request. You can still download the PDF manually.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getStepHeading = (values) => {
    const path = window.location.pathname;
    const section = path.split('/')[1]; // Get 'me', 'you', or 'us' from the URL
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    switch (activeStep) {
      case 0: 
        
        return `<b>${sectionName}</b> - Choose a Feeling that applies to you or that interests you`;
      case 1: {
        const feelingOption = feelingOptions.find(opt => opt.value === values?.feeling);
        const feelingLabel = feelingOption ? feelingOption.label : '';
        return `<b>${sectionName}</b> - Choose an activity for ${feelingLabel}`;
      }
      case 2: {
        const feelingOption = feelingOptions.find(opt => opt.value === values?.feeling);
        const feelingLabel = feelingOption ? feelingOption.label : '';
        return `<b>${sectionName}</b> - Your plan for ${feelingLabel} with ${values?.activity || ''}`;
      }
      default: 
        return "";
    }
  };

  const renderStepContent = (step, values, setFieldValue, errors, touched) => {
    switch (step) {
      case 0:
        return (
          <FormControl component="fieldset" className="me-form-control">
            <RadioGroup name="feeling" value={values.feeling} onChange={e => setFieldValue('feeling', e.target.value)} className="me-radio-group" row={false}>
              <div>
                {feelingOptions.map(option => (
                  <FormControlLabel key={option.value} value={option.value} control={<Radio className="me-radio" />} label={option.label} className="me-form-label" />
                ))}
              </div>
            </RadioGroup>
            {touched.feeling && errors.feeling && <Typography color="error" className="me-error-text">{errors.feeling}</Typography>}
          </FormControl>
        );
      case 1:
        return (
          <FormControl component="fieldset" className="me-form-control">
            <RadioGroup name="activity" value={values.activity} onChange={e => setFieldValue('activity', e.target.value)} className="me-radio-group" row={false}>
              <div>
                {activityOptions.map(activity => (
                  <FormControlLabel key={activity} value={activity} control={<Radio className="me-radio" />} label={activity} className="me-form-label" />
                ))}
              </div>
            </RadioGroup>
            {touched.activity && errors.activity && <Typography color="error" className="me-error-text">{errors.activity}</Typography>}
          </FormControl>
        );
      case 2:
        return (
          <Box sx={{ mb: 5 }} className="me-card-step2">
            <Typography variant="body1" className="me-text">
              <div className="me-text" dangerouslySetInnerHTML={{ __html: getFeelingBasedDescription(values.feeling) }} />
            </Typography>
            <div className="me-text" dangerouslySetInnerHTML={{ __html: activityDescriptions[values.activity] }} />
          </Box>
        );
      case 3:
        return (
          <Box className="success-container">
            <img src="/ok.png" className="success-image" />
            <Typography variant="h4" className="success-title">
              Congratulations!
            </Typography>
            <Typography variant="h6" className="success-subtitle">Thanks for completing the exercise</Typography>
            <Typography variant="h6" className="success-subtitle">When you feel ready, try another exercise.</Typography>
            {isCompleted && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
              Your activity has been saved to your wellness history
            </Typography>
            )}
            {values.activity && activityPdfUrls[values.activity] && (
              <Box className="action-buttons">
                <Button
                  variant="outlined"
                  href={activityPdfUrls[values.activity]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-button"
                >
                  Download Activity PDF
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSendEmail(values)}
                  disabled={isSendingEmail}
                  className="email-button"
                >
                  {isSendingEmail ? 'Sending...' : 'Send PDF to My Email'}
                </Button>
                {userEmail && (
                  <Typography variant="body2" className="email-text">
                    You'll receive a PDF of the instructions at {userEmail}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  const validationSchema = Yup.object({
    feeling: Yup.string().required('Please select how you are feeling'),
    activity: Yup.string().required('Please select an activity')
  });

  if (loading) return <Loader size="large" color="primary" />;

  return (
    <div className={`me-content step-${activeStep + 1}`}>
      <div className="container">
        <Container maxWidth={false}>
          <Paper elevation={0} sx={{ position: 'relative', zIndex: 1 }}>
            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema} 
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, setTouched, errors, touched }) => (
                <Form>
                  
                  {activeStep !== 3 && (
                    <Typography 
                      variant="h5" 
                      className="me-heading"
                      dangerouslySetInnerHTML={{ __html: getStepHeading(values) }}
                    />
                  )}
                  <div className="content-wrapper">
                    {renderStepContent(activeStep, values, setFieldValue, errors, touched)}
                    {activeStep !== 3 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        {activeStep > 0 && (
                          <Button onClick={handleBack} variant="outlined" className="me-button me-button-outlined">Back</Button>
                        )}
                        <Button 
                          variant="contained" 
                          onClick={() => handleNext(values, { setTouched })}
                          type="button"
                          className="me-button me-button-contained"
                          sx={{ ml: activeStep === 0 ? 'auto' : 0 }}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                      </Box>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default WellnessFlow;
