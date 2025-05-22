export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/joyspan-server';

export const getUploadUrl = () => `${API_BASE_URL}/upload_pdf.php`; 