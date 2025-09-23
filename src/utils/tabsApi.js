import axios from './axios';

export const fetchTabsData = async () => {
  try {
    // Fetch tabs data from WordPress
    const response = await axios.get('/wp/v2/posts', {
      params: {
        _t: Date.now(), // 👈 forces fresh fetch every time
        categories: 8, // Replace with your actual category ID for tabs
        per_page: 100,
        _embed: true // This will include featured image data
      }
    });
    
    // Format the data for tabs
    const tabsData = response.data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }));

    return tabsData;
  } catch (error) {
    console.error('Error fetching tabs data:', error);
    return [];
  }
}; 