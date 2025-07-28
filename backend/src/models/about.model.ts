import mongoose, { type Schema } from "mongoose"
import type { AboutDocument } from "../types"

const aboutSchema: Schema<AboutDocument> = new mongoose.Schema(
  {
    summary: {
      type: String,
      required: [true, "Please provide a summary"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
    contactInfo: {
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<AboutDocument>("About", aboutSchema)
