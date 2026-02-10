'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
import { fetchResumeData, type ResumeData } from '@/lib/resume-data';

const MinimalResume = () => {
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
      <div className="resume-page resume-minimal shadow-lg">
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
      <div className="resume-page resume-minimal shadow-lg">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading resume data</p>
        </div>
      </div>
    );
  }

  const { about, skills, experience, projects, education } = resumeData;

  return (
    <div className="resume-page resume-minimal shadow-lg min-h-full">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">Minimal Template</div>

      {/* Header */}
      <header className="mb-6">
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
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">SUMMARY</h3>
        <p className="text-sm">{about.summary}</p>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">COMPETENCES</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {skills.map((skillCategory) => (
              <div key={skillCategory.id}>
                <span className="font-semibold">{skillCategory.name}:</span>{' '}
                {skillCategory.skills.join(', ')}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h3>

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
              <ul className="list-disc ml-5 text-sm mt-1">
                {exp.description.map((desc, index) => (
                  <li key={`${exp.id}-desc-${index}`}>{desc}</li>
                ))}
              </ul>
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((skill, index) => (
                    <span
                      key={`${exp.id}-skill-${index}`}
                      className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
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
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">PROJECTS</h3>

          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-base">{project.title}</h4>
                <div className="text-sm">2024</div>
              </div>
              <p className="text-sm mb-1">{project.description}</p>
              {project.outcomes.length > 0 && (
                <ul className="list-disc ml-5 text-sm space-y-1 mb-1">
                  {project.outcomes.map((outcome, index) => (
                    <li key={`${project.id}-outcome-${index}`}>{outcome}</li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-2 mb-1">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 flex items-center"
                  >
                    <Github size={14} className="mr-1" /> GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" /> Live Demo
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">EDUCATION</h3>

          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-base">{edu.degree}</h4>
                  <h5 className="text-sm">{edu.institution}</h5>
                </div>
                <div className="text-sm">{edu.year}</div>
              </div>
              {edu.details && <p className="text-sm italic">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MinimalResume;
