import type { Request, Response, NextFunction } from "express"
import Experience from "../models/experience.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const experiences = await Experience.find().sort({ order: 1, startDate: -1 })

  res.status(200).json({
    success: true,
    count: experiences.length,
    data: experiences,
  })
})

// @desc    Get single experience
// @route   GET /api/experience/:id
// @access  Public
export const getExperience = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const experience = await Experience.findById(req.params.id)

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: experience,
  })
})

// @desc    Create new experience
// @route   POST /api/experience
// @access  Private (Admin)
export const createExperience = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const experience = await Experience.create(req.body)

  res.status(201).json({
    success: true,
    data: experience,
  })
})

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private (Admin)
export const updateExperience = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let experience = await Experience.findById(req.params.id)

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404))
  }

  experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: experience,
  })
})

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private (Admin)
export const deleteExperience = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const experience = await Experience.findById(req.params.id)

  if (!experience) {
    return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404))
  }

  await experience.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
