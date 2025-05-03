// packages/shared/src/types/project.ts - 간소화된 버전
// 상수 객체
export const ProjectStatus = {
  PLANNING: 'planning',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed'
};

// 간단한 인터페이스 (복잡한 타입 문법 제거)
export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  client: string;
  year: number;
  status: string; // 문자열로 단순화
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  images?: Array<{
    id: number;
    url: string;
    description?: string;
    isFeatured: boolean;
  }>;
}