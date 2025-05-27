export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
    }>;
    required: string[];
  };
}

export interface MCPPrompt {
  name: string;
  description: string;
  template: string;
  variables: string[];
}

export interface MCPResource {
  name: string;
  type: string;
  path: string;
  handler?: string;
}

export interface MCPComponent {
  type: 'tool' | 'prompt' | 'resource';
  data: MCPTool | MCPPrompt | MCPResource;
}

export interface MCPAnalysis {
  tools: MCPTool[];
  prompts: MCPPrompt[];
  resources: MCPResource[];
  relationships: {
    toolToPrompt: Map<string, string[]>;
    promptToResource: Map<string, string[]>;
    toolToResource: Map<string, string[]>;
  };
} 