# MCP Analyzer Architecture

## Overview
MCP Analyzer is a modular React application designed to parse, validate, and visualize code annotated with the Modular Code Protocol (MCP). The architecture emphasizes separation of concerns, testability, and extensibility, making it easy to maintain and expand.

---

## Main Modules & Responsibilities

### 1. **UI Components (`src/components/`)**
- **MCPDemo.tsx**: Main demo component that orchestrates the analysis workflow
- **MCPGraph.tsx**: Graph visualization component using React Flow
- **MCPResults.tsx**: Results display component showing parsed data and errors
- **RepoOrPasteInput.tsx**: Input component for repository URL or code paste

### 2. **Services (`src/services/`)**
- **parser/**: Contains the MCP parser, which extracts and validates MCP blocks (tools, prompts, resources) from code.
- **github/**: Handles GitHub API integration, fetching repository metadata and file contents.
- **analyzer/**: Coordinates parsing, validation, and relationship analysis into a single service for the UI.

### 3. **Types (`src/types/`)**
- Centralized TypeScript type definitions for MCP blocks, repository data, and service interfaces.

### 4. **Testing (`tests/`)**
- Unit and integration tests for services and core logic.

---

## Data Flow

1. **User Input**
    - User selects input method (GitHub repo or code paste) via tab interface
    - Input is collected through `RepoOrPasteInput` component

2. **Repository Fetch (if applicable)**
    - `GitHubService` fetches repo metadata and file contents
    - Files are filtered for relevant content

3. **Parsing & Validation**
    - `MCPParser` extracts MCP blocks from code
    - Each block is validated against its schema
    - Validation errors are collected

4. **Analysis & Results Aggregation**
    - `AnalyzerService` processes parsed blocks
    - Relationships between tools, prompts, and resources are identified
    - Results are structured for visualization

5. **Visualization**
    - `MCPGraph` renders the relationship graph using React Flow
    - `MCPResults` displays parsed data and validation errors
    - Interactive elements allow for detailed exploration

6. **Export/Share**
    - Results can be exported as JSON for sharing or further analysis

---

## Key Design Decisions

- **Component-Based Architecture**: Each major feature is encapsulated in its own component
- **Service Layer**: Core functionality is abstracted into services for better testability and reusability
- **Type Safety**: Comprehensive TypeScript types ensure data consistency
- **Error Handling**: Validation errors are collected and displayed with context
- **Responsive Design**: Chakra UI provides a consistent, responsive interface

---

## Technology Stack
- **React** for UI components
- **Chakra UI** for styling and layout
- **React Flow** for graph visualization
- **Octokit** for GitHub API integration
- **TypeScript** for type safety
- **Jest** for testing
- **Vite** for build and development

---

## Future Enhancements

### UI/UX Improvements
- Enhanced graph interactivity with node click details and expanded tooltips
- Edge customization with relationship type indicators and validation feedback
- Repository file browsing interface with MCP block preview
- Real-time validation feedback during code input with inline suggestions
- Dark/light theme support with persistent user preferences
- Responsive design optimizations for mobile devices

### Feature Extensions
- Support for private repositories with GitHub authentication
- Batch analysis of multiple repositories
- Custom MCP block type definitions and validation rules
- Export/import of analysis configurations
- Integration with CI/CD pipelines for automated MCP validation
- Support for different MCP versions and migration tools

### Analysis Capabilities
- Advanced relationship analysis between MCP blocks
- Dependency graph visualization with version information
- Impact analysis for MCP block changes
- Code quality metrics for MCP implementations
- Automated suggestions for MCP block improvements
- Historical analysis of MCP usage in repositories

### Technical Improvements
- Performance optimizations for large codebases
- Caching layer for repository data and analysis results
- WebSocket support for real-time updates
- Plugin system for custom analyzers and visualizations
- API endpoints for programmatic access
- Comprehensive test coverage with E2E tests

### Documentation & Community
- Interactive MCP documentation with examples
- Community-contributed MCP block templates
- Best practices guide for MCP implementation
- Integration guides for popular IDEs
- Contribution guidelines and development setup
- Regular updates and maintenance schedule

### Security & Compliance
- Security scanning for MCP blocks
- Compliance checking against MCP standards
- Access control for private repositories
- Audit logging for analysis operations
- Data retention policies
- Privacy-focused features 