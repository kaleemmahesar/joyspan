import React from 'react';
import WellnessFlow from '../components/sections/WellnessFlow';
import './Me.css';

const You = () => {
  return (
    <WellnessFlow
    key={location.key}
      feelingCategoryId={9} // Existing feeling category
      activityCategoryId={10} // Existing activity category
      feelingPostType="feelings"
      activityPostType="activities"
      title="Your Personalized Wellness Plan"
      flowId="me" // Used for styling (CSS classes)
    />
  );
};

export default You;