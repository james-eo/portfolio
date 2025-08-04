import type { Request, Response, NextFunction } from "express";
import Experience from "../models/experience.model";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../utils/asyncHandler";

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experiences = await Experience.find().sort({
      order: 1,
      createdAt: -1,
    });

    if (!experiences || experiences.length === 0) {
      return next(new ErrorResponse("No experiences found", 404));
    }

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  }
);

// @desc    Get single experience
// @route   GET /api/experience/:id
// @access  Public
export const getExperienceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(
        new ErrorResponse(
          `Experience not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  }
);

// @desc    Create experience
// @route   POST /api/experience
// @access  Private/Admin
export const createExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, company, startDate, description } = req.body;

    // Validate required fields
    if (!title) {
      return next(new ErrorResponse("Job title is required", 400));
    }

    if (!company) {
      return next(new ErrorResponse("Company name is required", 400));
    }

    if (!startDate) {
      return next(new ErrorResponse("Start date is required", 400));
    }

    if (
      !description ||
      !Array.isArray(description) ||
      description.length === 0
    ) {
      return next(
        new ErrorResponse("At least one description point is required", 400)
      );
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      return next(
        new ErrorResponse(
          "Start date must be in YYYY-MM or YYYY-MM-DD format",
          400
        )
      );
    }

    if (req.body.endDate && !dateRegex.test(req.body.endDate)) {
      return next(
        new ErrorResponse(
          "End date must be in YYYY-MM or YYYY-MM-DD format",
          400
        )
      );
    }

    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      data: experience,
    });
  }
);

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
export const updateExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, company, startDate, description } = req.body;

    // Validate required fields
    if (!title) {
      return next(new ErrorResponse("Job title is required", 400));
    }

    if (!company) {
      return next(new ErrorResponse("Company name is required", 400));
    }

    if (!startDate) {
      return next(new ErrorResponse("Start date is required", 400));
    }

    if (
      !description ||
      !Array.isArray(description) ||
      description.length === 0
    ) {
      return next(
        new ErrorResponse("At least one description point is required", 400)
      );
    }

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return next(
        new ErrorResponse(
          `Experience not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: experience,
      message: "Experience updated successfully",
    });
  }
);

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private/Admin
export const deleteExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(
        new ErrorResponse(
          `Experience not found with id of ${req.params.id}`,
          404
        )
      );
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Experience deleted successfully",
    });
  }
);
