import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const About = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost/joyspan-server/wp-json/wp/v2/pages?slug=about')
      .then((res) => {
        if (res.data.length > 0) {
          setPageContent(res.data[0]);
          console.log('Page content fetched:', res.data[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch page content:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

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
