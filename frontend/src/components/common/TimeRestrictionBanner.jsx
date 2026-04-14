import { isWithinTimeWindow } from '../../utils/timeUtils';

const TimeRestrictionBanner = () => {
  const isAllowed = isWithinTimeWindow();

  if (isAllowed) return null;

  return (
    <div className="glass-card border-2 border-red-300 p-6 mb-6 animate-slideUp">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-2">Form Currently Unavailable</h3>
          <p className="text-gray-700 mb-2">
            Plate choice submissions are only allowed between <span className="font-bold">8:00 PM and 10:30 PM IST</span>.
          </p>
          <p className="text-gray-600 text-sm">
            Please return during the allowed time window to submit your plate choice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeRestrictionBanner;
