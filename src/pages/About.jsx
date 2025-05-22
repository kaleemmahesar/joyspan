import React from 'react';
import TextImageSection from '../components/sections/TextImageSection';
import TextImageVertical from '../components/sections/TextImageVertical';

const About = () => {
  return (
    <main>
      <div className="container">
        <TextImageSection
          title="About Joyspan"
          text="Founded in 2024, Joyspan has quickly established itself as a leader in technology solutions. Our team combines expertise with innovation to deliver exceptional results for our clients."
          imageSrc="/images/about.jpg"
          imageAlt="About Joyspan"
        />
        
        <TextImageVertical
          title="Our Team"
          text="Our diverse team of professionals brings together expertise from various domains, creating a powerhouse of talent dedicated to delivering excellence in every project."
          imageSrc="/images/team.jpg"
          imageAlt="Our Team"
        />
        
        <TextImageSection
          title="Our Values"
          text="We believe in innovation, integrity, and excellence. These core values guide everything we do, from how we work with clients to how we develop solutions."
          imageSrc="/images/values.jpg"
          imageAlt="Our Values"
          reverse={true}
        />
      </div>
    </main>
  );
};

export default About; 