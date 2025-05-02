export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  client: string;
  year: number;
  status: ProjectStatus;
  categoryId: number;
}

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
