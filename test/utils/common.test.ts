import { stripHtml } from '../../lib/common';

describe('stripHtml', () => {
  it('should strip HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    expect(stripHtml(input)).toBe('Hello World');
  });

  it('should convert newlines to <br>', () => {
    const input = 'Hello\nWorld';
    expect(stripHtml(input)).toBe('Hello<br>World');
  });

  it('should normalize multiple whitespace', () => {
    const input = '<div>Hello    World   </div>';
    expect(stripHtml(input)).toBe('Hello World');
  });

  it('should handle empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});
