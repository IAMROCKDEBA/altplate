import XLSX from 'xlsx';
import FoodParcel from '../models/FoodParcel.js';

export const generateExcelReport = async (date) => {
  try {
    // Fetch all approved parcels for the given date
    const parcels = await FoodParcel.find({
      approvalDate: date,
      status: 'Approved'
    }).sort({ approvalTime: 1 });

    // Prepare data for Excel
    const data = parcels.map((parcel, index) => ({
      'Sr. No.': index + 1,
      'Student Name': parcel.studentName,
      'Hostel': parcel.hostelName,
      'Registration Number': parcel.registrationNumber,
      'Room Number': parcel.roomNumber,
      'Collector Name': parcel.collectorName,
      'Submission Date': parcel.submissionDate,
      'Submission Time': parcel.submissionTime,
      'Approved By': parcel.approvedBy,
      'Approval Date': parcel.approvalDate,
      'Approval Time': parcel.approvalTime
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 8 },  // Sr. No.
      { wch: 25 }, // Student Name
      { wch: 10 }, // Hostel
      { wch: 20 }, // Registration Number
      { wch: 12 }, // Room Number
      { wch: 25 }, // Collector Name
      { wch: 15 }, // Submission Date
      { wch: 15 }, // Submission Time
      { wch: 25 }, // Approved By
      { wch: 15 }, // Approval Date
      { wch: 15 }  // Approval Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Food Parcels');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  } catch (error) {
    throw new Error(`Excel generation failed: ${error.message}`);
  }
};
