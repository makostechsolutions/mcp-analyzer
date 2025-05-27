import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import type { Node, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { Tooltip, Box } from '@chakra-ui/react';

// Types for props
interface MCPGraphProps {
  tools: any[];
  prompts: any[];
  resources: any[];
  relationships: Record<string, Record<string, string[]>>;
}

// Node color mapping
const nodeColors: Record<string, string> = {
  tool: '#3182ce',      // blue
  prompt: '#38a169',    // green
  resource: '#ed8936',  // orange
};

// Custom node components with tooltips
const ToolNode: React.FC<NodeProps> = ({ data }) => (
  <Tooltip label={data.description || 'No description'} hasArrow placement="top">
    <Box p={2} borderRadius="md" bg={nodeColors.tool} color="white" border="2px solid #2b6cb0" minW="100px" textAlign="center">
      {data.label}
    </Box>
  </Tooltip>
);
const PromptNode: React.FC<NodeProps> = ({ data }) => (
  <Tooltip label={data.description || 'No description'} hasArrow placement="top">
    <Box p={2} borderRadius="md" bg={nodeColors.prompt} color="white" border="2px solid #2f855a" minW="100px" textAlign="center">
      {data.label}
    </Box>
  </Tooltip>
);
const ResourceNode: React.FC<NodeProps> = ({ data }) => (
  <Tooltip label={data.description || 'No description'} hasArrow placement="top">
    <Box p={2} borderRadius="md" bg={nodeColors.resource} color="white" border="2px solid #c05621" minW="100px" textAlign="center">
      {data.label}
    </Box>
  </Tooltip>
);

const nodeTypes = {
  tool: ToolNode,
  prompt: PromptNode,
  resource: ResourceNode,
};

// Helper to generate nodes and edges from MCP data
function generateGraphElements({ tools, prompts, resources, relationships }: MCPGraphProps) {
  const nodes: Node[] = [];
  const edges: any[] = [];
  let id = 0;

  // Add tool nodes
  tools.forEach((tool, i) => {
    nodes.push({
      id: `tool-${i}`,
      data: { label: tool.name, description: tool.description },
      position: { x: 0, y: i * 100 },
      type: 'tool',
    });
  });
  // Add prompt nodes
  prompts.forEach((prompt, i) => {
    nodes.push({
      id: `prompt-${i}`,
      data: { label: prompt.name, description: prompt.description },
      position: { x: 300, y: i * 100 },
      type: 'prompt',
    });
  });
  // Add resource nodes
  resources.forEach((resource, i) => {
    nodes.push({
      id: `resource-${i}`,
      data: { label: resource.name, description: resource.description || resource.path },
      position: { x: 600, y: i * 100 },
      type: 'resource',
    });
  });

  // Add edges for relationships (prompt uses tool/resource)
  Object.entries(relationships).forEach(([fromType, rels]) => {
    Object.entries(rels).forEach(([fromName, targets]) => {
      targets.forEach((target) => {
        // Find node ids
        const fromId = nodes.find(n => n.data.label === fromName)?.id;
        const toId = nodes.find(n => n.data.label === target)?.id;
        if (fromId && toId) {
          edges.push({ id: `e${id++}`, source: fromId, target: toId });
        }
      });
    });
  });

  return { nodes, edges };
}

const MCPGraph: React.FC<MCPGraphProps> = ({ tools, prompts, resources, relationships }) => {
  const { nodes, edges } = generateGraphElements({ tools, prompts, resources, relationships });
  return (
    <div style={{ width: '100%', height: 400, background: '#222', borderRadius: 8 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView nodeTypes={nodeTypes}>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default MCPGraph; 