import type { Request, Response, NextFunction } from "express";
import SkillCategory from "../models/skills.model";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../utils/asyncHandler";

// @desc    Get all skill categories
// @route   GET /api/skills
// @access  Public
export const getSkillCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillCategories = await SkillCategory.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: skillCategories.length,
      data: skillCategories,
    });
  }
);

// @desc    Get single skill category
// @route   GET /api/skills/:id
// @access  Public
export const getSkillCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillCategory = await SkillCategory.findById(req.params.id);

    if (!skillCategory) {
      return next(
        new ErrorResponse(
          `Skill category not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: skillCategory,
    });
  }
);

// @desc    Create skill category
// @route   POST /api/skills
// @access  Private/Admin
export const createSkillCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, skills } = req.body;

    // Validate required fields
    if (!name) {
      return next(new ErrorResponse("Category name is required", 400));
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return next(new ErrorResponse("At least one skill is required", 400));
    }

    // Check if category already exists
    const existingCategory = await SkillCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return next(
        new ErrorResponse("Skill category with this name already exists", 400)
      );
    }

    const skillCategory = await SkillCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: skillCategory,
      message: "Skill category created successfully",
    });
  }
);

// @desc    Update skill category
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkillCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, skills } = req.body;

    // Validate required fields
    if (!name) {
      return next(new ErrorResponse("Category name is required", 400));
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return next(new ErrorResponse("At least one skill is required", 400));
    }

    const skillCategory = await SkillCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skillCategory) {
      return next(
        new ErrorResponse(
          `Skill category not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: skillCategory,
      message: "Skill category updated successfully",
    });
  }
);

// @desc    Delete skill category
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkillCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const skillCategory = await SkillCategory.findById(req.params.id);

    if (!skillCategory) {
      return next(
        new ErrorResponse(
          `Skill category not found with id of ${req.params.id}`,
          404
        )
      );
    }

    await skillCategory.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Skill category deleted successfully",
    });
  }
);
