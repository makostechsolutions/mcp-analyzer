import type { FileContent } from '../../types/github';
import type { MCPTool, MCPPrompt, MCPResource, MCPComponent, MCPAnalysis } from '../../types/mcp';

interface MCPParserError {
  file: string;
  type: 'tool' | 'prompt' | 'resource';
  block: string;
  error: string;
}

export class MCPParser {
  // Improved patterns to match balanced curly braces for JSON objects
  private static readonly TOOL_PATTERN = /@tool\s*({[\s\S]*?})/g;
  private static readonly PROMPT_PATTERN = /@prompt\s*({[\s\S]*?})/g;
  private static readonly RESOURCE_PATTERN = /@resource\s*({[\s\S]*?})/g;
  
  // Relationship patterns
  private static readonly TOOL_REF_PATTERN = /@(\w+)\s*\(/g;
  private static readonly PROMPT_REF_PATTERN = /@(\w+)\s*{/g;
  private static readonly RESOURCE_REF_PATTERN = /@(\w+)\s*\[/g;

  private parseBlocks<T>(
    files: FileContent[],
    annotation: string,
    validate: (data: any) => boolean,
    type: 'tool' | 'prompt' | 'resource',
    collector: T[]
  ): MCPParserError[] {
    const errors: MCPParserError[] = [];
    for (const file of files) {
      const blocks = this.extractJsonBlocks(file.content, annotation);
      for (const block of blocks) {
        try {
          const data = this.parseJSON(block);
          if (data) {
            if (validate(data)) {
              collector.push(data as T);
            } else {
              errors.push({ file: file.path, type, block, error: `Invalid ${type} structure` });
            }
          }
        } catch (error: any) {
          errors.push({ file: file.path, type, block, error: error.message || 'Invalid JSON' });
        }
      }
    }
    return errors;
  }

  parseRepository(files: FileContent[]): MCPAnalysis & { errors?: MCPParserError[] } {
    const tools: MCPTool[] = [];
    const prompts: MCPPrompt[] = [];
    const resources: MCPResource[] = [];
    const toolToPrompt = new Map<string, string[]>();
    const promptToResource = new Map<string, string[]>();
    const toolToResource = new Map<string, string[]>();

    // Use generic block parser for all types
    const toolErrors = this.parseBlocks(files, '@tool', this.validateTool, 'tool', tools);
    const promptErrors = this.parseBlocks(files, '@prompt', this.validatePrompt, 'prompt', prompts);
    const resourceErrors = this.parseBlocks(files, '@resource', this.validateResource, 'resource', resources);
    const errors = [...toolErrors, ...promptErrors, ...resourceErrors];

    // Second pass: analyze relationships
    for (const file of files) {
      this.analyzeRelationships(
        file.content,
        tools,
        prompts,
        resources,
        toolToPrompt,
        promptToResource,
        toolToResource
      );
    }

    return {
      tools,
      prompts,
      resources,
      relationships: {
        toolToPrompt,
        promptToResource,
        toolToResource,
      },
      errors,
    };
  }

  // Helper to extract all balanced JSON objects after a given annotation
  private extractJsonBlocks(content: string, annotation: string): string[] {
    const blocks: string[] = [];
    let idx = 0;
    while (idx < content.length) {
      const start = content.indexOf(annotation, idx);
      if (start === -1) break;
      let braceStart = content.indexOf('{', start);
      if (braceStart === -1) break;
      let depth = 0;
      let end = braceStart;
      for (; end < content.length; end++) {
        if (content[end] === '{') depth++;
        if (content[end] === '}') depth--;
        if (depth === 0) break;
      }
      if (depth === 0 && braceStart < end) {
        blocks.push(content.slice(braceStart, end + 1));
        idx = end + 1;
      } else {
        break;
      }
    }
    return blocks;
  }

  private parseFile(file: FileContent): MCPComponent[] {
    const components: MCPComponent[] = [];

    // Parse tools
    const toolBlocks = this.extractJsonBlocks(file.content, '@tool');
    for (const block of toolBlocks) {
      try {
        const toolData = this.parseJSON(block);
        if (toolData) {
          components.push({
            type: 'tool',
            data: toolData as MCPTool,
          });
        }
      } catch (error) {
        console.warn(`Failed to parse tool in ${file.path}:`, error);
      }
    }

    // Parse prompts
    const promptBlocks = this.extractJsonBlocks(file.content, '@prompt');
    for (const block of promptBlocks) {
      try {
        const promptData = this.parseJSON(block);
        if (promptData) {
          components.push({
            type: 'prompt',
            data: promptData as MCPPrompt,
          });
        }
      } catch (error) {
        console.warn(`Failed to parse prompt in ${file.path}:`, error);
      }
    }

    // Parse resources
    const resourceBlocks = this.extractJsonBlocks(file.content, '@resource');
    for (const block of resourceBlocks) {
      try {
        const resourceData = this.parseJSON(block);
        if (resourceData) {
          components.push({
            type: 'resource',
            data: resourceData as MCPResource,
          });
        }
      } catch (error) {
        console.warn(`Failed to parse resource in ${file.path}:`, error);
      }
    }

    return components;
  }

  private parseJSON(jsonStr: string): any {
    // Remove single-line and multi-line comments
    let cleaned = jsonStr
      .replace(/\/\/.*?$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .trim();

    // Remove trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    // Fix unquoted keys (only at the start of a line or after {,)
    cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

    // Replace single quotes with double quotes
    cleaned = cleaned.replace(/'/g, '"');

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      // Log for debugging
      console.warn('Failed to parse JSON after cleaning:', cleaned);
      throw error;
    }
  }

  private validateComponent(component: MCPComponent): boolean {
    switch (component.type) {
      case 'tool':
        return this.validateTool(component.data as MCPTool);
      case 'prompt':
        return this.validatePrompt(component.data as MCPPrompt);
      case 'resource':
        return this.validateResource(component.data as MCPResource);
      default:
        return false;
    }
  }

  private validateTool(tool: MCPTool): boolean {
    return (
      typeof tool.name === 'string' &&
      typeof tool.description === 'string' &&
      typeof tool.parameters === 'object' &&
      typeof tool.parameters.type === 'string' &&
      typeof tool.parameters.properties === 'object' &&
      Array.isArray(tool.parameters.required)
    );
  }

  private validatePrompt(prompt: MCPPrompt): boolean {
    return (
      typeof prompt.name === 'string' &&
      typeof prompt.description === 'string' &&
      typeof prompt.template === 'string' &&
      Array.isArray(prompt.variables)
    );
  }

  private validateResource(resource: MCPResource): boolean {
    return (
      typeof resource.name === 'string' &&
      typeof resource.type === 'string' &&
      typeof resource.path === 'string'
    );
  }

  private analyzeRelationships(
    content: string,
    tools: MCPTool[],
    prompts: MCPPrompt[],
    resources: MCPResource[],
    toolToPrompt: Map<string, string[]>,
    promptToResource: Map<string, string[]>,
    toolToResource: Map<string, string[]>
  ): void {
    // Analyze tool to prompt relationships
    for (const tool of tools) {
      const toolPrompts = this.findReferences(content, tool.name, prompts, MCPParser.PROMPT_REF_PATTERN);
      if (toolPrompts.length > 0) {
        toolToPrompt.set(tool.name, toolPrompts.map(p => p.name));
      }

      // Analyze tool to resource relationships
      const toolResources = this.findReferences(content, tool.name, resources, MCPParser.RESOURCE_REF_PATTERN);
      if (toolResources.length > 0) {
        toolToResource.set(tool.name, toolResources.map(r => r.name));
      }
    }

    // Analyze prompt to resource relationships
    for (const prompt of prompts) {
      const promptResources = this.findReferences(content, prompt.name, resources, MCPParser.RESOURCE_REF_PATTERN);
      if (promptResources.length > 0) {
        promptToResource.set(prompt.name, promptResources.map(r => r.name));
      }
    }
  }

  private findReferences<T extends { name: string }>(
    content: string,
    sourceName: string,
    targets: T[],
    pattern: RegExp
  ): T[] {
    const references = new Set<string>();
    const matches = content.matchAll(pattern);
    
    for (const match of matches) {
      const refName = match[1];
      if (content.includes(`@${sourceName}`) && content.includes(`@${refName}`)) {
        references.add(refName);
      }
    }

    return targets.filter(target => references.has(target.name));
  }
} 