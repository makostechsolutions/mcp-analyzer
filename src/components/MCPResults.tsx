import React from 'react';
import { Box, Heading, Stack, Code, Text, Button, Alert, AlertIcon } from '@chakra-ui/react';
import MCPGraph from './MCPGraph';

function mapToObj(map: any) {
  return map instanceof Map ? Object.fromEntries(Array.from(map.entries())) : map;
}

interface MCPResultsProps {
  result: any;
}

const MCPResults: React.FC<MCPResultsProps> = ({ result }) => {
  if (!result) return null;
  const relationshipsToDisplay = result
    ? Object.fromEntries(
        Object.entries(result.relationships).map(([k, v]) => [k, mapToObj(v)])
      )
    : {};

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcp-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
      <Button onClick={handleExportJSON} colorScheme="blue" mb={4} alignSelf="flex-start">
        Export as JSON
      </Button>
      {result.errors && result.errors.length > 0 && (
        <Box mb={4}>
          <Alert status="error" borderRadius="md" mb={2}>
            <AlertIcon />
            {`Found ${result.errors.length} invalid MCP block(s):`}
          </Alert>
          <Stack spacing={2}>
            {result.errors.map((err: any, idx: number) => (
              <Box key={idx} p={2} bg="red.900" borderRadius="md">
                <Text color="red.200" fontSize="sm" fontWeight="bold">
                  {err.type.toUpperCase()} in {err.file}
                </Text>
                <Text color="red.100" fontSize="sm" mb={1}>{err.error}</Text>
                <Code whiteSpace="pre-wrap" display="block" fontSize="xs" colorScheme="red">
                  {err.block}
                </Code>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      <Stack direction="column" gap={3} mt={4} align="stretch">
        <Box>
          <Heading size="sm" color="white">Tools</Heading>
          <Code whiteSpace="pre" display="block" p={2} mt={1}>
            {JSON.stringify(result.tools, null, 2)}
          </Code>
        </Box>
        <Box>
          <Heading size="sm" color="white">Prompts</Heading>
          <Code whiteSpace="pre" display="block" p={2} mt={1}>
            {JSON.stringify(result.prompts, null, 2)}
          </Code>
        </Box>
        <Box>
          <Heading size="sm" color="white">Resources</Heading>
          <Code whiteSpace="pre" display="block" p={2} mt={1}>
            {JSON.stringify(result.resources, null, 2)}
          </Code>
        </Box>
        <Box>
          <Heading size="sm" color="white">Relationships</Heading>
          <Code whiteSpace="pre" display="block" p={2} mt={1}>
            {JSON.stringify(relationshipsToDisplay, null, 2)}
          </Code>
        </Box>
        <Box>
          <Heading size="sm" color="white" mb={2}>Graph Visualization</Heading>
          <MCPGraph
            tools={result.tools}
            prompts={result.prompts}
            resources={result.resources}
            relationships={result.relationships}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default MCPResults; 