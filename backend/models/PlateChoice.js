import mongoose from 'mongoose';

const plateChoiceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  selections: {
    aluChokha: {
      isSelected: { type: Boolean, default: false },
      mealTimes: [{ type: String, enum: ['Lunch', 'Dinner'] }]
    },
    aluBhaja: {
      type: Boolean,
      default: false
    },
    bread: {
      isSelected: { type: Boolean, default: false },
      mealTimes: [{ type: String, enum: ['Breakfast', 'Snacks'] }],
      breadTypes: [{ type: String, enum: ['BB', 'WB'] }]
    },
    suji: {
      type: Boolean,
      default: false
    },
    pureVeg: {
      type: Boolean,
      default: false
    },
    doiChire: {
      isSelected: { type: Boolean, default: false },
      mealTimes: [{ type: String, enum: ['Breakfast', 'Snacks'] }]
    }
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
  }
}, {
  timestamps: true
});

export default mongoose.model('PlateChoice', plateChoiceSchema);
