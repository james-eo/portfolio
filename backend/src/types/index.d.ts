import type { Document } from "mongoose"

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}

// User interfaces
export interface IUser {
  name: string
  email: string
  password: string
  role: "admin" | "user"
  resetPasswordToken?: string
  resetPasswordExpire?: Date
  getSignedJwtToken(): string
  matchPassword(enteredPassword: string): Promise<boolean>
}

export interface UserDocument extends IUser, Document {
  createdAt: Date
  updatedAt: Date
}

// About interfaces
export interface IAbout {
  summary: string
  location?: string
  title?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    twitter?: string
    website?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
  }
}

export interface AboutDocument extends IAbout, Document {
  createdAt: Date
  updatedAt: Date
}

// Skill interfaces
export interface ISkill {
  name: string
}

export interface ISkillCategory {
  name: string
  skills: ISkill[]
}

export interface SkillCategoryDocument extends ISkillCategory, Document {
  createdAt: Date
  updatedAt: Date
}

// Experience interfaces
export interface IExperience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  description: string[]
  skills?: string[]
  order?: number
}

export interface ExperienceDocument extends IExperience, Document {
  createdAt: Date
  updatedAt: Date
}

// Project interfaces
export interface IProject {
  title: string
  description: string
  outcomes?: string[]
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  videoUrl?: string
  featured?: boolean
  order?: number
}

export interface ProjectDocument extends IProject, Document {
  createdAt: Date
  updatedAt: Date
}

// Education interfaces
export interface IEducation {
  degree: string
  institution: string
  year: string
  details?: string
  order?: number
}

export interface EducationDocument extends IEducation, Document {
  createdAt: Date
  updatedAt: Date
}

// Contact interfaces
export interface IContact {
  name: string
  email: string
  subject: string
  message: string
  read?: boolean
}

export interface ContactDocument extends IContact, Document {
  createdAt: Date
  updatedAt: Date
}

// Email interface
export interface IEmailOptions {
  email: string
  subject: string
  message: string
}
