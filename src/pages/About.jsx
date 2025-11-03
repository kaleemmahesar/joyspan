import React from 'react';
import { useGetPageBySlugQuery } from '../apiSlice';
import Loader from '../components/Loader';

const About = () => {
  // Use Redux Toolkit Query hook for caching
  const { 
    data: pageContent, 
    isLoading, 
    isError
  } = useGetPageBySlugQuery('about');

  if (isLoading) return <Loader />;
  if (isError || !pageContent) return <h2>Failed to load page content</h2>;

  return (
    <main className='page-wrapper'>
      <div className="container">
        <h2 dangerouslySetInnerHTML={{ __html: pageContent?.title?.rendered }} />
        <div dangerouslySetInnerHTML={{ __html: pageContent?.content?.rendered }} />
      </div>
    </main>
  );
};

export default About;