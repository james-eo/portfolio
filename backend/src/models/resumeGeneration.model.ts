import mongoose, { Schema, type Document } from 'mongoose';

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
      content: Record<string, unknown>;
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
  status: 'pending' | 'generated' | 'failed' | 'expired';
  errorMessage?: string;
  expiresAt: Date;
}

export interface ResumeGenerationDocument extends IResumeGeneration, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ResumeGenerationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeTemplate',
      required: [true, 'Template ID is required'],
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    generationData: {
      personalInfo: {
        name: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        phone: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        website: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        github: { type: String, trim: true },
      },
      summary: {
        type: String,
        required: true,
        maxlength: [1000, 'Summary cannot exceed 1000 characters'],
      },
      experience: [
        {
          title: { type: String, required: true, trim: true },
          company: { type: String, required: true, trim: true },
          location: { type: String, trim: true },
          startDate: { type: String, required: true },
          endDate: { type: String },
          description: [{ type: String, required: true }],
          skills: [{ type: String, trim: true }],
        },
      ],
      education: [
        {
          degree: { type: String, required: true, trim: true },
          institution: { type: String, required: true, trim: true },
          year: { type: String, required: true },
          details: { type: String, trim: true },
        },
      ],
      skills: [
        {
          category: { type: String, required: true, trim: true },
          items: [{ type: String, required: true, trim: true }],
        },
      ],
      projects: [
        {
          title: { type: String, required: true, trim: true },
          description: { type: String, required: true },
          technologies: [{ type: String, required: true, trim: true }],
          outcomes: [{ type: String, trim: true }],
          githubUrl: { type: String, trim: true },
          liveUrl: { type: String, trim: true },
        },
      ],
      customSections: [
        {
          title: { type: String, required: true, trim: true },
          content: Schema.Types.Mixed,
        },
      ],
    },
    customizations: {
      colorScheme: {
        primary: String,
        secondary: String,
        accent: String,
        text: String,
        background: String,
      },
      typography: {
        headingFont: String,
        bodyFont: String,
        fontSize: {
          heading: Number,
          subheading: Number,
          body: Number,
          small: Number,
        },
      },
      sectionVisibility: {
        type: Map,
        of: Boolean,
      },
      sectionOrder: [String],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    downloadedAt: {
      type: Date,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'generated', 'failed', 'expired'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ResumeGenerationSchema.index({ userId: 1, createdAt: -1 });
ResumeGenerationSchema.index({ sessionId: 1, createdAt: -1 });
ResumeGenerationSchema.index({ status: 1 });
ResumeGenerationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for download URL
ResumeGenerationSchema.virtual('downloadUrl').get(function () {
  return this.fileUrl ? `/api/resume/download/${this._id}` : null;
});

export default mongoose.model<ResumeGenerationDocument>('ResumeGeneration', ResumeGenerationSchema);
