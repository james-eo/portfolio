import mongoose, { type Schema } from "mongoose"
import type { ISkill, SkillCategoryDocument } from "../types"

const skillSchema: Schema<ISkill> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a skill name"],
    trim: true,
  },
})

const skillCategorySchema: Schema<SkillCategoryDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
    },
    skills: [skillSchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<SkillCategoryDocument>("SkillCategory", skillCategorySchema)
