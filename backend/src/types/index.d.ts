import type { Document } from "mongoose";
import type mongoose from "mongoose";

// Extend Express Request to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// User interfaces
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface UserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

// About interfaces
export interface IAbout {
  summary: string;
  location?: string;
  title?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface AboutDocument extends IAbout, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Skill interfaces
export interface ISkill {
  name: string;
}

export interface ISkillCategory {
  name: string;
  skills: ISkill[];
}

export interface SkillCategoryDocument extends ISkillCategory, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Experience interfaces
export interface IExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string[];
  skills?: string[];
  order?: number;
}

export interface ExperienceDocument extends IExperience, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Project interfaces
export interface IProject {
  title: string;
  description: string;
  outcomes?: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface ProjectDocument extends IProject, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Education interfaces
export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  details?: string;
  order?: number;
}

export interface EducationDocument extends IEducation, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Contact interfaces
export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
}

export interface ContactDocument extends IContact, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Resume Template interfaces
export interface IResumeTemplate {
  name: string;
  displayName: string;
  description: string;
  category:
    | "modern"
    | "professional"
    | "creative"
    | "minimal"
    | "technical"
    | "custom";
  isActive: boolean;
  isDefault: boolean;
  templateData: {
    layout: "single-column" | "two-column" | "three-column";
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      fontSize: {
        heading: number;
        subheading: number;
        body: number;
        small: number;
      };
    };
    spacing: {
      margin: number;
      padding: number;
      sectionGap: number;
      itemGap: number;
    };
    sections: {
      order: string[];
      visibility: Record<string, boolean>;
      customSections?: Array<{
        id: string;
        title: string;
        type: "text" | "list" | "grid";
        content: any;
      }>;
    };
  };
  previewImage?: string;
  downloadCount: number;
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  lastModified: Date;
}

export interface ResumeTemplateDocument extends IResumeTemplate, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Resume Generation interfaces
export interface IResumeGeneration {
  userId?: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  sessionId?: string;
  generationData: {
    personalInfo: {
      name: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      website?: string;
      linkedin?: string;
      github?: string;
    };
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate?: string;
      description: string[];
      skills?: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      details?: string;
    }>;
    skills: Array<{
      category: string;
      items: string[];
    }>;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      outcomes?: string[];
      githubUrl?: string;
      liveUrl?: string;
    }>;
    customSections?: Array<{
      title: string;
      content: any;
    }>;
  };
  customizations: {
    colorScheme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      text?: string;
      background?: string;
    };
    typography?: {
      headingFont?: string;
      bodyFont?: string;
      fontSize?: {
        heading?: number;
        subheading?: number;
        body?: number;
        small?: number;
      };
    };
    sectionVisibility?: Record<string, boolean>;
    sectionOrder?: string[];
  };
  generatedAt: Date;
  downloadedAt?: Date;
  fileUrl?: string;
  fileSize?: number;
  status: "pending" | "generated" | "failed" | "expired";
  errorMessage?: string;
  expiresAt: Date;
}

export interface ResumeGenerationDocument extends IResumeGeneration, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Resume Rating interfaces
export interface IResumeRating {
  templateId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  rating: number;
  review?: string;
  helpful: number;
  reported: boolean;
}

export interface ResumeRatingDocument extends IResumeRating, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Email interface
export interface IEmailOptions {
  email: string;
  subject: string;
  message: string;
}
