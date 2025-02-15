export function stripHtml(html: string): string {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  return (div.textContent || div.innerText || '')
    .replace(/\n/g, '<br>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getS3PublicUrl(path: string): string {
  return `https://${process.env.NEXT_PUBLIC_S3URL}/${path}`;
}