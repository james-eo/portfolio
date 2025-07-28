import type { Request, Response, NextFunction } from "express"
import Education from "../models/education.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
export const getEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const education = await Education.find().sort({ order: 1, year: -1 })

  res.status(200).json({
    success: true,
    count: education.length,
    data: education,
  })
})

// @desc    Get single education entry
// @route   GET /api/education/:id
// @access  Public
export const getEducationById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const education = await Education.findById(req.params.id)

  if (!education) {
    return next(new ErrorResponse(`Education entry not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: education,
  })
})

// @desc    Create new education entry
// @route   POST /api/education
// @access  Private (Admin)
export const createEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const education = await Education.create(req.body)

  res.status(201).json({
    success: true,
    data: education,
  })
})

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private (Admin)
export const updateEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let education = await Education.findById(req.params.id)

  if (!education) {
    return next(new ErrorResponse(`Education entry not found with id of ${req.params.id}`, 404))
  }

  education = await Education.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: education,
  })
})

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private (Admin)
export const deleteEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const education = await Education.findById(req.params.id)

  if (!education) {
    return next(new ErrorResponse(`Education entry not found with id of ${req.params.id}`, 404))
  }

  await education.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
