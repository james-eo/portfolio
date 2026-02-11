import { aboutAPI, skillsAPI, experienceAPI, projectsAPI, educationAPI } from './api';

export interface ResumeData {
  about: {
    name: string;
    title: string;
    summary: string;
    location: string;
    contactInfo: {
      email: string;
      phone: string;
    };
    socialLinks: {
      linkedin: string;
      github: string;
      twitter?: string;
      website?: string;
    };
  };
  skills: Array<{
    id: string;
    name: string;
    skills: string[];
  }>;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    outcomes: string[];
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    imageUrl?: string;
    videoUrl?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
}

export async function fetchResumeData(): Promise<ResumeData> {
  try {
    const [aboutResponse, skillsResponse, experienceResponse, projectsResponse, educationResponse] =
      await Promise.all([
        aboutAPI.getAbout(),
        skillsAPI.getSkillCategories(),
        experienceAPI.getExperiences(),
        projectsAPI.getProjects(),
        educationAPI.getEducation(),
      ]);

    return {
      about: aboutResponse.data || {
        name: 'James Okonkwo',
        title: 'Full Stack Software Engineer',
        summary:
          'Motivated Full Stack Software Engineer with hands-on experience building scalable web applications.',
        location: 'Abuja, Nigeria',
        contactInfo: {
          email: 'jameseokonkwo@gmail.com',
          phone: '+2347032370055',
        },
        socialLinks: {
          linkedin: 'linkedin.com/in/james-o',
          github: 'github.com/james-eo',
        },
      },
      skills: skillsResponse.data || [],
      experience: experienceResponse.data || [],
      projects: projectsResponse.data || [],
      education: educationResponse.data || [],
    };
  } catch (error) {
    console.error('Error fetching resume data:', error);
    // Return fallback data if API fails
    return {
      about: {
        name: 'James Okonkwo',
        title: 'Full Stack Software Engineer',
        summary:
          'Motivated Full Stack Software Engineer with hands-on experience building scalable web applications using Python, JavaScript, and Node.js. Skilled in designing RESTful APIs, implementing backend systems, and collaborating with cross-functional teams. Passionate about solving complex problems and delivering user-centric solutions. Proven ability to learn quickly and adapt to new technologies.',
        location: 'Abuja, Nigeria',
        contactInfo: {
          email: 'jameseokonkwo@gmail.com',
          phone: '+2347032370055',
        },
        socialLinks: {
          linkedin: 'linkedin.com/in/james-o',
          github: 'github.com/james-eo',
        },
      },
      skills: [],
      experience: [],
      projects: [],
      education: [],
    };
  }
}
