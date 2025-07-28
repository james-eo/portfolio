import type { Request, Response, NextFunction } from "express"
import About from "../models/about.model"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get about information
// @route   GET /api/about
// @access  Public
export const getAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const about = await About.findOne()

  res.status(200).json({
    success: true,
    data: about || {},
  })
})

// @desc    Create or update about information
// @route   POST /api/about
// @access  Private (Admin)
export const updateAbout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let about = await About.findOne()

  if (about) {
    about = await About.findByIdAndUpdate(about._id, req.body, {
      new: true,
      runValidators: true,
    })
  } else {
    about = await About.create(req.body)
  }

  res.status(200).json({
    success: true,
    data: about,
  })
})
