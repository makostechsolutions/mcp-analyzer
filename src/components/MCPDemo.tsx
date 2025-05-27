import React, { useState } from 'react';
import { Box, Flex, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { MCPParser } from '../services/parser/mcpParser';
import { GitHubService } from '../services/github/githubService';
import type { FileContent } from '../types/github';
import RepoOrPasteInput from './RepoOrPasteInput';
import MCPResults from './MCPResults';

const MCPDemo: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (data: any) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      if (data.type === 'paste') {
        const parser = new MCPParser();
        const files: FileContent[] = [
          { path: 'input.ts', content: data.code, sha: 'demo' }
        ];
        const parsed = parser.parseRepository(files);
        setResult(parsed);
      } else if (data.type === 'repo') {
        const match = data.repoUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?)/);
        if (!match) throw new Error('Invalid GitHub repo URL');
        const owner = match[1];
        const repo = match[2];
        const branch = data.branch || undefined;
        const gh = new GitHubService();
        const repoData = await gh.fetchRepository({ owner, repo, branch });
        const parser = new MCPParser();
        const parsed = parser.parseRepository(repoData.files);
        setResult(parsed);
      }
    } catch (e: any) {
      setError(e.message || 'Analysis error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <Flex w="100vw" minH="100vh" direction="column" align="center" justify="flex-start" bg="gray.900">
      <VStack gap={8} align="stretch" w="50vw" maxW="900px" mt={12}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2} color="white">
            MCP Analyzer
          </Heading>
          <Text fontSize="lg" color="white" >
            Analyze and visualize MCP-annotated code
          </Text>
        </Box>
        {!result && <RepoOrPasteInput onSubmit={handleInputSubmit} isLoading={loading} />}
        {error && <Text color="red.400">{error}</Text>}
        {result && (
          <>
            <Button onClick={handleReset} colorScheme="gray" alignSelf="flex-start" mb={4}>
              &larr; Back
            </Button>
            <MCPResults result={result} />
          </>
        )}
      </VStack>
    </Flex>
  );
};

export default MCPDemo; 