'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Github, Linkedin, Star } from 'lucide-react';
import { fetchResumeData, type ResumeData } from '@/lib/resume-data';

const CreativeResume = () => {
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
      <div className="resume-page resume-creative shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-page resume-creative shadow-lg">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading resume data</p>
        </div>
      </div>
    );
  }

  const { about, skills, experience, projects, education } = resumeData;

  return (
    <div className="resume-page resume-creative shadow-lg min-h-full">
      <div className="no-print absolute top-4 right-4 text-xs text-gray-500">Creative Template</div>

      {/* Header with accent color */}
      <header className="mb-8 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -ml-10 -mt-10 z-0"></div>
        <div className="relative z-10 pl-6 pt-6">
          <h1 className="text-4xl font-bold mb-1">{about.name}</h1>
          <h2 className="text-xl text-blue-600 mb-4">{about.title}</h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-blue-500" /> {about.contactInfo.phone}
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} className="text-blue-500" /> {about.contactInfo.email}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-blue-500" /> {about.location}
            </div>
            {about.socialLinks.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin size={14} className="text-blue-500" /> {about.socialLinks.linkedin}
              </div>
            )}
            {about.socialLinks.github && (
              <div className="flex items-center gap-1">
                <Github size={14} className="text-blue-500" /> {about.socialLinks.github}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - 5/12 */}
        <div className="col-span-5">
          {/* Summary */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-blue-500 mb-3 flex items-center">
              <div className="w-6 h-1 bg-blue-500 mr-2"></div>
              ABOUT ME
            </h3>
            <p className="text-sm leading-relaxed">{about.summary}</p>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-500 mb-3 flex items-center">
                <div className="w-6 h-1 bg-blue-500 mr-2"></div>
                SKILLS
              </h3>

              <div className="space-y-3">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h4 className="font-semibold text-gray-700 flex items-center">
                      <Star size={12} className="text-blue-500 mr-1" fill="currentColor" />
                      {skillCategory.name}
                    </h4>
                    <p className="text-sm ml-4">{skillCategory.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-blue-500 mb-3 flex items-center">
                <div className="w-6 h-1 bg-blue-500 mr-2"></div>
                EDUCATION
              </h3>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-blue-500">{edu.institution}</p>
                    <p className="text-sm">{edu.year}</p>
                    {edu.details && <p className="text-xs text-gray-600 mt-1">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - 7/12 */}
        <div className="col-span-7">
          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-bold text-blue-500 mb-3 flex items-center">
                <div className="w-6 h-1 bg-blue-500 mr-2"></div>
                EXPERIENCE
              </h3>

              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-blue-200">
                    <div className="absolute -left-1.25 top-0 w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="mb-1">
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-blue-500">
                        {exp.company} | {exp.location}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <ul className="list-disc ml-4 text-sm space-y-1">
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
              <h3 className="text-lg font-bold text-blue-500 mb-3 flex items-center">
                <div className="w-6 h-1 bg-blue-500 mr-2"></div>
                PROJECTS
              </h3>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm mt-1 mb-2">{project.description}</p>
                    {project.outcomes.length > 0 && (
                      <ul className="list-disc ml-4 text-xs space-y-1 mb-2">
                        {project.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
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

export default CreativeResume;
