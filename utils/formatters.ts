
import { format, formatDistanceToNow } from 'date-fns';
import { ErrorType } from '../types';

export const formatDate = (date: Date | any): string => {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date));
  return format(d, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: Date | any): string => {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date));
  return formatDistanceToNow(d, { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const getErrorTypeBadgeColor = (errorType: string): string => {
  switch (errorType) {
    case ErrorType.CELERY:
      return 'bg-red-100 text-red-800 border-red-200';
    case ErrorType.LOAN:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case ErrorType.INSTALLMENTS:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ErrorType.SYSTEM:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};
