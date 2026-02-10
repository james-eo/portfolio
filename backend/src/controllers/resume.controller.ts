import type { Request, Response, NextFunction } from 'express';
import puppeteer from 'puppeteer';

import About from '@/models/about.model';
import Skills from '@/models/skills.model';
import Experience from '@/models/experience.model';
import Project from '@/models/project.model';
import Education from '@/models/education.model';
import ErrorResponse from '@/utils/errorResponse';
import asyncHandler from '@/utils/asyncHandler';
import type { IAbout, ISkillCategory, IExperience, IProject, IEducation } from '@/types';

const VALID_TEMPLATES = ['minimal', 'modern', 'professional', 'creative', 'technical', 'uploaded'];

type ResumeSection<T> = T[] | null | undefined;

type ResumeData = {
  about: IAbout | null;
  skills: ResumeSection<ISkillCategory>;
  experience: ResumeSection<IExperience>;
  projects: ResumeSection<IProject>;
  education: ResumeSection<IEducation>;
};

// @desc    Generate and optionally download/preview resume PDF
// @route   GET /api/resume/:template
// @access  Private for download, Public for preview
export const generateResume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const templateParam = req.params.template;
    const template = Array.isArray(templateParam) ? templateParam[0] : (templateParam ?? '');
    const isDownload = String(req.query.download) === 'true';

    if (!template || !VALID_TEMPLATES.includes(template)) {
      return next(new ErrorResponse(`Invalid template: ${template}`, 400));
    }

    if (isDownload && (!req.user || req.user.role !== 'admin')) {
      return next(new ErrorResponse('Not authorized to download resumes', 401));
    }

    try {
      const [about, skills, experience, projects, education] = await Promise.all([
        About.findOne().lean(),
        Skills.find().lean(),
        Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
        Project.find().sort({ order: 1, createdAt: -1 }).lean(),
        Education.find().sort({ order: 1, createdAt: -1 }).lean(),
      ]);

      const htmlContent = buildResumeHtml(template, {
        about,
        skills,
        experience,
        projects,
        education,
      });
      const pdfBuffer = await renderPdf(htmlContent);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${isDownload ? 'attachment' : 'inline'}; filename="resume-${template}.pdf"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      return next(new ErrorResponse('Error generating resume PDF', 500));
    }
  }
);

export async function renderPdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8 = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfUint8);
  } finally {
    await browser.close();
  }
}

export function buildResumeHtml(template: string, data: ResumeData): string {
  const { about, skills, experience, projects, education } = data;

  const aboutInfo = {
    name: about?.name || 'Your Name',
    title: about?.title || 'Professional Title',
    summary:
      about?.summary || 'Motivated professional with experience delivering scalable applications.',
    location: about?.location || 'City, Country',
    contactInfo: {
      email: about?.contactInfo?.email || 'email@example.com',
      phone: about?.contactInfo?.phone || '',
    },
    socialLinks: {
      linkedin: about?.socialLinks?.linkedin || '',
      github: about?.socialLinks?.github || '',
    },
  };

  const contactLines = [aboutInfo.contactInfo.email, aboutInfo.contactInfo.phone]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ');

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(aboutInfo.name)} - Resume</title>
    <style>${generateFallbackStyles(template)}</style>
  </head>
  <body>
    <div class="resume">
      <header class="header">
        <div>
          <h1>${escapeHtml(aboutInfo.name)}</h1>
          <p class="title">${escapeHtml(aboutInfo.title)}</p>
        </div>
        <div class="contact">${contactLines}</div>
      </header>
      ${renderSection('Summary', aboutInfo.summary)}
      ${renderListSection('Experience', experience, renderExperience)}
      ${renderListSection('Projects', projects, renderProject)}
      ${renderListSection('Education', education, renderEducation)}
      ${renderListSection('Skills', skills, renderSkillCategory)}
    </div>
  </body>
  </html>`;
}

function renderSection(title: string, content?: string) {
  if (!content) return '';
  return `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(content)}</p></section>`;
}

function renderListSection<T>(
  title: string,
  list: ResumeSection<T>,
  renderer: (item: T) => string
) {
  if (!list || list.length === 0) return '';
  const items = list.map((item) => renderer(item)).join('');
  return `<section><h2>${escapeHtml(title)}</h2>${items}</section>`;
}

function renderExperience(item: IExperience) {
  const range = `${escapeHtml(item.startDate || '')}${item.endDate ? ` - ${escapeHtml(item.endDate)}` : ' - Present'}`;
  const description = (item.description || []).map(escapeHtml).join('<br />');
  return `<article><h3>${escapeHtml(item.title)} · ${escapeHtml(item.company)}</h3><p class="meta">${range}</p><p>${description}</p></article>`;
}

function renderProject(item: IProject) {
  const links = [item.githubUrl, item.liveUrl].filter(Boolean).map(escapeHtml).join(' · ');
  const technologies = (item.technologies || []).map(escapeHtml).join(', ');
  return `<article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || '')}</p><p class="meta">${technologies}</p><p class="meta">${links}</p></article>`;
}

function renderEducation(item: IEducation) {
  const year = item.year ? ` · ${escapeHtml(item.year)}` : '';
  return `<article><h3>${escapeHtml(item.degree)}</h3><p class="meta">${escapeHtml(item.institution || '')}${year}</p><p>${escapeHtml(item.details || '')}</p></article>`;
}

function renderSkillCategory(item: ISkillCategory) {
  const skillNames = (item.skills || []).map((skill) => escapeHtml(skill.name)).join(', ');
  return `<article><h3>${escapeHtml(item.name)}</h3><p>${skillNames}</p></article>`;
}

function generateFallbackStyles(template: string) {
  const primary = '#2563eb';
  const neutral = '#1f2937';
  const border = '#e5e7eb';
  const accent = template === 'creative' ? '#f59e0b' : primary;

  return `
    body { font-family: 'Inter', 'Helvetica', Arial, sans-serif; color: ${neutral}; margin: 0; padding: 0; }
    .resume { width: 8.5in; margin: 0 auto; padding: 0.6in; background: #fff; }
    h1 { margin: 0; font-size: 28px; color: ${primary}; }
    h2 { margin: 16px 0 8px; font-size: 18px; color: ${neutral}; border-bottom: 1px solid ${border}; padding-bottom: 4px; }
    h3 { margin: 8px 0 4px; font-size: 14px; color: ${neutral}; }
    p { margin: 4px 0; font-size: 12px; line-height: 1.5; }
    .title { color: ${accent}; font-weight: 600; }
    .meta { color: #6b7280; font-size: 11px; }
    section { margin-bottom: 14px; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${border}; padding-bottom: 10px; }
    .contact { text-align: right; font-size: 11px; color: #4b5563; }
  `;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
