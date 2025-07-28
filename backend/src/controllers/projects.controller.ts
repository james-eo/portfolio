import type { Request, Response, NextFunction } from "express"
import Project from "../models/project.model"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Add filtering capability
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Project.find(JSON.parse(queryStr))

  // Select Fields
  if (req.query.select) {
    const fields = (req.query.select as string).split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-featured order -createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page as string, 10) || 1
  const limit = Number.parseInt(req.query.limit as string, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Project.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const projects = await query

  // Pagination result
  const pagination: any = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: projects.length,
    pagination,
    data: projects,
  })
})

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: project,
  })
})

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.create(req.body)

  res.status(201).json({
    success: true,
    data: project,
  })
})

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: project,
  })
})

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  await project.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
