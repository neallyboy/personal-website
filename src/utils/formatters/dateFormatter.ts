export function formatDate(date: string): string {
  if (date.toLowerCase() === 'present') return 'Present';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(dateObj);
}

export function getDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}