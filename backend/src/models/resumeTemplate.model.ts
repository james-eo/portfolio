import mongoose, { Schema, type Document } from 'mongoose';

export interface IResumeTemplate {
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
        content: Record<string, unknown>;
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

const ResumeTemplateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Template description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['modern', 'professional', 'creative', 'minimal', 'technical', 'custom'],
      required: [true, 'Template category is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    templateData: {
      layout: {
        type: String,
        enum: ['single-column', 'two-column', 'three-column'],
        default: 'single-column',
      },
      colorScheme: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#64748b' },
        accent: { type: String, default: '#3b82f6' },
        text: { type: String, default: '#1f2937' },
        background: { type: String, default: '#ffffff' },
      },
      typography: {
        headingFont: { type: String, default: 'Arial, sans-serif' },
        bodyFont: { type: String, default: 'Arial, sans-serif' },
        fontSize: {
          heading: { type: Number, default: 24 },
          subheading: { type: Number, default: 16 },
          body: { type: Number, default: 12 },
          small: { type: Number, default: 10 },
        },
      },
      spacing: {
        margin: { type: Number, default: 0.5 },
        padding: { type: Number, default: 0.5 },
        sectionGap: { type: Number, default: 0.2 },
        itemGap: { type: Number, default: 0.15 },
      },
      sections: {
        order: {
          type: [String],
          default: ['header', 'summary', 'experience', 'education', 'skills', 'projects'],
        },
        visibility: {
          type: Map,
          of: Boolean,
          default: {
            header: true,
            summary: true,
            experience: true,
            education: true,
            skills: true,
            projects: true,
            contact: true,
          },
        },
        customSections: [
          {
            id: String,
            title: String,
            type: {
              type: String,
              enum: ['text', 'list', 'grid'],
            },
            content: Schema.Types.Mixed,
          },
        ],
      },
    },
    previewImage: {
      type: String,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v),
        message: 'Preview image must be a valid image URL',
      },
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ResumeTemplateSchema.index({ name: 1 });
ResumeTemplateSchema.index({ category: 1, isActive: 1 });
ResumeTemplateSchema.index({ 'rating.average': -1 });
ResumeTemplateSchema.index({ downloadCount: -1 });
ResumeTemplateSchema.index({ tags: 1 });

// Middleware
ResumeTemplateSchema.pre('save', function (next) {
  this.lastModified = new Date();
  next();
});

export default mongoose.model<ResumeTemplateDocument>('ResumeTemplate', ResumeTemplateSchema);
