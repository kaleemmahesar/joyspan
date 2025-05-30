import axios from './axios';

export const fetchMenuItemsHeader = async () => {
  try {
    // Fetch menu items from WordPress
    const response = await axios.get('/wp-api-menus/v2/menus/6');
    return response.data.items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}; 

export const fetchMenuItemsFooter = async () => {
  try {
    // Fetch menu items from WordPress
    const response = await axios.get('/wp-api-menus/v2/menus/13');
    return response.data.items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}; 

