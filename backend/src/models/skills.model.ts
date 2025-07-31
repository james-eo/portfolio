import mongoose, { Schema, type Document } from "mongoose";
import { SkillCategoryDocument } from "../types";

const SkillSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a skill name"],
    trim: true,
    maxlength: [50, "Skill name cannot be more than 50 characters"],
  },
});

const SkillCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
      maxlength: [50, "Category name cannot be more than 50 characters"],
    },
    skills: [SkillSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SkillCategoryDocument>(
  "SkillCategory",
  SkillCategorySchema
);
