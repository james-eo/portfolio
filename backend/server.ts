import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
import connectDB from '@/config/db';

// Import routes
import aboutRoutes from '@/routes/about.routes';
import authRoutes from '@/routes/auth.routes';
import contactRoutes from '@/routes/contact.routes';
import educationRoutes from '@/routes/education.routes';
import userRoutes from '@/routes/user.routes';
import skillsRoutes from '@/routes/skills.routes';
import experienceRoutes from '@/routes/experience.routes';
import projectRoutes from '@/routes/projects.routes';
import uploadRoutes from '@/routes/upload.routes';
import resumeRoutes from '@/routes/resume.routes';
import resumeTemplateRoutes from '@/routes/resumeTemplate.routes';
import resumeGenerationRoutes from '@/routes/resumeGeneration.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/resume/templates', resumeTemplateRoutes);
app.use('/api/resume', resumeGenerationRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

app.use((err: ErrorWithStatusCode, req: Request, res: Response) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
