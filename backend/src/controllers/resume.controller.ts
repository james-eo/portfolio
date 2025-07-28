import type { Request, Response, NextFunction } from "express"
import ErrorResponse from "../utils/errorResponse"
import asyncHandler from "../utils/asyncHandler"
import puppeteer from "puppeteer"
import About from "../models/about.model"
import Skills from "../models/skills.model"
import Experience from "../models/experience.model"
import Project from "../models/project.model"
import Education from "../models/education.model"

// @desc    Generate and download resume PDF
// @route   GET /api/resume/:template
// @access  Private (for download) / Public (for preview)
export const generateResume = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { template } = req.params
  const isDownload = req.query.download === "true"

  // Validate template
  const validTemplates = ["minimal", "modern", "professional", "creative", "technical", "uploaded"]
  if (!validTemplates.includes(template)) {
    return next(new ErrorResponse(`Invalid template: ${template}`, 400))
  }

  // If it's a download request, check authentication
  if (isDownload && (!req.user || req.user.role !== "admin")) {
    return next(new ErrorResponse("Not authorized to download resumes", 401))
  }

  try {
    // Fetch data from database
    const [aboutData, skillsData, experienceData, projectsData, educationData] = await Promise.all([
      About.findOne().lean(),
      Skills.find().lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Education.find().sort({ order: 1, createdAt: -1 }).lean(),
    ])

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    // Set the viewport to a typical resume size (8.5x11 inches at 96 DPI)
    await page.setViewport({
      width: 816, // 8.5 inches at 96 DPI
      height: 1056, // 11 inches at 96 DPI
      deviceScaleFactor: 2, // Higher resolution
    })

    // Generate HTML content with database data
    const htmlContent = getResumeHtml(template, {
      about: aboutData,
      skills: skillsData,
      experience: experienceData,
      projects: projectsData,
      education: educationData,
    })

    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Generate PDF with proper page handling
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      preferCSSPageSize: true,
    })

    await browser.close()

    // Set response headers
    res.setHeader("Content-Type", "application/pdf")

    if (isDownload) {
      res.setHeader("Content-Disposition", `attachment; filename="resume-${template}.pdf"`)
    } else {
      res.setHeader("Content-Disposition", `inline; filename="resume-${template}.pdf"`)
    }

    // Send the PDF
    res.send(pdfBuffer)
  } catch (error) {
    console.error("PDF generation error:", error)
    return next(new ErrorResponse("Error generating resume PDF", 500))
  }
})

