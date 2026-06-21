import { describe, it, expect } from 'vitest';
import { formatFileSize, isValidFileType } from './file';

describe('file utils', () => {
  describe('formatFileSize', () => {
    it('returns "0 Bytes" for 0', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('formats bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });

  describe('isValidFileType', () => {
    it('returns true for accepted image types', () => {
      const validFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
      expect(isValidFileType(validFile)).toBe(true);
    });

    it('returns false for unaccepted types', () => {
      const invalidFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
      expect(isValidFileType(invalidFile)).toBe(false);
    });
  });
});
