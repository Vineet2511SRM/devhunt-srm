import api from './api.js';

// Get all projects (with query params: page, sort, search, techStack)
export const getProjects = (params) => api.get('/projects', { params });

// Get single project by ID
export const getProject = (id) => api.get(`/projects/${id}`);

// Create a new project (FormData for image uploads)
export const createProject = (formData) =>
  api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Update a project
export const updateProject = (id, formData) =>
  api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Delete a project
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Search projects
export const searchProjects = (query) =>
  api.get('/projects', { params: { search: query } });
