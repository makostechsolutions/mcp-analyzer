# MCP Analyzer

MCP Analyzer is a modern React application for analyzing code annotated with the Modular Code Protocol (MCP) standard. It enables users to parse, validate, and visualize MCP blocks from pasted code or GitHub repositories, providing a clear overview of tools, prompts, and resources in a project.

## Features

- **MCP Parsing:** Extracts and validates MCP-annotated blocks (tools, prompts, resources) from code.
- **Repository Integration:** Analyze public GitHub repositories for MCP blocks.
- **Graph Visualization:** Visualizes tools, prompts, and resources as a graph with color-coded nodes and tooltips.
- **Export/Share:** Export parsed results as JSON.
- **Error Feedback:** Displays detailed errors for invalid MCP blocks.
- **Modern UI:** Built with Chakra UI for a clean, responsive interface.

## Documentation
- [Architecture](./docs/ARCHITECTURE.md)
- [Implementation Notes: Plan vs. Actual](./docs/IMPLEMENTATION.md)
- [Reflection](./docs/REFLECTION.md)
- [MCP Parser](./docs/mcpParser.md)
- [Github Service](./docs/githubService.md)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
git clone git@github.com:makostechsolutions/mcp-analyzer.git
cd mcp-analyzer
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Running Tests
```bash
npm test
```

## Usage

### 1. Analyze Code
- Paste MCP-annotated code into the input area.
- Click **Analyze** to parse and visualize the code.

### 2. Analyze a GitHub Repository
- Switch to the **GitHub Repo** tab.
- Enter a public repository URL (must contain MCP annotations).
- Click **Analyze**.

### 3. View Results
- Parsed tools, prompts, and resources are listed.
- Errors are shown for invalid MCP blocks.
- The graph visualizes relationships between components.
- Hover nodes for tooltips; click to see details (if enabled).

### 4. Export Results
- Click **Export as JSON** to download the parsed results.

## MCP Annotation Example
```js
@tool{
  "name": "myTool",
  "description": "Does something",
  "parameters": {
    "type": "object",
    "properties": {
      "input": { "type": "string", "description": "Input value" }
    },
    "required": ["input"]
  }
}

@prompt{
  "name": "myPrompt",
  "description": "A prompt",
  "template": "Hello {{name}}!",
  "variables": ["name"]
}

@resource{
  "name": "myResource",
  "type": "file",
  "path": "/data/file.txt"
}
```

## Project Structure
```
src/
  components/
    MCPDemo.tsx        # Main demo component
    MCPGraph.tsx       # Graph visualization component
    MCPResults.tsx     # Results display component
    RepoOrPasteInput.tsx # Input component for repo or code paste
  services/
    analyzer/          # Analysis service - sudo code for future features
    github/            # GitHub API integration - tests included
    parser/            # MCP parsing and validation - tests included
  types/              # TypeScript types
  assets/             # Static assets
  App.tsx             # Main application component
  main.tsx            # Application entry point
  index.css           # Global styles

docs/                # Documentation
public/              # Public assets
```

## Contributing
1. Fork the repo and create a feature branch.
2. Add/fix code and tests.
3. Run `npm test` to ensure all tests pass.
4. Submit a pull request with a clear description.

## Future Enhancements
- Node click details in the graph
- Edge customization and validation feedback
- Repository file browsing
- Support for private repositories (with authentication)
- Improved MCP block validation and suggestions

## License

MIT
