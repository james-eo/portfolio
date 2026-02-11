// User
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  createdAt?: string;
  updatedAt?: string;
}

// About
export interface About {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutUpdateData {
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

// Skill
export interface Skill {
  _id: string;
  name: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExperienceData {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string[];
  skills?: string[];
  order?: number;
}

// Experience
export interface Experience {
  _id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string[];
  skills?: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Project
export interface Project {
  _id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectData {
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

// Education
export interface Education {
  degree: string;
  institution: string;
  year: string;
  details?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Contact
export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Resume Template
export interface ResumeTemplate {
  name: string;
  displayName: string;
  description: string;
  category: 'modern' | 'professional' | 'creative' | 'minimal' | 'technical' | 'custom';
  isActive: boolean;
  isDefault: boolean;
  templateData: {
    layout: 'single-column' | 'two-column' | 'three-column';
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
        type: 'text' | 'list' | 'grid';
        content: string | string[] | Record<string, unknown>;
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
  createdBy?: string; // user id as string
  lastModified: string;
  createdAt?: string;
  updatedAt?: string;
}

// Resume Generation
export interface ResumeGeneration {
  userId?: string;
  templateId: string;
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
      content: string | string[] | Record<string, unknown>;
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
  generatedAt: string;
  downloadedAt?: string;
  fileUrl?: string;
  fileSize?: number;
  status: 'pending' | 'generated' | 'failed' | 'expired';
  errorMessage?: string;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
}

// Resume Rating
export interface ResumeRating {
  templateId: string;
  userId?: string;
  sessionId?: string;
  rating: number;
  review?: string;
  helpful: number;
  reported: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Email Options
export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}
