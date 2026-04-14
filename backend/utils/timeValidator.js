import { format, parse, isWithinInterval } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const isWithinTimeWindow = () => {
  const timezone = 'Asia/Kolkata';
  const now = toZonedTime(new Date(), timezone);
  
  const currentTime = format(now, 'HH:mm');
  const startTime = '11:00'; // 8:00 PM
  const endTime = '22:30'; // 10:30 PM

  const currentDate = format(now, 'yyyy-MM-dd');
  
  const start = parse(`${currentDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const end = parse(`${currentDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const current = parse(`${currentDate} ${currentTime}`, 'yyyy-MM-dd HH:mm', new Date());

  return isWithinInterval(current, { start, end });
};

export const getCurrentISTTime = () => {
  const timezone = 'Asia/Kolkata';
  const now = toZonedTime(new Date(), timezone);
  
  return {
    date: format(now, 'yyyy-MM-dd'),
    time: format(now, 'HH:mm'),
    fullDateTime: now
  };
};
