import React from 'react';
import WellnessFlow from '../components/sections/WellnessFlow';
import './Me.css';

const Us = () => {
  return (
    <WellnessFlow
      feelingCategoryId={11} // Existing feeling category
      activityCategoryId={12} // Existing activity category
      feelingPostType="feelings"
      activityPostType="activities"
      title="Your Personalized Wellness Plan"
      flowId="me" // Used for styling (CSS classes)
    />
  );
};

export default Us;