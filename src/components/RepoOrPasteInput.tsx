import React, { useState } from 'react';
import { Box, Button, Input, Textarea, Tabs, TabList, TabPanels, Tab, TabPanel, Stack, FormLabel } from '@chakra-ui/react';

interface RepoOrPasteInputProps {
  onSubmit: (data: { type: 'repo', repoUrl: string, branch?: string } | { type: 'paste', code: string }) => void;
  isLoading?: boolean;
}

const RepoOrPasteInput: React.FC<RepoOrPasteInputProps> = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [code, setCode] = useState('');

  return (
    <Box w="100%" p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="gray.900">
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab color="white">GitHub Repo</Tab>
          <Tab color="white">Paste Code</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack spacing={3}>
              <FormLabel color="white">GitHub Repository URL</FormLabel>
              <Input
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                color="white"
                bg="gray.800"
              />
              <FormLabel color="white">Branch (optional)</FormLabel>
              <Input
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="main"
                color="white"
                bg="gray.800"
              />
              <Button
                colorScheme="blue"
                onClick={() => onSubmit({ type: 'repo', repoUrl, branch: branch || undefined })}
                isLoading={isLoading}
                isDisabled={!repoUrl}
              >
                Analyze Repo
              </Button>
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack spacing={3}>
              <FormLabel color="white">Paste MCP-annotated code</FormLabel>
              <Textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste MCP-annotated code here..."
                rows={10}
                color="white"
                bg="gray.800"
                fontFamily="mono"
              />
              <Button
                colorScheme="blue"
                onClick={() => onSubmit({ type: 'paste', code })}
                isLoading={isLoading}
                isDisabled={!code}
              >
                Analyze Code
              </Button>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default RepoOrPasteInput; 