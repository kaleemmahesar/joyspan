import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPageBySlugQuery } from '../apiSlice';
import '../App.css';
import Loader from '../components/Loader';

const DynamicPage = () => {
  const { slug } = useParams();
  
  // Use Redux Toolkit Query hook for caching
  const { 
    data: page, 
    isLoading, 
    isError
  } = useGetPageBySlugQuery(slug);

  if (isLoading) return <Loader />;
  if (isError || !page) return <h2>Page not found</h2>;

  return (
    <main className="pages-wrapper">
        <div className='container'>
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </div>
    </main>
  );
};

export default DynamicPage;