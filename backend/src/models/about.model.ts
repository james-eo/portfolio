import mongoose, { Schema, type Document } from "mongoose";
import { AboutDocument } from "../types";

const AboutSchema: Schema = new Schema(
  {
    summary: {
      type: String,
      required: [true, "Please add a summary"],
      maxlength: [1000, "Summary cannot be more than 1000 characters"],
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot be more than 100 characters"],
    },
    title: {
      type: String,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    socialLinks: {
      linkedin: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
          "Please add a valid LinkedIn URL",
        ],
      },
      github: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?github\.com\/.*$/,
          "Please add a valid GitHub URL",
        ],
      },
      twitter: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?twitter\.com\/.*$/,
          "Please add a valid Twitter URL",
        ],
      },
      website: {
        type: String,
        match: [/^https?:\/\/.*$/, "Please add a valid website URL"],
      },
    },
    contactInfo: {
      email: {
        type: String,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      phone: {
        type: String,
        match: [/^[+]?[1-9][\d]{0,15}$/, "Please add a valid phone number"],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AboutDocument>("About", AboutSchema);
