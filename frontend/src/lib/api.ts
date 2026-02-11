import axios from 'axios';
import { auth } from './auth';
import { AboutUpdateData, Education, EmailOptions, CreateExperienceData } from '@/types';
import type { ProjectFormData, SkillCategoryFormData } from './validation-schemas';
import Experience from '@/components/experience';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from auth utility
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth and redirect to login if in browser
      if (typeof window !== 'undefined') {
        auth.logout();
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden errors (admin access denied)
    if (error.response && error.response.status === 403) {
      if (typeof window !== 'undefined') {
        auth.logout();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// About API
export const aboutAPI = {
  getAbout: async () => {
    const response = await api.get('/about');
    return response.data;
  },
  updateAbout: async (data: AboutUpdateData) => {
    const response = await api.put('/about', data);
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  getSkillCategories: async () => {
    const response = await api.get('/skills');
    return response.data;
  },
  getSkillCategory: async (id: string) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },
  createSkillCategory: async (data: SkillCategoryFormData) => {
    const response = await api.post('/skills', data);
    return response.data;
  },
  updateSkillCategory: async (id: string, data: SkillCategoryFormData) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },
  deleteSkillCategory: async (id: string) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};

// Experience API
export const experienceAPI = {
  getExperiences: async () => {
    const response = await api.get('/experience');
    return response.data;
  },
  getExperience: async (id: string) => {
    const response = await api.get(`/experience/${id}`);
    return response.data;
  },
  createExperience: async (data: CreateExperienceData) => {
    const response = await api.post('/experience', data);
    return response.data;
  },
  updateExperience: async (id: string, data: Partial<Experience>) => {
    const response = await api.put(`/experience/${id}`, data);
    return response.data;
  },
  deleteExperience: async (id: string) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async (params?: { featured?: boolean | string }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },
  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  createProject: async (data: ProjectFormData) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  updateProject: async (id: string, data: ProjectFormData) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Education API
export const educationAPI = {
  getEducation: async () => {
    const response = await api.get('/education');
    return response.data;
  },
  getEducationById: async (id: string) => {
    const response = await api.get(`/education/${id}`);
    return response.data;
  },
  createEducation: async (data: Education) => {
    const response = await api.post('/education', data);
    return response.data;
  },
  updateEducation: async (id: string, data: Partial<Education>) => {
    const response = await api.put(`/education/${id}`, data);
    return response.data;
  },
  deleteEducation: async (id: string) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submitContactForm: async (data: EmailOptions) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  getContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
  getContact: async (id: string) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },
  deleteContact: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
  toggleReadStatus: async (id: string) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  downloadResume: async (template: string) => {
    const response = await api.get(`/resume/${template}?download=true`, {
      responseType: 'blob',
    });

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume-${template}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  },
  previewResume: async (template: string) => {
    const response = await api.get(`/resume/${template}`, {
      responseType: 'blob',
    });

    return window.URL.createObjectURL(new Blob([response.data]));
  },
};

export default api;
