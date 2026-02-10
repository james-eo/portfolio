'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Github, Linkedin, Award } from 'lucide-react';
import { fetchResumeData, type ResumeData } from '@/lib/resume-data';

const ModernResume = () => {
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
      <div className="resume-page resume-modern shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-page resume-modern shadow-lg">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading resume data</p>
        </div>
      </div>
    );
  }

  const { about, skills, experience, projects, education } = resumeData;

  return (
    <div className="resume-page resume-modern shadow-lg min-h-full">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">Modern Template</div>

      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-1">{about.name}</h1>
        <h2 className="text-xl text-gray-600 mb-4 uppercase tracking-wider">{about.title}</h2>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Phone size={14} className="text-blue-600" /> {about.contactInfo.phone}
          </div>
          <div className="flex items-center gap-1">
            <Mail size={14} className="text-blue-600" /> {about.contactInfo.email}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-blue-600" /> {about.location}
          </div>
          {about.socialLinks.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} className="text-blue-600" /> {about.socialLinks.linkedin}
            </div>
          )}
          {about.socialLinks.github && (
            <div className="flex items-center gap-1">
              <Github size={14} className="text-blue-600" /> {about.socialLinks.github}
            </div>
          )}
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase">Technical Skills</h3>
              <div className="space-y-3">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h4 className="font-semibold text-gray-700">{skillCategory.name}</h4>
                    <p className="text-sm">{skillCategory.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase">Education</h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm">{edu.year}</p>
                    {edu.details && <p className="text-xs text-gray-600 mt-1">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2">
          {/* Summary */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase">Professional Summary</h3>
            <p className="text-sm leading-relaxed">{about.summary}</p>
          </section>

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase">Work Experience</h3>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {exp.company} | {exp.location}
                    </p>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {exp.description.map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                    {exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-600 mb-3 uppercase">Projects</h3>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-blue-600" />
                      <h4 className="font-semibold">{project.title}</h4>
                    </div>
                    <p className="text-sm mt-1 mb-1">{project.description}</p>
                    {project.outcomes.length > 0 && (
                      <ul className="list-disc ml-5 text-xs space-y-1 mb-1">
                        {project.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1 text-xs">
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
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernResume;
