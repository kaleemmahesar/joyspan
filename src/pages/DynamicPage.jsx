import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(null);

    //console.log('Fetching page with slug:', slug);

    axios
      .get(`https://microdoseplus.com/wp/wp-json/wp/v2/pages?slug=${slug}`)
      .then((res) => {
        if (res.data.length > 0) {
          setPage(res.data[0]);
        } else {
          setPage(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching page:', err);
        setPage(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]); // ✅ Watch for slug changes

  if (loading) return <Loader />;
  if (!page) return <h2>Page not found</h2>;

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
