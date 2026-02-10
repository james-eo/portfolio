'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Code,
  Database,
  Server,
  Globe,
  Cpu,
} from 'lucide-react';
import { fetchResumeData, type ResumeData } from '@/lib/resume-data';

const TechnicalResume = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const data = await fetchResumeData();
        setResumeData(data);
      } catch (error) {
        console.error('Error loading resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  if (loading) {
    return (
      <div className="resume-page resume-technical shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-page resume-technical shadow-lg">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading resume data</p>
        </div>
      </div>
    );
  }

  const { about, skills, experience, projects, education } = resumeData;

  // Group skills by category for technical display
  const getSkillIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('programming') || name.includes('language')) return Code;
    if (name.includes('database')) return Database;
    if (name.includes('backend') || name.includes('server')) return Server;
    if (name.includes('frontend') || name.includes('web')) return Globe;
    return Cpu;
  };

  return (
    <div className="resume-page resume-technical shadow-lg min-h-full">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">
        Technical Template
      </div>

      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">{about.name}</h1>
            <h2 className="text-xl text-gray-700 mb-3">{about.title}</h2>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone size={14} /> {about.contactInfo.phone}
              </div>
              <div className="flex items-center gap-1">
                <Mail size={14} /> {about.contactInfo.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} /> {about.location}
              </div>
              {about.socialLinks.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin size={14} /> {about.socialLinks.linkedin}
                </div>
              )}
              {about.socialLinks.github && (
                <div className="flex items-center gap-1">
                  <Github size={14} /> {about.socialLinks.github}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex w-24 h-24 bg-gray-100 rounded-full items-center justify-center text-3xl font-bold text-gray-700">
            {about.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2">SUMMARY</h3>
        <p className="text-sm">{about.summary}</p>
      </section>

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">
            TECHNICAL SKILLS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skillCategory) => {
              const IconComponent = getSkillIcon(skillCategory.name);
              return (
                <div key={skillCategory.id} className="border border-gray-200 rounded-md p-3">
                  <h4 className="font-semibold flex items-center mb-2">
                    <IconComponent size={16} className="mr-2" /> {skillCategory.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">
            PROFESSIONAL EXPERIENCE
          </h3>

          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base">{exp.title}</h4>
                  <h5 className="text-sm">
                    {exp.company} | {exp.location}
                  </h5>
                </div>
                <div className="text-sm">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <ul className="list-disc ml-5 text-sm mt-2">
                {exp.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
              {exp.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {exp.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">
            TECHNICAL PROJECTS
          </h3>

          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h4 className="font-bold text-base">{project.title}</h4>
              <p className="text-sm mb-1">{project.description}</p>
              {project.outcomes.length > 0 && (
                <ul className="list-disc ml-5 text-sm space-y-1 mb-1">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-1 text-sm">
                {project.githubUrl && (
                  <a href={project.githubUrl} className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} className="text-blue-600 hover:underline">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">EDUCATION</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="border border-gray-200 rounded-md p-3">
                <h4 className="font-bold text-base">{edu.degree}</h4>
                <h5 className="text-sm">{edu.institution}</h5>
                <p className="text-sm mt-1">{edu.year}</p>
                {edu.details && <p className="text-xs text-gray-600 mt-1">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TechnicalResume;
