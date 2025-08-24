import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTimestamp(timestamp: string): Date {
  // Handle DD/MM/YYYY HH:mm:ss format
  if (timestamp.includes('/')) {
    const [datePart, timePart] = timestamp.split(' ');
    const [day, month, year] = datePart.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return new Date(`${formattedDate}${timePart ? ' ' + timePart : ''}`);
  }
  // Fallback to default parsing
  return new Date(timestamp);
}

export function formatTimestamp(timestamp: string): string {
  const date = parseTimestamp(timestamp);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatTime(timestamp: string): string {
  const date = parseTimestamp(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
