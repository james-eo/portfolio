import type { Request, Response, NextFunction } from "express"
import SkillCategory from "../models/skills.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get all skill categories
// @route   GET /api/skills
// @access  Public
export const getSkillCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const skillCategories = await SkillCategory.find()

  res.status(200).json({
    success: true,
    count: skillCategories.length,
    data: skillCategories,
  })
})

// @desc    Get single skill category
// @route   GET /api/skills/:id
// @access  Public
export const getSkillCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const skillCategory = await SkillCategory.findById(req.params.id)

  if (!skillCategory) {
    return next(new ErrorResponse(`Skill category not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: skillCategory,
  })
})

// @desc    Create new skill category
// @route   POST /api/skills
// @access  Private (Admin)
export const createSkillCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const skillCategory = await SkillCategory.create(req.body)

  res.status(201).json({
    success: true,
    data: skillCategory,
  })
})

// @desc    Update skill category
// @route   PUT /api/skills/:id
// @access  Private (Admin)
export const updateSkillCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let skillCategory = await SkillCategory.findById(req.params.id)

  if (!skillCategory) {
    return next(new ErrorResponse(`Skill category not found with id of ${req.params.id}`, 404))
  }

  skillCategory = await SkillCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: skillCategory,
  })
})

// @desc    Delete skill category
// @route   DELETE /api/skills/:id
// @access  Private (Admin)
export const deleteSkillCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const skillCategory = await SkillCategory.findById(req.params.id)

  if (!skillCategory) {
    return next(new ErrorResponse(`Skill category not found with id of ${req.params.id}`, 404))
  }

  await skillCategory.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
