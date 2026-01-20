import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

// Helper function to decode HTML entities
const decodeHtmlEntities = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// Helper function to recursively decode all string values in an object
const decodeObjectHtmlEntities = (obj) => {
  if (typeof obj === 'string') {
    return decodeHtmlEntities(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(decodeObjectHtmlEntities);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const decoded = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        decoded[key] = decodeObjectHtmlEntities(obj[key]);
      }
    }
    return decoded;
  }
  
  return obj;
};

// Create our base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Tabs', 'Menu', 'Page', 'SiteOptions'],
  endpoints: (builder) => ({
    // Tabs data endpoint - cache for 5 minutes
    getTabsData: builder.query({
      queryFn: async () => {
        try {
          const response = await axios.get('https://microdoseplus.com/wp/wp-json/wp/v2/posts', {
            params: {
              categories: 37,
              per_page: 100,
              _embed: true,
              // Add timestamp to force fresh data on page load
              _t: Date.now()
            }
          });
          
          const tabsData = response.data.map(post => ({
            id: post.id,
            title: post.title.rendered,
            content: post.content.rendered,
            excerpt: post.excerpt.rendered,
            slug: post.slug,
            featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
          }));
          
          return { data: tabsData };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Tabs'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    // Header menu items endpoint - cache for 5 minutes
    getMenuItemsHeader: builder.query({
      queryFn: async () => {
        try {
          const response = await axios.get('https://microdoseplus.com/wp/wp-json/wp-api-menus/v2/menus/6', {
            params: {
              // Add timestamp to force fresh data on page load
              _t: Date.now()
            }
          });
          return { data: response.data.items };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Menu'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    // Footer menu items endpoint - cache for 5 minutes
    getMenuItemsFooter: builder.query({
      queryFn: async () => {
        try {
          const response = await axios.get('https://microdoseplus.com/wp/wp-json/wp-api-menus/v2/menus/14', {
            params: {
              // Add timestamp to force fresh data on page load
              _t: Date.now()
            }
          });
          return { data: response.data.items };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Menu'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    // Site options endpoint (logo, etc.) - cache for 5 minutes
    getSiteOptions: builder.query({
      queryFn: async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/wp-json/custom/v1/options`, {
            params: {
              // Add timestamp to force fresh data on page load
              _t: Date.now()
            }
          });
          
          // Decode HTML entities in the response data
          const decodedData = decodeObjectHtmlEntities(res.data);
          
          return { data: decodedData };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['SiteOptions'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    // Page content by slug endpoint - cache for 5 minutes
    getPageBySlug: builder.query({
      queryFn: async (slug) => {
        try {
          const res = await axios.get(`https://microdoseplus.com/wp/wp-json/wp/v2/pages`, {
            params: {
              slug: slug,
              // Add timestamp to force fresh data on page load
              _t: Date.now()
            }
          });
          if (res.data.length > 0) {
            // Decode HTML entities in page content
            const pageData = {
              ...res.data[0],
              title: {
                ...res.data[0].title,
                rendered: decodeHtmlEntities(res.data[0].title.rendered)
              },
              content: {
                ...res.data[0].content,
                rendered: decodeHtmlEntities(res.data[0].content.rendered)
              }
            };
            return { data: pageData };
          } else {
            return { error: 'Page not found' };
          }
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result, error, slug) => [{ type: 'Page', id: slug }],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTabsDataQuery,
  useGetMenuItemsHeaderQuery,
  useGetMenuItemsFooterQuery,
  useGetSiteOptionsQuery,
  useGetPageBySlugQuery,
} = apiSlice;

// Export endpoints for manual refetching
export const {
  getTabsData,
  getMenuItemsHeader,
  getMenuItemsFooter,
  getSiteOptions,
  getPageBySlug,
} = apiSlice.endpoints;