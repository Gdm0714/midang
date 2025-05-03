import axios from "axios";
import {
  Project,
  ProjectStatus,
} from "@architecture-firm/shared/dist/types/project.js";

// src/services/api.ts
interface ProjectWithImages extends Project {
  images: Array<{
    id: number;
    url: string;
    description: string;
    isFeatured: boolean; // 이 속성을 추가
  }>;
}

// API 기본 설정
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 프로젝트 API
export const fetchProjects = async (
  categoryId?: number,
): Promise<Project[]> => {
  const params = categoryId ? { category: categoryId } : {};
  const response = await api.get("/projects", { params });
  return response.data;
};

export const fetchFeaturedProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects/featured");
  return response.data;
};

export const fetchProjectById = async (id: number): Promise<ProjectWithImages> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: any): Promise<Project> => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id: number, projectData: any): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export default api;
