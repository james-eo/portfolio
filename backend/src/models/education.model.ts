import mongoose, { type Schema } from "mongoose"
import type { EducationDocument } from "../types"

const educationSchema: Schema<EducationDocument> = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, "Please provide a degree"],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, "Please provide an institution"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Please provide a year"],
    },
    details: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<EducationDocument>("Education", educationSchema)
