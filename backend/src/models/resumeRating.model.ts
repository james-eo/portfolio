import mongoose, { Schema, type Document } from 'mongoose';

export interface IResumeRating {
  templateId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  rating: number;
  review?: string;
  helpful: number;
  reported: boolean;
}

export interface ResumeRatingDocument extends IResumeRating, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ResumeRatingSchema: Schema = new Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeTemplate',
      required: [true, 'Template ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      trim: true,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    reported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
ResumeRatingSchema.index({ templateId: 1, userId: 1 }, { unique: true, sparse: true });
ResumeRatingSchema.index({ templateId: 1, sessionId: 1 }, { unique: true, sparse: true });
ResumeRatingSchema.index({ templateId: 1, createdAt: -1 });

export default mongoose.model<ResumeRatingDocument>('ResumeRating', ResumeRatingSchema);
