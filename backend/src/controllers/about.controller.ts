import type { Request, Response, NextFunction } from "express"
import About from "../models/about.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get about info
// @route   GET /api/about
// @access  Public
export const getAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const about = await About.findOne()

  if (!about) {
    return next(new ErrorResponse("About information not found", 404))
  }

  res.status(200).json({
    success: true,
    data: about,
  })
})

// @desc    Create about info
// @route   POST /api/about
// @access  Private/Admin
export const createAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check if about info already exists
  const existingAbout = await About.findOne()
  if (existingAbout) {
    return next(new ErrorResponse("About information already exists. Use PUT to update.", 400))
  }

  // Validate required fields
  const { summary } = req.body
  if (!summary) {
    return next(new ErrorResponse("Summary is required", 400))
  }

  const about = await About.create(req.body)

  res.status(201).json({
    success: true,
    data: about,
  })
})

// @desc    Update about info
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let about = await About.findOne()

  if (!about) {
    // Create if doesn't exist
    about = await About.create(req.body)
  } else {
    // Update existing
    about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    })
  }

  res.status(200).json({
    success: true,
    data: about,
  })
})

// @desc    Delete about info
// @route   DELETE /api/about
// @access  Private/Admin
export const deleteAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const about = await About.findOne()

  if (!about) {
    return next(new ErrorResponse("About information not found", 404))
  }

  await about.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
