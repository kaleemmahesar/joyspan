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
  Link
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { jsPDF } from 'jspdf';
import Loader from '../Loader';

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
          formattedActivities
            .filter(a => a.pdfUrl) // Only include activities with PDFs
            .map(a => [a.name, a.pdfUrl])
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

  const generatePDF = async (values) => {
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
  };

  const handleNext = async (values, { setTouched }) => {
    if (activeStep === 0 && !values.feeling) {
      setTouched({ feeling: true });
      return;
    }
    if (activeStep === 1 && !values.activity) {
      setTouched({ activity: true });
      return;
    }
    if (activeStep === steps.length - 2) {
      try {
        const url = await generatePDF(values);
        const formData = new FormData();
        formData.append('pdf_url', url);
        formData.append('action', 'send_email');
        await axios.post('http://localhost/joyspan-server/upload_pdf.php', formData);
      } catch (e) {
        console.error('PDF generation or email failed', e);
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = () => setIsCompleted(true);

  const getStepHeading = () => {
    switch (activeStep) {
      case 0: return "Let's start with how you're feeling";
      case 1: return "Choose an activity that resonates with you";
      case 2: return "Here's your personalized plan";
      default: return "";
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
          <Box>
            <Typography variant="body1" className="me-text">
              <div className="me-text" dangerouslySetInnerHTML={{ __html: getFeelingBasedDescription(values.feeling) }} />
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Card className="me-card">
              <CardContent className="me-card-content">
                <Typography variant="h6" gutterBottom className="me-text">
                  Recommended Activity: {values.activity}
                </Typography>
                <div className="me-text" dangerouslySetInnerHTML={{ __html: activityDescriptions[values.activity] }} />
                <Typography variant="body2" color="text.secondary" className="me-text">
                  Practice this activity daily for best results. Remember to be patient with yourself and celebrate small progress.
                </Typography>
              </CardContent>
            </Card>
            {values.activity && activityPdfUrls[values.activity] && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link
                  href={activityPdfUrls[values.activity]}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: '#0AA5C5',
                    '&:hover': {
                      color: '#0889A3'
                    }
                  }}
                >
                  View Activity PDF Guide
                </Link>
              </Box>
            )}
          </Box>
        );
      case 3:
        return renderSuccessMessage(values);
      default:
        return null;
    }
  };

  const renderSuccessMessage = (values) => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <img src="/ok.png" />
      <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
        Congratulations!
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Thanks for completing the exercise</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>When you feel ready, try another exercise.</Typography>
      {values.activity && activityPdfUrls[values.activity] && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleSendEmail(values)}
            disabled={isSendingEmail}
            sx={{
              backgroundColor: '#0AA5C5',
              '&:hover': {
                backgroundColor: '#0889A3'
              },
              minWidth: '250px'
            }}
          >
            {isSendingEmail ? 'Sending...' : 'Send PDF to My Email'}
          </Button>
          {userEmail && (
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              You'll receive a PDF of the instructions at {userEmail}
            </Typography>
          )}
        </Box>
      )}
      {/* <Button 
        variant="outlined" 
        onClick={() => { setIsCompleted(false); setActiveStep(0); }} 
        sx={{ mt: 4 }}
      >
        Start New Assessment
      </Button> */}
    </Box>
  );

  const handleSendEmail = async (values) => {
    if (!values.activity || !activityPdfUrls[values.activity]) return;
    
    setIsSendingEmail(true);
    try {
      const formData = new FormData();
      formData.append('pdf_url', activityPdfUrls[values.activity]);
      formData.append('action', 'send_email');
      formData.append('user_email', userEmail);
      
      await axios.post('http://localhost/joyspan-server/upload_pdf.php', formData);
      
      // Show success message or notification here
      alert('PDF has been sent to your email!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send PDF to email. Please try again.');
    } finally {
      setIsSendingEmail(false);
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
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, setFieldValue, setTouched, errors, touched }) => (
                <Form>
                  {isCompleted ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <img src="/ok.png" />
                      <Typography variant="h4" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                        Congratulations!
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>Thanks for completing the exercise</Typography>
                      {values.activity && activityPdfUrls[values.activity] && (
                        <Box sx={{ mt: 3 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleSendEmail(values)}
                            disabled={isSendingEmail}
                            sx={{
                              backgroundColor: '#0AA5C5',
                              '&:hover': {
                                backgroundColor: '#0889A3'
                              },
                              minWidth: '250px'
                            }}
                          >
                            {isSendingEmail ? 'Sending...' : 'Send PDF to My Email'}
                          </Button>
                          {userEmail && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                              Will be sent to: {userEmail}
                            </Typography>
                          )}
                        </Box>
                      )}
                      <Button 
                        variant="outlined" 
                        onClick={() => { setIsCompleted(false); setActiveStep(0); }} 
                        sx={{ mt: 4 }}
                      >
                        Start New Assessment
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {activeStep !== 3 && <Typography variant="h5" className="me-heading">{getStepHeading()}</Typography>}
                      <div className="content-wrapper">
                        {renderStepContent(activeStep, values, setFieldValue, errors, touched)}
                        {activeStep !== 3 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" className="me-button me-button-outlined">Back</Button>
                            <Button variant="contained" onClick={() => handleNext(values, { setTouched })} type={activeStep === steps.length - 1 ? 'submit' : 'button'} className="me-button me-button-contained">{activeStep === steps.length - 1 ? 'Finish' : 'Continue'}</Button>
                          </Box>
                        )}
                      </div>
                    </>
                  )}
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
