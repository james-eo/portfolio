'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { fetchResumeData, type ResumeData } from '@/lib/resume-data';

const ProfessionalResume = () => {
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
      <div className="resume-page resume-professional shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-page resume-professional shadow-lg">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading resume data</p>
        </div>
      </div>
    );
  }

  const { about, skills, experience, projects, education } = resumeData;

  return (
    <div className="resume-page resume-professional shadow-lg min-h-full">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">
        Professional Template
      </div>

      {/* Header with colored background */}
      <header className="bg-gray-800 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-1">{about.name.toUpperCase()}</h1>
        <h2 className="text-xl mb-4">{about.title}</h2>

        <div className="flex flex-wrap gap-4 text-sm">
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
        <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-3">
          PROFESSIONAL SUMMARY
        </h3>
        <p className="text-sm">{about.summary}</p>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-3">
            TECHNICAL SKILLS
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
          <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-3">
            PROFESSIONAL EXPERIENCE
          </h3>

          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-bold text-base">{exp.title.toUpperCase()}</h4>
                  <h5 className="text-sm font-semibold">
                    {exp.company.toUpperCase()} | {exp.location}
                  </h5>
                </div>
                <div className="text-sm font-semibold">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
                {exp.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((skill, index) => (
                    <span
                      key={index}
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
          <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-3">
            KEY PROJECTS
          </h3>

          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h4 className="font-bold text-base">{project.title.toUpperCase()}</h4>
              <p className="text-sm mb-1">{project.description}</p>
              {project.outcomes.length > 0 && (
                <ul className="list-disc ml-5 text-sm space-y-1 mb-1">
                  {project.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              )}
              <div className="text-sm font-semibold">
                Technologies: {project.technologies.join(', ')}
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
          <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-1 mb-3">
            EDUCATION
          </h3>

          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-base">{edu.degree.toUpperCase()}</h4>
                  <h5 className="text-sm">{edu.institution}</h5>
                </div>
                <div className="text-sm font-semibold">{edu.year}</div>
              </div>
              {edu.details && <p className="text-sm mt-1">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProfessionalResume;
