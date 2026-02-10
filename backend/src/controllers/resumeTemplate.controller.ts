import type { Request, Response, NextFunction } from 'express';
import ResumeTemplate from '../models/resumeTemplate.model';
import ResumeRating from '../models/resumeRating.model';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../utils/asyncHandler';

// @desc    Get all resume templates
// @route   GET /api/resume/templates
// @access  Public
export const getResumeTemplates = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    tags,
    sort = '-rating.average',
    page = 1,
    limit = 10,
    search,
    active = 'true',
  } = req.query;

  // Build query
  const query: Record<string, unknown> = {};

  if (active === 'true') {
    query.isActive = true;
  }

  if (category) {
    query.category = category;
  }

  if (tags) {
    const tagArray = (tags as string).split(',').map((tag) => tag.trim());
    query.tags = { $in: tagArray };
  }

  if (search) {
    query.$or = [
      { displayName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const pageNum = Number.parseInt(page as string, 10);
  const limitNum = Number.parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const templates = await ResumeTemplate.find(query)
    .populate('createdBy', 'name email')
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await ResumeTemplate.countDocuments(query);

  res.status(200).json({
    success: true,
    count: templates.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
    data: templates,
  });
});

// @desc    Get single resume template
// @route   GET /api/resume/templates/:id
// @access  Public
export const getResumeTemplate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const template = await ResumeTemplate.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!template) {
      return next(new ErrorResponse(`Template not found with id of ${req.params.id}`, 404));
    }

    if (!template.isActive && (!req.user || req.user.role !== 'admin')) {
      return next(new ErrorResponse('Template is not available', 403));
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  }
);

// @desc    Create resume template
// @route   POST /api/resume/templates
// @access  Private (Admin)
export const createResumeTemplate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to create templates', 403));
    }

    // Add created by user
    req.body.createdBy = req.user._id;

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await ResumeTemplate.updateMany({ category: req.body.category }, { isDefault: false });
    }

    const template = await ResumeTemplate.create(req.body);

    res.status(201).json({
      success: true,
      data: template,
    });
  }
);

// @desc    Update resume template
// @route   PUT /api/resume/templates/:id
// @access  Private (Admin)
export const updateResumeTemplate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update templates', 403));
    }

    let template = await ResumeTemplate.findById(req.params.id);

    if (!template) {
      return next(new ErrorResponse(`Template not found with id of ${req.params.id}`, 404));
    }

    // If this is set as default, unset other defaults
    if (req.body.isDefault && !template.isDefault) {
      await ResumeTemplate.updateMany(
        { category: req.body.category || template.category, _id: { $ne: template._id } },
        { isDefault: false }
      );
    }

    template = await ResumeTemplate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: template,
    });
  }
);

// @desc    Delete resume template
// @route   DELETE /api/resume/templates/:id
// @access  Private (Admin)
export const deleteResumeTemplate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete templates', 403));
    }

    const template = await ResumeTemplate.findById(req.params.id);

    if (!template) {
      return next(new ErrorResponse(`Template not found with id of ${req.params.id}`, 404));
    }

    // Soft delete by setting isActive to false
    template.isActive = false;
    await template.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Rate resume template
// @route   POST /api/resume/templates/:id/rate
// @access  Public
export const rateResumeTemplate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rating, review } = req.body;
    const templateId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorResponse('Rating must be between 1 and 5', 400));
    }

    const template = await ResumeTemplate.findById(templateId);
    if (!template) {
      return next(new ErrorResponse(`Template not found with id of ${templateId}`, 404));
    }

    // Check if user/session already rated this template
    const existingRating = await ResumeRating.findOne({
      templateId,
      $or: [
        { userId: req.user?._id },
        { sessionId: (req as Request & { sessionID?: string }).sessionID },
      ],
    });

    let ratingDoc;
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      ratingDoc = await existingRating.save();
    } else {
      // Create new rating
      ratingDoc = await ResumeRating.create({
        templateId,
        userId: req.user?._id,
        sessionId: req.user ? undefined : (req as Request & { sessionID?: string }).sessionID,
        rating,
        review,
      });
    }

    // Recalculate template rating
    const ratings = await ResumeRating.find({ templateId });
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    template.rating = {
      average: Math.round(averageRating * 10) / 10,
      count: ratings.length,
    };
    await template.save();

    res.status(200).json({
      success: true,
      data: ratingDoc,
    });
  }
);

// @desc    Get template ratings
// @route   GET /api/resume/templates/:id/ratings
// @access  Public
export const getTemplateRatings = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const pageNum = Number.parseInt(page as string, 10);
  const limitNum = Number.parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const ratings = await ResumeRating.find({
    templateId: req.params.id,
    reported: false,
  })
    .populate('userId', 'name')
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await ResumeRating.countDocuments({
    templateId: req.params.id,
    reported: false,
  });

  res.status(200).json({
    success: true,
    count: ratings.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
    data: ratings,
  });
});

// @desc    Increment template download count
// @route   POST /api/resume/templates/:id/download
// @access  Public
export const incrementDownloadCount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const template = await ResumeTemplate.findById(req.params.id);

    if (!template) {
      return next(new ErrorResponse(`Template not found with id of ${req.params.id}`, 404));
    }

    template.downloadCount += 1;
    await template.save();

    res.status(200).json({
      success: true,
      data: { downloadCount: template.downloadCount },
    });
  }
);
