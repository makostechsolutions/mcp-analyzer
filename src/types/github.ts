export interface RepositoryConfig {
  owner: string;
  repo: string;
  branch?: string;
}

export interface FileContent {
  path: string;
  content: string;
  sha: string;
}

export interface RepositoryData {
  name: string;
  description: string;
  defaultBranch: string;
  files: FileContent[];
  stars: number;
  forks: number;
}

export interface GitHubError {
  message: string;
  status: number;
} 