import FoodParcel from '../models/FoodParcel.js';
import { getCurrentISTTime } from '../utils/timeValidator.js';
import { format, startOfWeek, endOfWeek } from 'date-fns';

// @desc    Submit food parcel request
// @route   POST /api/food-parcels
// @access  Public
export const submitFoodParcel = async (req, res, next) => {
  try {
    const { studentName, hostelName, registrationNumber, roomNumber, collectorName } = req.body;

    // Validate required fields
    if (!studentName || !hostelName || !registrationNumber || !roomNumber || !collectorName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate hostel name
    const validHostels = ['BH-1', 'BH-2', 'GH-1', 'GH-2', 'GH-3'];
    if (!validHostels.includes(hostelName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hostel name'
      });
    }

    // Get current IST time
    const { date, time } = getCurrentISTTime();

    const foodParcel = await FoodParcel.create({
      studentName: studentName.trim(),
      hostelName,
      registrationNumber: registrationNumber.trim(),
      roomNumber: roomNumber.trim(),
      collectorName: collectorName.trim(),
      submissionDate: date,
      submissionTime: time
    });

    res.status(201).json({
      success: true,
      message: 'Food parcel request submitted successfully',
      data: foodParcel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food parcels with filtering
// @route   GET /api/food-parcels
// @access  Private (Warden/Staff)
export const getFoodParcels = async (req, res, next) => {
  try {
    const { date, search, status, approvalDate, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter by submission date
    if (date) {
      query.submissionDate = date;
    }

    // Filter by approval date
    if (approvalDate) {
      query.approvalDate = approvalDate;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by student name, hostel, or collector
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { hostelName: { $regex: search, $options: 'i' } },
        { collectorName: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const foodParcels = await FoodParcel.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FoodParcel.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foodParcels.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: foodParcels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food parcel
// @route   GET /api/food-parcels/:id
// @access  Private (Warden/Staff)
export const getFoodParcel = async (req, res, next) => {
  try {
    const foodParcel = await FoodParcel.findById(req.params.id);

    if (!foodParcel) {
      return res.status(404).json({
        success: false,
        message: 'Food parcel request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodParcel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve food parcel
// @route   PATCH /api/food-parcels/:id/approve
// @access  Private (Warden)
export const approveFoodParcel = async (req, res, next) => {
  try {
    const { wardenName } = req.body;

    if (!wardenName || wardenName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Warden name is required for approval'
      });
    }

    const foodParcel = await FoodParcel.findById(req.params.id);

    if (!foodParcel) {
      return res.status(404).json({
        success: false,
        message: 'Food parcel request not found'
      });
    }

    if (foodParcel.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been approved'
      });
    }

    // Get current IST time
    const { date, time, fullDateTime } = getCurrentISTTime();

    foodParcel.status = 'Approved';
    foodParcel.approvedBy = wardenName.trim();
    foodParcel.approvedAt = fullDateTime;
    foodParcel.approvalDate = date;
    foodParcel.approvalTime = time;

    await foodParcel.save();

    res.status(200).json({
      success: true,
      message: 'Food parcel approved successfully',
      data: foodParcel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food parcel statistics
// @route   GET /api/food-parcels/stats/summary
// @access  Private (Warden/Staff)
export const getFoodParcelStats = async (req, res, next) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

    const pendingCount = await FoodParcel.countDocuments({ status: 'Pending' });
    
    const approvedTodayCount = await FoodParcel.countDocuments({ 
      status: 'Approved',
      approvalDate: today 
    });
    
    const approvedWeekCount = await FoodParcel.countDocuments({
      status: 'Approved',
      approvalDate: { $gte: weekStart, $lte: weekEnd }
    });

    const approvedTotalCount = await FoodParcel.countDocuments({ status: 'Approved' });

    res.status(200).json({
      success: true,
      data: {
        pending: pendingCount,
        approvedToday: approvedTodayCount,
        approvedWeek: approvedWeekCount,
        approvedTotal: approvedTotalCount
      }
    });
  } catch (error) {
    next(error);
  }
};
