import { z } from 'zod';

// Experience validation schema
export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100),
  company: z.string().min(1, 'Company name is required').max(100),
  location: z.string().min(1, 'Location is required').max(100),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM or YYYY-MM-DD format'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$|^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM or YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  description: z
    .array(
      z
        .string()
        .min(1, 'Description cannot be empty')
        .max(500, 'Description cannot exceed 500 characters')
    )
    .min(1, 'At least one description point is required'),
  skills: z.array(z.string().max(50, 'Skill cannot exceed 50 characters')).optional().default([]),
  isCurrent: z.boolean().optional().default(false),
  order: z.number().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100),
  description: z.string().min(1, 'Description is required').min(10),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  outcomes: z.array(z.string()),
  githubUrl: z
    .string()
    .refine(
      (val) => val === '' || /^https?:\/\/.+/.test(val),
      'Invalid GitHub URL or must be empty'
    ),
  liveUrl: z
    .string()
    .refine((val) => val === '' || /^https?:\/\/.+/.test(val), 'Invalid live URL or must be empty'),
  featured: z.boolean(),
  order: z.number().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Skill Category validation schema
export const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;

// Education validation schema
export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(100),
  institution: z.string().min(1, 'Institution is required').max(100),
  year: z
    .string()
    .min(1, 'Year is required')
    .regex(/^\d{4}$|^\d{4}-\d{4}$/, 'Year must be in YYYY or YYYY-YYYY format'),
  details: z.string().max(500, 'Details cannot exceed 500 characters').optional(),
  order: z.number().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// About validation schema
export const aboutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  summary: z
    .string()
    .min(1, 'Summary is required')
    .max(1000, 'Summary cannot exceed 1000 characters'),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  title: z.string().max(100, 'Title cannot exceed 100 characters').optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url('Must be a valid LinkedIn URL').optional().or(z.literal('')),
      github: z.string().url('Must be a valid GitHub URL').optional().or(z.literal('')),
      twitter: z.string().url('Must be a valid Twitter URL').optional().or(z.literal('')),
      website: z.string().url('Must be a valid website URL').optional().or(z.literal('')),
    })
    .optional(),
  contactInfo: z
    .object({
      email: z.string().email('Must be a valid email').optional().or(z.literal('')),
      phone: z.string().optional().or(z.literal('')),
    })
    .optional(),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
