// Service for interacting with the GitHub API

import { Octokit } from '@octokit/rest';
import type { RepositoryConfig, RepositoryData, FileContent, GitHubError } from '../../types/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type OctokitContentResponse = RestEndpointMethodTypes['repos']['getContent']['response']['data'];
type OctokitFileContent = Extract<OctokitContentResponse, { type: 'file'; encoding: string; content: string }>;
type OctokitDirContent = Extract<OctokitContentResponse, { type: 'dir' }>;

export class GitHubService {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'mcp-analyzer',
    });
  }

  async fetchRepository(config: RepositoryConfig): Promise<RepositoryData> {
    try {
      // Fetch repository metadata
      const { data: repo } = await this.octokit.repos.get({
        owner: config.owner,
        repo: config.repo,
      });

      // Fetch repository contents
      const { data: contents } = await this.octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: '',
        ref: config.branch || repo.default_branch,
      });

      // Process files (recursively if needed)
      const files = await this.processContents(
        (Array.isArray(contents) ? contents : [contents]) as OctokitContentResponse[],
        config
      );

      return {
        name: repo.name,
        description: repo.description || '',
        defaultBranch: repo.default_branch,
        files,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async processContents(contents: OctokitContentResponse[], config: RepositoryConfig): Promise<FileContent[]> {
    const files: FileContent[] = [];

    for (const item of contents) {
      if (!item || typeof item !== 'object' || !('type' in item)) continue;
      const t = (item as any).type;
      if (t === 'file' && 'content' in item && typeof (item as any).content === 'string') {
        const fileContent = item as OctokitFileContent;
        files.push({
          path: fileContent.path,
          content: Buffer.from(fileContent.content, 'base64').toString(),
          sha: fileContent.sha,
        });
      } else if (t === 'dir' && 'path' in item && typeof (item as any).path === 'string') {
        const dirContent = item as OctokitDirContent;
        const { data: dirContents } = await this.octokit.repos.getContent({
          owner: config.owner,
          repo: config.repo,
          path: (dirContent as any).path,
          ref: config.branch,
        });
        const subFiles = await this.processContents(
          (Array.isArray(dirContents) ? dirContents : [dirContents]) as OctokitContentResponse[],
          config
        );
        files.push(...subFiles);
      }
    }

    return files;
  }

  private handleError(error: any): GitHubError {
    if (error.status) {
      return {
        message: error.message || 'GitHub API error',
        status: error.status,
      };
    }
    return {
      message: 'Unknown error occurred',
      status: 500,
    };
  }
} 