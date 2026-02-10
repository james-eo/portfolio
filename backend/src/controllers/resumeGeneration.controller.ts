import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';

import ResumeGeneration from '@/models/resumeGeneration.model';
import ResumeTemplate from '@/models/resumeTemplate.model';
import Experience from '@/models/experience.model';
import Education from '@/models/education.model';
import SkillCategory from '@/models/skills.model';
import Project from '@/models/project.model';
import About from '@/models/about.model';
import ErrorResponse from '@/utils/errorResponse';
import asyncHandler from '@/utils/asyncHandler';
import { buildResumeHtml, renderPdf } from './resume.controller';

// @desc    Generate resume from current portfolio data
// @route   POST /api/resume/generate
// @access  Public (auth optional; user attached when available)
export const generateResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { templateId, customizations } = req.body;

    if (!templateId) {
      return next(new ErrorResponse('Template ID is required', 400));
    }

    const template = await ResumeTemplate.findById(templateId);
    if (!template || !template.isActive) {
      return next(new ErrorResponse('Template not found or inactive', 404));
    }

    const [about, experience, education, skills, projects] = await Promise.all([
      About.findOne(),
      Experience.find().sort({ order: 1, createdAt: -1 }),
      Education.find().sort({ createdAt: -1 }),
      SkillCategory.find().sort({ createdAt: 1 }),
      Project.find().sort({ order: 1, createdAt: -1 }),
    ]);

    const generationData = {
      personalInfo: {
        name: about?.name || 'Your Name',
        title: about?.title || 'Professional Title',
        email: about?.contactInfo?.email || 'email@example.com',
        phone: about?.contactInfo?.phone || '',
        location: about?.location || '',
        linkedin: about?.socialLinks?.linkedin || '',
        github: about?.socialLinks?.github || '',
        website: about?.socialLinks?.website || '',
      },
      summary: about?.summary || '',
      experience: experience || [],
      education: education || [],
      skills: skills || [],
      projects: projects || [],
    };

    const resumeGeneration = await ResumeGeneration.create({
      userId: req.user?._id,
      templateId,
      sessionId: req.user ? undefined : (req as Request & { sessionID?: string }).sessionID,
      generationData,
      customizations: customizations || {},
      status: 'pending',
    });

    try {
      const html = buildResumeHtml(template.category, {
        about,
        skills,
        experience,
        projects,
        education,
      });

      const pdfBuffer = await renderPdf(html);

      const fileName = `resume-${resumeGeneration._id}.pdf`;
      const filePath = path.join(process.cwd(), 'uploads', 'resumes', fileName);

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, pdfBuffer);

      resumeGeneration.status = 'generated';
      resumeGeneration.fileUrl = `/uploads/resumes/${fileName}`;
      resumeGeneration.fileSize = pdfBuffer.length;
      await resumeGeneration.save();

      template.downloadCount += 1;
      await template.save();

      res.status(201).json({
        success: true,
        data: {
          id: resumeGeneration._id,
          downloadUrl: `/api/resume/download/${resumeGeneration._id}`,
          previewUrl: `/api/resume/preview/${resumeGeneration._id}`,
          expiresAt: resumeGeneration.expiresAt,
        },
      });
    } catch (error) {
      resumeGeneration.status = 'failed';
      resumeGeneration.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await resumeGeneration.save();
      console.error('Resume generation error:', error);
      return next(new ErrorResponse('Failed to generate resume', 500));
    }
  }
);

// @desc    Download generated resume
// @route   GET /api/resume/download/:id
// @access  Public
export const downloadResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumeGeneration = await ResumeGeneration.findById(req.params.id);

    if (!resumeGeneration) {
      return next(new ErrorResponse('Resume not found', 404));
    }

    if (resumeGeneration.status !== 'generated' || !resumeGeneration.fileUrl) {
      return next(new ErrorResponse('Resume is not ready for download', 400));
    }

    const filePath = path.join(process.cwd(), resumeGeneration.fileUrl);
    try {
      const fileBuffer = await fs.readFile(filePath);

      resumeGeneration.downloadedAt = new Date();
      await resumeGeneration.save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="resume-${resumeGeneration._id}.pdf"`
      );
      res.setHeader('Content-Length', fileBuffer.length);
      res.send(fileBuffer);
    } catch (error) {
      console.error('File download error:', error);
      return next(new ErrorResponse('Failed to download resume', 500));
    }
  }
);

// @desc    Preview generated resume
// @route   GET /api/resume/preview/:id
// @access  Public
export const previewResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumeGeneration = await ResumeGeneration.findById(req.params.id);

    if (!resumeGeneration) {
      return next(new ErrorResponse('Resume not found', 404));
    }

    if (resumeGeneration.status !== 'generated' || !resumeGeneration.fileUrl) {
      return next(new ErrorResponse('Resume is not ready for preview', 400));
    }

    const filePath = path.join(process.cwd(), resumeGeneration.fileUrl);
    try {
      const fileBuffer = await fs.readFile(filePath);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="resume-preview-${resumeGeneration._id}.pdf"`
      );
      res.setHeader('Content-Length', fileBuffer.length);

      res.send(fileBuffer);
    } catch (error) {
      console.error('File preview error:', error);
      return next(new ErrorResponse('Failed to preview resume', 500));
    }
  }
);

// @desc    Get resume generations for current user/session
// @route   GET /api/resume/generations
// @access  Private (user) / Session-based fallback
export const getUserResumeGenerations = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.user?._id) {
    filter.userId = req.user._id;
  } else if ((req as Request & { sessionID?: string }).sessionID) {
    filter.sessionId = (req as Request & { sessionID?: string }).sessionID;
  }

  const generations = await ResumeGeneration.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: generations.length,
    data: generations,
  });
});

// @desc    Delete a generated resume and its file
// @route   DELETE /api/resume/generations/:id
// @access  Private (user) / Session-based fallback
export const deleteResumeGeneration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const generation = await ResumeGeneration.findById(req.params.id);

    if (!generation) {
      return next(new ErrorResponse('Resume generation not found', 404));
    }

    const sessionId = (req as Request & { sessionID?: string }).sessionID;
    const ownsRecord =
      req.user?._id?.equals(generation.userId || '') || sessionId === generation.sessionId;

    if (!ownsRecord) {
      return next(new ErrorResponse('Not authorized to delete this resume', 403));
    }

    if (generation.fileUrl) {
      const filePath = path.join(process.cwd(), generation.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore file delete errors
      }
    }

    await generation.deleteOne();

    res.status(200).json({ success: true, data: {} });
  }
);
