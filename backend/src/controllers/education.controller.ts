import type { Request, Response, NextFunction } from 'express';
import Education from '@/models/education.model';
import ErrorResponse from '@/utils/errorResponse';
import asyncHandler from '@/utils/asyncHandler';

// @desc    Get all education
// @route   GET /api/education
// @access  Public
export const getEducation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const education = await Education.find().sort({ order: 1, createdAt: -1 });

    // Check if education records exist
    if (!education || education.length === 0) {
      return next(new ErrorResponse('No education records found', 404));
    }

    res.status(200).json({
      success: true,
      count: education.length,
      data: education,
    });
  }
);

// @desc    Get single education
// @route   GET /api/education/:id
// @access  Public
export const getEducationById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return next(new ErrorResponse(`Education not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: education,
    });
  }
);

// @desc    Create education
// @route   POST /api/education
// @access  Private/Admin
export const createEducation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { degree, institution, year } = req.body;

    // Validate required fields
    if (!degree) {
      return next(new ErrorResponse('Degree is required', 400));
    }

    if (!institution) {
      return next(new ErrorResponse('Institution is required', 400));
    }

    if (!year) {
      return next(new ErrorResponse('Year is required', 400));
    }

    // Validate year format
    const yearRegex = /^\d{4}$|^\d{4}-\d{4}$/;
    if (!yearRegex.test(year)) {
      return next(new ErrorResponse('Year must be in YYYY or YYYY-YYYY format', 400));
    }

    const education = await Education.create(req.body);

    res.status(201).json({
      success: true,
      data: education,
      message: 'Education record created successfully',
    });
  }
);

// @desc    Update education
// @route   PUT /api/education/:id
// @access  Private/Admin
export const updateEducation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { degree, institution, year } = req.body;

    // Validate required fields
    if (!degree) {
      return next(new ErrorResponse('Degree is required', 400));
    }

    if (!institution) {
      return next(new ErrorResponse('Institution is required', 400));
    }

    if (!year) {
      return next(new ErrorResponse('Year is required', 400));
    }

    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return next(new ErrorResponse(`Education not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: education,
      message: 'Education record updated successfully',
    });
  }
);

// @desc    Delete education
// @route   DELETE /api/education/:id
// @access  Private/Admin
export const deleteEducation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return next(new ErrorResponse(`Education not found with id of ${req.params.id}`, 404));
    }

    await education.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Education record deleted successfully',
    });
  }
);
