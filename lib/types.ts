export interface IProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDeployment {
  id: string;
  projectId: string;
  domains?: string[];
  description: string;
  status: string;
  databases: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IUserPrefs {
  id: number;
  author: string;
  themeURL: string;
}

export interface IPage {
  id: number;
  type: "post" | "page";
  name: string;
  body: string;
}
