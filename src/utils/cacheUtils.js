import { apiSlice } from '../apiSlice';
import store from '../store';

/**
 * Utility functions to manually refresh cached data
 * Call these functions when you update content in WordPress to ensure fresh data is fetched
 */

// Refresh all tabs data
export const refreshTabsData = () => {
  store.dispatch(
    apiSlice.util.invalidateTags(['Tabs'])
  );
};

// Refresh menu items
export const refreshMenuItems = () => {
  store.dispatch(
    apiSlice.util.invalidateTags(['Menu'])
  );
};

// Refresh site options (logo, etc.)
export const refreshSiteOptions = () => {
  store.dispatch(
    apiSlice.util.invalidateTags(['SiteOptions'])
  );
};

// Refresh a specific page by slug
export const refreshPageBySlug = (slug) => {
  store.dispatch(
    apiSlice.util.invalidateTags([{ type: 'Page', id: slug }])
  );
};

// Refresh all cached data
export const refreshAllData = () => {
  store.dispatch(
    apiSlice.util.invalidateTags(['Tabs', 'Menu', 'SiteOptions', 'Page'])
  );
};

// Force refetch all tabs data
export const forceRefetchTabsData = () => {
  store.dispatch(
    apiSlice.endpoints.getTabsData.initiate(null, { forceRefetch: true })
  );
};

// Force refetch menu items
export const forceRefetchMenuItems = () => {
  store.dispatch(
    apiSlice.endpoints.getMenuItemsHeader.initiate(null, { forceRefetch: true })
  );
  store.dispatch(
    apiSlice.endpoints.getMenuItemsFooter.initiate(null, { forceRefetch: true })
  );
};

// Force refetch site options
export const forceRefetchSiteOptions = () => {
  store.dispatch(
    apiSlice.endpoints.getSiteOptions.initiate(null, { forceRefetch: true })
  );
};

// Force refetch a specific page
export const forceRefetchPageBySlug = (slug) => {
  store.dispatch(
    apiSlice.endpoints.getPageBySlug.initiate(slug, { forceRefetch: true })
  );
};