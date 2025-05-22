import React from 'react';
import WellnessFlow from '../components/sections/WellnessFlow';
import './Me.css';

const Me = () => {
  return (
    <WellnessFlow
      feelingCategoryId={3} // Existing feeling category
      activityCategoryId={5} // Existing activity category
      feelingPostType="feelings"
      activityPostType="activities"
      title="Your Personalized Wellness Plan"
      flowId="me" // Used for styling (CSS classes)
    />
  );
};

export default Me;