// Helper function to get HTML content for the resume with database data
function getResumeHtml(template: string, data: any): string {
  const { about, skills, experience, projects, education } = data

  // Default data if database is empty
  const defaultAbout = {
    name: "James Okonkwo",
    title: "Full Stack Software Engineer",
    summary: "Motivated Full Stack Software Engineer with hands-on experience building scalable web applications.",
    location: "Abuja, Nigeria",
    contactInfo: {
      email: "jameseokonkwo@gmail.com",
      phone: "+2347032370055",
    },
    socialLinks: {
      linkedin: "linkedin.com/in/james-o",
      github: "github.com/james-eo",
    },
  }

  const aboutInfo = about || defaultAbout

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${aboutInfo.name} - Resume</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          color: #333;
          line-height: 1.4;
          font-size: 12px;
        }
        
        .resume-container {
          width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
          background: white;
        }
        
        h1 {
          color: #2563eb;
          margin-bottom: 0.1in;
          font-size: 24px;
        }
        
        h2 {
          color: #4b5563;
          margin-bottom: 0.15in;
          font-size: 16px;
        }
        
        h3 {
          color: #1f2937;
          margin-bottom: 0.1in;
          font-size: 14px;
          font-weight: bold;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.05in;
        }
        
        h4 {
          font-weight: bold;
          margin-bottom: 0.05in;
          font-size: 12px;
        }
        
        .section {
          margin-bottom: 0.2in;
          page-break-inside: avoid;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2in;
          margin-bottom: 0.2in;
          font-size: 11px;
        }
        
        .experience-item, .education-item, .project-item {
          margin-bottom: 0.15in;
          page-break-inside: avoid;
        }
        
        .experience-header, .education-header, .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.05in;
        }
        
        .company-info {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 0.05in;
        }
        
        ul {
          margin-left: 0.2in;
          margin-bottom: 0.1in;
        }
        
        li {
          margin-bottom: 0.03in;
          font-size: 11px;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.1in;
          font-size: 11px;
        }
        
        .skill-category {
          margin-bottom: 0.1in;
        }
        
        .skill-name {
          font-weight: bold;
        }
        
        .technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.05in;
          margin-top: 0.05in;
        }
        
        .tech-tag {
          background-color: #f3f4f6;
          padding: 0.02in 0.05in;
          border-radius: 0.02in;
          font-size: 10px;
        }
        
        .project-links {
          font-size: 10px;
          margin-top: 0.05in;
        }
        
        .project-links a {
          color: #2563eb;
          text-decoration: none;
          margin-right: 0.1in;
        }
        
        @page {
          size: Letter;
          margin: 0.5in;
        }
        
        @media print {
          .resume-container {
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <!-- Header -->
        <header>
          <h1>${aboutInfo.name}</h1>
          <h2>${aboutInfo.title}</h2>
          
          <div class="contact-info">
            <span>📞 ${aboutInfo.contactInfo?.phone || "+2347032370055"}</span>
            <span>✉️ ${aboutInfo.contactInfo?.email || "jameseokonkwo@gmail.com"}</span>
            <span>📍 ${aboutInfo.location || "Abuja, Nigeria"}</span>
            ${aboutInfo.socialLinks?.linkedin ? `<span>💼 ${aboutInfo.socialLinks.linkedin}</span>` : ""}
            ${aboutInfo.socialLinks?.github ? `<span>🔗 ${aboutInfo.socialLinks.github}</span>` : ""}
          </div>
        </header>
        
        <!-- Summary -->
        <div class="section">
          <h3>PROFESSIONAL SUMMARY</h3>
          <p>${aboutInfo.summary}</p>
        </div>
        
        <!-- Skills -->
        ${
          skills && skills.length > 0
            ? `
        <div class="section">
          <h3>TECHNICAL SKILLS</h3>
          <div class="skills-grid">
            ${skills
              .map(
                (skill) => `
              <div class="skill-category">
                <span class="skill-name">${skill.name}:</span> ${skill.skills.join(", ")}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        <!-- Experience -->
        ${
          experience && experience.length > 0
            ? `
        <div class="section">
          <h3>PROFESSIONAL EXPERIENCE</h3>
          ${experience
            .map(
              (exp) => `
            <div class="experience-item">
              <div class="experience-header">
                <h4>${exp.title}</h4>
                <span>${exp.startDate} - ${exp.endDate}</span>
              </div>
              <div class="company-info">${exp.company} | ${exp.location}</div>
              <ul>
                ${exp.description.map((desc) => `<li>${desc}</li>`).join("")}
              </ul>
              ${
                exp.skills && exp.skills.length > 0
                  ? `
                <div class="technologies">
                  ${exp.skills.map((skill) => `<span class="tech-tag">${skill}</span>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- Projects -->
        ${
          projects && projects.length > 0
            ? `
        <div class="section">
          <h3>KEY PROJECTS</h3>
          ${projects
            .map(
              (project) => `
            <div class="project-item">
              <div class="project-header">
                <h4>${project.title}</h4>
              </div>
              <p>${project.description}</p>
              ${
                project.outcomes && project.outcomes.length > 0
                  ? `
                <ul>
                  ${project.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}
                </ul>
              `
                  : ""
              }
              <div class="technologies">
                ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
              </div>
              <div class="project-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}">GitHub</a>` : ""}
                ${project.liveUrl ? `<a href="${project.liveUrl}">Live Demo</a>` : ""}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- Education -->
        ${
          education && education.length > 0
            ? `
        <div class="section">
          <h3>EDUCATION</h3>
          ${education
            .map(
              (edu) => `
            <div class="education-item">
              <div class="education-header">
                <h4>${edu.degree}</h4>
                <span>${edu.year}</span>
              </div>
              <div class="company-info">${edu.institution}</div>
              ${edu.details ? `<p>${edu.details}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `
}
