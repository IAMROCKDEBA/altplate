import { format, parse } from 'date-fns';

export const isWithinTimeWindow = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;
  
  const startTime = 11 * 60; // 8:00 PM = 1200 minutes
  const endTime = 22 * 60 + 30; // 10:30 PM = 1350 minutes
  
  return currentTime >= startTime && currentTime <= endTime;
};

export const formatTime = (date) => {
  return format(new Date(date), 'h:mm a');
};

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy - h:mm a');
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};

export const getCurrentTime = () => {
  return format(new Date(), 'h:mm:ss a');
};

export const getCurrentDate = () => {
  return format(new Date(), 'EEEE, MMMM dd, yyyy');
};
