import { MCPParser } from '../mcpParser';
import type { FileContent } from '../../../types/github';

describe('MCPParser', () => {
  let parser: MCPParser;

  beforeEach(() => {
    parser = new MCPParser();
  });

  describe('parseRepository', () => {
    it('should parse tools, prompts, and resources from files', () => {
      const files: FileContent[] = [
        {
          path: 'test1.ts',
          content: `
            @tool{
              "name": "testTool",
              "description": "A test tool",
              "parameters": {
                "type": "object",
                "properties": {
                  "param1": {
                    "type": "string",
                    "description": "Test parameter"
                  }
                },
                "required": ["param1"]
              }
            }

            @prompt{
              "name": "testPrompt",
              "description": "A test prompt",
              "template": "Hello {{name}}!",
              "variables": ["name"]
            }

            @resource{
              "name": "testResource",
              "type": "file",
              "path": "/test/path"
            }
          `,
          sha: 'abc123'
        }
      ];

      const result = parser.parseRepository(files);

      expect(result.tools).toHaveLength(1);
      expect(result.prompts).toHaveLength(1);
      expect(result.resources).toHaveLength(1);

      expect(result.tools[0].name).toBe('testTool');
      expect(result.prompts[0].name).toBe('testPrompt');
      expect(result.resources[0].name).toBe('testResource');
    });

    it('should handle invalid JSON gracefully', () => {
      const files: FileContent[] = [
        {
          path: 'test2.ts',
          content: `
            @tool{
              name: "invalidTool", // Invalid JSON
              description: "An invalid tool"
            }
          `,
          sha: 'def456'
        }
      ];

      const result = parser.parseRepository(files);

      expect(result.tools).toHaveLength(0);
      expect(result.prompts).toHaveLength(0);
      expect(result.resources).toHaveLength(0);
    });

    it('should detect relationships between components', () => {
      const files: FileContent[] = [
        {
          path: 'test3.ts',
          content: `
            @tool{
              "name": "tool1",
              "description": "Tool 1",
              "parameters": {
                "type": "object",
                "properties": {},
                "required": []
              }
            }

            @prompt{
              "name": "prompt1",
              "description": "Prompt 1",
              "template": "Test",
              "variables": []
            }

            @resource{
              "name": "resource1",
              "type": "file",
              "path": "/test"
            }

            // Usage
            @tool1() {
              @prompt1 {
                @resource1[path]
              }
            }
          `,
          sha: 'ghi789'
        }
      ];

      const result = parser.parseRepository(files);

      expect(result.relationships.toolToPrompt.get('tool1')).toContain('prompt1');
      expect(result.relationships.promptToResource.get('prompt1')).toContain('resource1');
      expect(result.relationships.toolToResource.get('tool1')).toContain('resource1');
    });

    it('should handle multiline JSON with comments', () => {
      const files: FileContent[] = [
        {
          path: 'test4.ts',
          content: `
            @tool{
              // This is a comment
              "name": "multilineTool",
              "description": "A tool with multiline JSON",
              "parameters": {
                "type": "object",
                "properties": {
                  "param1": {
                    "type": "string",
                    "description": "Test parameter"
                  }
                },
                "required": ["param1"]
              }
            }
          `,
          sha: 'jkl012'
        }
      ];

      const result = parser.parseRepository(files);

      expect(result.tools).toHaveLength(1);
      expect(result.tools[0].name).toBe('multilineTool');
    });
  });
}); 