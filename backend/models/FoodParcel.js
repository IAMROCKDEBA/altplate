import mongoose from 'mongoose';

const foodParcelSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  hostelName: {
    type: String,
    required: [true, 'Hostel name is required'],
    enum: ['BH-1', 'BH-2', 'GH-1', 'GH-2', 'GH-3']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    trim: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  collectorName: {
    type: String,
    required: [true, 'Collector name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  submissionDate: {
    type: String,
    required: true
  },
  submissionTime: {
    type: String,
    required: true
  },
  approvedBy: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvalDate: {
    type: String,
    default: null
  },
  approvalTime: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('FoodParcel', foodParcelSchema);
