import { formatDate, formatDateTime, formatRelativeTime, isOverdue, formatDateForInput } from '../dateFormatter';

describe('dateFormatter', () => {
  const mockTimestamp = 1609459200000; // 2021-01-01 00:00:00 UTC

  describe('formatDate', () => {
    it('formats a valid timestamp', () => {
      const result = formatDate(mockTimestamp);
      expect(result).toMatch(/Jan|January/);
      expect(result).toMatch(/2021/);
    });

    it('handles null input', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('handles undefined input', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });

    it('handles string timestamp', () => {
      const result = formatDate(String(mockTimestamp));
      expect(result).not.toBe('N/A');
    });

    it('handles invalid timestamp', () => {
      expect(formatDate(NaN)).toBe('Invalid Date');
    });
  });

  describe('formatDateTime', () => {
    it('formats a valid timestamp with time', () => {
      const result = formatDateTime(mockTimestamp);
      expect(result).toMatch(/Jan|January/);
    });

    it('handles null input', () => {
      expect(formatDateTime(null)).toBe('N/A');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats recent time as "just now"', () => {
      const recent = Date.now() - 1000; // 1 second ago
      expect(formatRelativeTime(recent)).toBe('just now');
    });

    it('formats minutes ago', () => {
      const minutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes ago
      expect(formatRelativeTime(minutesAgo)).toMatch(/minute/);
    });

    it('handles null input', () => {
      expect(formatRelativeTime(null)).toBe('N/A');
    });
  });

  describe('isOverdue', () => {
    it('returns true for past due date', () => {
      const pastDate = Date.now() - 24 * 60 * 60 * 1000; // 1 day ago
      expect(isOverdue(String(pastDate), 'To-Do')).toBe(true);
    });

    it('returns false for future due date', () => {
      const futureDate = Date.now() + 24 * 60 * 60 * 1000; // 1 day from now
      expect(isOverdue(String(futureDate), 'To-Do')).toBe(false);
    });

    it('returns false for completed tasks', () => {
      const pastDate = Date.now() - 24 * 60 * 60 * 1000;
      expect(isOverdue(String(pastDate), 'Done')).toBe(false);
    });

    it('handles null due date', () => {
      expect(isOverdue(null, 'To-Do')).toBe(false);
    });
  });

  describe('formatDateForInput', () => {
    it('formats date for input field', () => {
      const result = formatDateForInput(mockTimestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
    });

    it('handles null input', () => {
      expect(formatDateForInput(null)).toBe('');
    });
  });
});

