'use server';

import { revalidatePath } from 'next/cache';
import type { About, Experience, Project, Education, SkillCategory } from '../types';
import api from './api';

// Server Actions that handle mutations from the client
// These interact with the backend API and revalidate the cache after successful updates

export async function updateAbout(about: About): Promise<{ success: boolean }> {
  try {
    await api.put('/about', { about });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating about:', error);
    return { success: false };
  }
}

export async function updateSkillCategories(
  categories: SkillCategory[]
): Promise<{ success: boolean }> {
  try {
    await api.put('/skills', { categories });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating skill categories:', error);
    return { success: false };
  }
}

export async function updateExperience(experience: Experience[]): Promise<{ success: boolean }> {
  try {
    await api.put('/experience', { experience });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating experience:', error);
    return { success: false };
  }
}

export async function updateProject(project: Project): Promise<{ success: boolean }> {
  try {
    await api.put('/projects', { project });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false };
  }
}

export async function updateSkills(skills: string[]): Promise<{ success: boolean }> {
  try {
    await api.put('/skills', { skills });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating skills:', error);
    return { success: false };
  }
}

export async function updateProjects(projects: Project[]): Promise<{ success: boolean }> {
  try {
    await api.put('/projects', { projects });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating projects:', error);
    return { success: false };
  }
}

export async function updateEducation(education: Education[]): Promise<{ success: boolean }> {
  try {
    await api.put('/education', { education });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating education:', error);
    return { success: false };
  }
}
