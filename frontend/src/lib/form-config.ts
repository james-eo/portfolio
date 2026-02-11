import { z } from 'zod';

// Validation schemas for backend validation
export const aboutSchema = z.object({
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

export const skillsSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name cannot exceed 50 characters'),
  skills: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Skill name is required')
          .max(50, 'Skill name cannot exceed 50 characters'),
      })
    )
    .min(1, 'At least one skill is required'),
});

export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100, 'Title cannot exceed 100 characters'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company cannot exceed 100 characters'),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
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
  skills: z.array(z.string().max(50, 'Skill cannot exceed 50 characters')).optional(),
  order: z.number().optional(),
});

export const projectsSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  outcomes: z.array(z.string().max(200, 'Outcome cannot exceed 200 characters')).optional(),
  technologies: z
    .array(
      z
        .string()
        .min(1, 'Technology cannot be empty')
        .max(50, 'Technology cannot exceed 50 characters')
    )
    .min(1, 'At least one technology is required'),
  githubUrl: z.string().url('Must be a valid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid video URL').optional().or(z.literal('')),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree cannot exceed 100 characters'),
  institution: z
    .string()
    .min(1, 'Institution is required')
    .max(100, 'Institution cannot exceed 100 characters'),
  year: z
    .string()
    .min(1, 'Year is required')
    .regex(/^\d{4}$|^\d{4}-\d{4}$/, 'Year must be in YYYY or YYYY-YYYY format'),
  details: z.string().max(500, 'Details cannot exceed 500 characters').optional(),
  order: z.number().optional(),
});

// Form field configurations
export const formConfigs = {
  about: {
    title: 'About Information',
    schema: aboutSchema,
    endpoint: '/api/about',
    isSingleton: true,
    fields: [
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'title', label: 'Professional Title', type: 'text' },
      { name: 'socialLinks.linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'socialLinks.github', label: 'GitHub URL', type: 'url' },
      { name: 'socialLinks.twitter', label: 'Twitter URL', type: 'url' },
      { name: 'socialLinks.website', label: 'Website URL', type: 'url' },
      { name: 'contactInfo.email', label: 'Contact Email', type: 'email' },
      { name: 'contactInfo.phone', label: 'Phone Number', type: 'tel' },
    ],
  },
  skills: {
    title: 'Skills',
    schema: skillsSchema,
    endpoint: '/api/skills',
    isSingleton: false,
    fields: [
      { name: 'name', label: 'Category Name', type: 'text', required: true },
      {
        name: 'skills',
        label: 'Skills',
        type: 'array',
        required: true,
        arrayType: 'object',
        arrayFields: [{ name: 'name', label: 'Skill Name', type: 'text', required: true }],
      },
    ],
  },
  experience: {
    title: 'Experience',
    schema: experienceSchema,
    endpoint: '/api/experience',
    isSingleton: false,
    fields: [
      { name: 'title', label: 'Job Title', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'text',
        placeholder: 'YYYY-MM',
        required: true,
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'text',
        placeholder: 'YYYY-MM (leave empty if current)',
      },
      {
        name: 'description',
        label: 'Job Description',
        type: 'array',
        required: true,
        arrayType: 'string',
      },
      { name: 'skills', label: 'Skills Used', type: 'array', arrayType: 'string' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  projects: {
    title: 'Projects',
    schema: projectsSchema,
    endpoint: '/api/projects',
    isSingleton: false,
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'description', label: 'Project Description', type: 'textarea', required: true },
      { name: 'outcomes', label: 'Project Outcomes', type: 'array', arrayType: 'string' },
      {
        name: 'technologies',
        label: 'Technologies Used',
        type: 'array',
        required: true,
        arrayType: 'string',
      },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'liveUrl', label: 'Live Demo URL', type: 'url' },
      { name: 'imageUrl', label: 'Project Image URL', type: 'url' },
      { name: 'videoUrl', label: 'Project Video URL', type: 'url' },
      { name: 'featured', label: 'Featured Project', type: 'checkbox' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
  education: {
    title: 'Education',
    schema: educationSchema,
    endpoint: '/api/education',
    isSingleton: false,
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true },
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      {
        name: 'year',
        label: 'Year',
        type: 'text',
        placeholder: 'YYYY or YYYY-YYYY',
        required: true,
      },
      { name: 'details', label: 'Additional Details', type: 'textarea' },
      { name: 'order', label: 'Display Order', type: 'number' },
    ],
  },
} as const;

export type FormConfigKey = keyof typeof formConfigs;
export type FormConfig = (typeof formConfigs)[FormConfigKey];
