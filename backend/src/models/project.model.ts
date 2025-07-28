import mongoose, { type Schema } from "mongoose"
import type { ProjectDocument } from "../types"

const projectSchema: Schema<ProjectDocument> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
      trim: true,
    },
    outcomes: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      required: [true, "Please provide technologies used"],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
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

export default mongoose.model<ProjectDocument>("Project", projectSchema)
