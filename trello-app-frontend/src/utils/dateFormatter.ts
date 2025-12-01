/**
 * Standardized date formatting utility
 */

/**
 * Format a timestamp to a readable date string
 * @param timestamp - Timestamp in milliseconds (number or string)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  timestamp: number | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string => {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' 
    ? new Date(parseInt(timestamp)) 
    : new Date(timestamp);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a timestamp to a date-time string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted date-time string
 */
export const formatDateTime = (timestamp: number | string | null | undefined): string => {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' 
    ? new Date(parseInt(timestamp)) 
    : new Date(timestamp);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a timestamp to a relative time string (e.g., "2 days ago")
 * @param timestamp - Timestamp in milliseconds
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: number | string | null | undefined): string => {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' 
    ? new Date(parseInt(timestamp)) 
    : new Date(timestamp);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(timestamp);
};

/**
 * Check if a date is overdue
 * @param dueDate - Due date timestamp
 * @param status - Task status
 * @returns true if overdue
 */
export const isOverdue = (dueDate: string | null | undefined, status: string): boolean => {
  if (!dueDate || status === 'Done') return false;
  
  const due = typeof dueDate === 'string' 
    ? new Date(parseInt(dueDate)) 
    : new Date(dueDate);
  
  if (isNaN(due.getTime())) return false;
  
  return due.getTime() < Date.now();
};

/**
 * Format date for input field (YYYY-MM-DD)
 * @param timestamp - Timestamp in milliseconds
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (timestamp: number | string | null | undefined): string => {
  if (!timestamp) return '';
  
  const date = typeof timestamp === 'string' 
    ? new Date(parseInt(timestamp)) 
    : new Date(timestamp);
  
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

