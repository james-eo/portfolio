import mongoose, { Schema, type Document } from "mongoose";
import type { ExperienceDocument } from "../types";

const ExperienceSchema: Schema<ExperienceDocument> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a job title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Please add a company name"],
      trim: true,
      maxlength: [100, "Company name cannot be more than 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot be more than 100 characters"],
    },
    startDate: {
      type: String,
      required: [true, "Please add a start date"],
    },
    endDate: {
      type: String,
    },
    description: [
      {
        type: String,
        required: [true, "Please add at least one description point"],
        maxlength: [
          500,
          "Description point cannot be more than 500 characters",
        ],
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Skill cannot be more than 50 characters"],
      },
    ],
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
ExperienceSchema.index({ order: 1 });

export default mongoose.model<ExperienceDocument>(
  "Experience",
  ExperienceSchema
);
