import axios from './axios';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// This file is deprecated as we're now using Redux Toolkit Query for API caching
// See apiSlice.js for the new implementation
export const fetchMenuItemsHeader = async () => {
  console.warn('fetchMenuItemsHeader is deprecated. Use Redux Toolkit Query instead.');
  return [];
}; 

export const fetchMenuItemsFooter = async () => {
  console.warn('fetchMenuItemsFooter is deprecated. Use Redux Toolkit Query instead.');
  return [];
};
