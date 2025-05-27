import type { FileContent } from '../../types/github';
import type { RepositoryConfig, RepositoryData } from '../../types/github';
import type { MCPAnalysis } from '../../types/mcp';
import { MCPParser } from '../parser/mcpParser';
import { GitHubService } from '../github/githubService';

// Placeholder for additional insights type
interface Insights {
  toolCount: number;
  promptCount: number;
  resourceCount: number;
  // Add more as needed
}

// The result returned by the analyzer
export interface AnalysisResult extends MCPAnalysis {
  repo?: RepositoryData;
  insights?: Insights;
}

export class AnalyzerService {
  private parser: MCPParser;
  private githubService: GitHubService;

  constructor(parser: MCPParser, githubService: GitHubService) {
    this.parser = parser;
    this.githubService = githubService;
  }

  // Analyze pasted code (array of files)
  async analyzeCode(files: FileContent[]): Promise<AnalysisResult> {
    const analysis = this.parser.parseRepository(files);
    const insights = this.generateInsights(analysis);
    return {
      ...analysis,
      insights,
    };
  }

  // Analyze a GitHub repository
  async analyzeRepository(config: RepositoryConfig): Promise<AnalysisResult> {
    const repoData = await this.githubService.fetchRepository(config);
    const analysis = this.parser.parseRepository(repoData.files);
    const insights = this.generateInsights(analysis);
    return {
      repo: repoData,
      ...analysis,
      insights,
    };
  }

  // Generate architectural insights (placeholder)
  private generateInsights(analysis: MCPAnalysis): Insights {
    return {
      toolCount: analysis.tools.length,
      promptCount: analysis.prompts.length,
      resourceCount: analysis.resources.length,
      // Add more insights as needed
    };
  }
} 