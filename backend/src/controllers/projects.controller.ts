import type { Request, Response, NextFunction } from "express";
import Project from "../models/project.model";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../utils/asyncHandler";

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { featured } = req.query;

    let query = {};
    if (featured === "true") {
      query = { featured: true };
    }

    const projects = await Project.find(query).sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    });

    if (!projects || projects.length === 0) {
      return next(new ErrorResponse("No projects found", 404));
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  }
);

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(
        new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, technologies } = req.body;

    // Validate required fields
    if (!title) {
      return next(new ErrorResponse("Project title is required", 400));
    }

    if (!description) {
      return next(new ErrorResponse("Project description is required", 400));
    }

    if (
      !technologies ||
      !Array.isArray(technologies) ||
      technologies.length === 0
    ) {
      return next(
        new ErrorResponse("At least one technology is required", 400)
      );
    }

    // Validate URLs if provided
    const urlRegex = /^https?:\/\/.+/;
    if (req.body.githubUrl && !urlRegex.test(req.body.githubUrl)) {
      return next(
        new ErrorResponse(
          "GitHub URL must be a valid URL starting with http:// or https://",
          400
        )
      );
    }

    if (req.body.liveUrl && !urlRegex.test(req.body.liveUrl)) {
      return next(
        new ErrorResponse(
          "Live URL must be a valid URL starting with http:// or https://",
          400
        )
      );
    }

    if (req.body.imageUrl && !urlRegex.test(req.body.imageUrl)) {
      return next(
        new ErrorResponse(
          "Image URL must be a valid URL starting with http:// or https://",
          400
        )
      );
    }

    if (req.body.videoUrl && !urlRegex.test(req.body.videoUrl)) {
      return next(
        new ErrorResponse(
          "Video URL must be a valid URL starting with http:// or https://",
          400
        )
      );
    }

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
      message: "Project created successfully",
    });
  }
);

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, technologies } = req.body;

    // Validate required fields
    if (!title) {
      return next(new ErrorResponse("Project title is required", 400));
    }

    if (!description) {
      return next(new ErrorResponse("Project description is required", 400));
    }

    if (
      !technologies ||
      !Array.isArray(technologies) ||
      technologies.length === 0
    ) {
      return next(
        new ErrorResponse("At least one technology is required", 400)
      );
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return next(
        new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      message: "Project updated successfully",
      success: true,
      data: project,
    });
  }
);

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(
        new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
      );
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Project deleted successfully",
    });
  }
);
