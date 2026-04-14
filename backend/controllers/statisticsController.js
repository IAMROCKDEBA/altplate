import PlateChoice from '../models/PlateChoice.js';
import FoodParcel from '../models/FoodParcel.js';
import { format, startOfWeek, endOfWeek } from 'date-fns';

// @desc    Get landing page statistics
// @route   GET /api/statistics/landing
// @access  Public
export const getLandingStats = async (req, res, next) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

    // Count plate choices
    const plateChoicesToday = await PlateChoice.countDocuments({ submissionDate: today });
    const plateChoicesWeek = await PlateChoice.countDocuments({
      submissionDate: { $gte: weekStart, $lte: weekEnd }
    });
    const plateChoicesTotal = await PlateChoice.countDocuments();

    // Count food parcels
    const foodParcelsToday = await FoodParcel.countDocuments({ submissionDate: today });
    const foodParcelsWeek = await FoodParcel.countDocuments({
      submissionDate: { $gte: weekStart, $lte: weekEnd }
    });
    const foodParcelsTotal = await FoodParcel.countDocuments();

    // Calculate totals
    const totalToday = plateChoicesToday + foodParcelsToday;
    const totalWeek = plateChoicesWeek + foodParcelsWeek;
    const totalAll = plateChoicesTotal + foodParcelsTotal;

    res.status(200).json({
      success: true,
      data: {
        today: totalToday,
        week: totalWeek,
        total: totalAll
      }
    });
  } catch (error) {
    next(error);
  }
};
