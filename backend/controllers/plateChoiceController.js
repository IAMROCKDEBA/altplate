import PlateChoice from '../models/PlateChoice.js';
import { isWithinTimeWindow, getCurrentISTTime } from '../utils/timeValidator.js';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import XLSX from 'xlsx';

// @desc    Submit plate choice
// @route   POST /api/plate-choices
// @access  Public
export const submitPlateChoice = async (req, res, next) => {
  try {
    // Check time window
    if (!isWithinTimeWindow()) {
      return res.status(403).json({
        success: false,
        message: 'Plate choice submissions are only allowed between 8:00 PM and 10:30 PM IST'
      });
    }

    const { studentName, selections } = req.body;

    // Validate student name
    if (!studentName || studentName.trim().length < 2 || studentName.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Student name must be between 2 and 100 characters'
      });
    }

    // Validate at least one selection
    const hasSelection = 
      selections.aluChokha?.isSelected ||
      selections.aluBhaja ||
      selections.bread?.isSelected ||
      selections.suji ||
      selections.pureVeg ||
      selections.doiChire?.isSelected;

    if (!hasSelection) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one food option'
      });
    }

    // Get current IST time
    const { date, time } = getCurrentISTTime();

    const plateChoice = await PlateChoice.create({
      studentName: studentName.trim(),
      selections,
      submissionDate: date,
      submissionTime: time
    });

    res.status(201).json({
      success: true,
      message: 'Plate choice submitted successfully',
      data: plateChoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all plate choices with filtering
// @route   GET /api/plate-choices
// @access  Private (Staff)
export const getPlateChoices = async (req, res, next) => {
  try {
    const { date, search, foodOption, mealTime, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter by date
    if (date) {
      query.submissionDate = date;
    }

    // Search by student name
    if (search) {
      query.studentName = { $regex: search, $options: 'i' };
    }

    // Filter by food option
    if (foodOption && foodOption !== 'All') {
      switch (foodOption) {
        case 'Alu Chokha':
          query['selections.aluChokha.isSelected'] = true;
          break;
        case 'Alu Bhaja':
          query['selections.aluBhaja'] = true;
          break;
        case 'Bread':
          query['selections.bread.isSelected'] = true;
          break;
        case 'Suji':
          query['selections.suji'] = true;
          break;
        case 'Pure Veg':
          query['selections.pureVeg'] = true;
          break;
        case 'Doi Chire':
          query['selections.doiChire.isSelected'] = true;
          break;
      }
    }

    // Filter by meal time
    if (mealTime && mealTime !== 'All') {
      query.$or = [
        { 'selections.aluChokha.mealTimes': mealTime },
        { 'selections.bread.mealTimes': mealTime },
        { 'selections.doiChire.mealTimes': mealTime }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const plateChoices = await PlateChoice.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PlateChoice.countDocuments(query);

    res.status(200).json({
      success: true,
      count: plateChoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: plateChoices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plate choice
// @route   GET /api/plate-choices/:id
// @access  Private (Staff)
export const getPlateChoice = async (req, res, next) => {
  try {
    const plateChoice = await PlateChoice.findById(req.params.id);

    if (!plateChoice) {
      return res.status(404).json({
        success: false,
        message: 'Plate choice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plateChoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get plate choice statistics
// @route   GET /api/plate-choices/stats/summary
// @access  Private (Staff)
export const getPlateChoiceStats = async (req, res, next) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

    const todayCount = await PlateChoice.countDocuments({ submissionDate: today });
    
    const weekCount = await PlateChoice.countDocuments({
      submissionDate: { $gte: weekStart, $lte: weekEnd }
    });

    const totalCount = await PlateChoice.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        today: todayCount,
        week: weekCount,
        total: totalCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Plate Choice Excel Report
// @route   GET /api/plate-choices/report
// @access  Private (Staff)
export const generatePlateChoiceReport = async (req, res, next) => {
  try {
    const { date } = req.query;

    // Validate date parameter
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required for report generation'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Fetch all plate choices for the specified date
    const plateChoices = await PlateChoice.find({
      submissionDate: date
    }).sort({ submissionTime: 1 });

    // Check if data exists
    if (plateChoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No plate choices found for ${date}`
      });
    }

    // Transform data for Excel
    const excelData = plateChoices.map((choice) => {
      // Format Alu Chokha
      const aluChokha = choice.selections.aluChokha?.isSelected
        ? choice.selections.aluChokha.mealTimes.join(', ')
        : '-';

      // Format Alu Bhaja
      const aluBhaja = choice.selections.aluBhaja ? 'Yes' : '-';

      // Format Bread
      let bread = '-';
      if (choice.selections.bread?.isSelected) {
        const mealTimes = choice.selections.bread.mealTimes.join(', ');
        const breadTypes = choice.selections.bread.breadTypes.join(', ');
        bread = `${mealTimes} (${breadTypes})`;
      }

      // Format Suji
      const suji = choice.selections.suji ? 'Yes' : '-';

      // Format Pure Veg
      const pureVeg = choice.selections.pureVeg ? 'Yes' : '-';

      // Format Doi Chire
      const doiChire = choice.selections.doiChire?.isSelected
        ? choice.selections.doiChire.mealTimes.join(', ')
        : '-';

      // Format submission time (assuming it's in HH:mm format, convert to 12-hour)
      const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      return {
        'Student Name': choice.studentName,
        'Alu Chokha': aluChokha,
        'Alu Bhaja': aluBhaja,
        'Bread': bread,
        'Suji': suji,
        'Pure Veg': pureVeg,
        'Doi Chire': doiChire,
        'Submission Time': formatTime(choice.submissionTime)
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Create header rows
    const headerRow1 = [['Adamas University | Food Court | Plate Choice Report']];
    const headerRow2 = [[`Report Generated: ${format(new Date(), 'MMMM dd, yyyy - hh:mm a')}`]];
    const headerRow3 = [[`Report Date: ${format(new Date(date), 'MMMM dd, yyyy')}`]];
    const blankRow = [['']];

    // Convert data to worksheet format
    const ws = XLSX.utils.aoa_to_sheet(headerRow1);
    XLSX.utils.sheet_add_aoa(ws, headerRow2, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, headerRow3, { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, blankRow, { origin: 'A4' });
    XLSX.utils.sheet_add_json(ws, excelData, { origin: 'A5', skipHeader: false });

    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // Student Name
      { wch: 20 }, // Alu Chokha
      { wch: 12 }, // Alu Bhaja
      { wch: 30 }, // Bread
      { wch: 10 }, // Suji
      { wch: 12 }, // Pure Veg
      { wch: 20 }, // Doi Chire
      { wch: 18 }  // Submission Time
    ];
    ws['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, 'Plate Choices');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=PlateChoice_Report_${date}.xlsx`);
    
    // Send file
    res.send(buffer);

  } catch (error) {
    console.error('Error generating plate choice report:', error);
    next(error);
  }
};
