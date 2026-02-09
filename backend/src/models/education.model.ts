import mongoose, { Schema } from 'mongoose';
import { EducationDocument } from '../types';

const EducationSchema: Schema = new Schema(
  {
    degree: {
      type: String,
      required: [true, 'Please add a degree'],
      trim: true,
      maxlength: [100, 'Degree cannot be more than 100 characters'],
    },
    institution: {
      type: String,
      required: [true, 'Please add an institution'],
      trim: true,
      maxlength: [100, 'Institution cannot be more than 100 characters'],
    },
    year: {
      type: String,
      required: [true, 'Please add a year'],
      trim: true,
    },
    details: {
      type: String,
      maxlength: [500, 'Details cannot be more than 500 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
EducationSchema.index({ order: 1 });

export default mongoose.model<EducationDocument>('Education', EducationSchema);
