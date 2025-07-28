import mongoose, { type Schema } from "mongoose"
import type { ExperienceDocument } from "../types"

const experienceSchema: Schema<ExperienceDocument> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a job title"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: String,
      default: "Present",
    },
    description: {
      type: [String],
      required: [true, "Please provide a job description"],
    },
    skills: {
      type: [String],
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

export default mongoose.model<ExperienceDocument>("Experience", experienceSchema)
