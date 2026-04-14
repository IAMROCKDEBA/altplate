import express from 'express';
import {
  submitFoodParcel,
  getFoodParcels,
  getFoodParcel,
  approveFoodParcel,
  getFoodParcelStats
} from '../controllers/foodParcelController.js';
import { protect, authorize } from '../middleware/auth.js';
import { generateExcelReport } from '../utils/excelGenerator.js';

const router = express.Router();

router.post('/', submitFoodParcel);
router.get('/', protect, authorize('warden', 'staff'), getFoodParcels);
router.get('/stats/summary', protect, authorize('warden', 'staff'), getFoodParcelStats);
router.get('/:id', protect, authorize('warden', 'staff'), getFoodParcel);
router.patch('/:id/approve', protect, authorize('warden'), approveFoodParcel);

// Excel report generation route
router.get('/report/excel', protect, authorize('staff'), async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required for report generation'
      });
    }

    const buffer = await generateExcelReport(date);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=FoodCourt_Report_${date}.xlsx`);
    
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;
