export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  imageUrl?: string;
}

import fallbackData from './fallbackProjects.json';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Error fetching projects');
    return await res.json();
  } catch (error) {
    console.warn('API fetch failed, using fallback data:', error);
    return fallbackData as Project[];
  }
};

export const saveProject = async (project: Project, token: string) => {
  const res = await fetch('/api/projects', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Error saving project');
};

export const createProject = async (project: Project, token: string) => {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Error creating project');
};

export const deleteProject = async (id: string, token: string) => {
  const res = await fetch(`/api/projects?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error deleting project');
};
