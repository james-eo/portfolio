import mongoose, { Schema, type Document } from "mongoose";
import type { ProjectDocument } from "../types";

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a project description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    outcomes: [
      {
        type: String,
        maxlength: [200, "Outcome cannot be more than 200 characters"],
      },
    ],
    technologies: [
      {
        type: String,
        required: [true, "Please add at least one technology"],
        trim: true,
        maxlength: [50, "Technology cannot be more than 50 characters"],
      },
    ],
    githubUrl: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?github\.com\/.*$/,
        "Please add a valid GitHub URL",
      ],
    },
    liveUrl: {
      type: String,
      match: [/^https?:\/\/.*$/, "Please add a valid URL"],
    },
    imageUrl: {
      type: String,
      match: [
        /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i,
        "Please add a valid image URL",
      ],
    },
    videoUrl: {
      type: String,
      match: [/^https?:\/\/.*$/, "Please add a valid video URL"],
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
  }
);

// Index for ordering and featured projects
ProjectSchema.index({ order: 1 });
ProjectSchema.index({ featured: -1, order: 1 });

export default mongoose.model<ProjectDocument>("Project", ProjectSchema);
