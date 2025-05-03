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

export const fetchFeaturedProjects = async (): Promise<Project[]> => {
  try {
    // 이미지 정보를 포함하여 가져오도록 relations 파라미터 추가
    const response = await axios.get(`${API_URL}/projects/featured`, {
      params: {
        includeImages: true // 백엔드 API가 이 파라미터를 지원한다면 사용
      }
    });
    console.log("Featured projects API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
};

// 모든 프로젝트 가져오는 함수에도 이미지 정보 포함하도록 수정
export const fetchProjects = async (categoryId?: number): Promise<Project[]> => {
  try {
    const params: any = { includeImages: true };
    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await axios.get(`${API_URL}/projects`, { params });
    console.log("All projects API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
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
