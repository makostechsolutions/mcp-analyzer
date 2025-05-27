# MCP Analyzer Architecture

## Overview
MCP Analyzer is a modular React application designed to parse, validate, and visualize code annotated with the Modular Code Protocol (MCP). The architecture emphasizes separation of concerns, testability, and extensibility, making it easy to maintain and expand.

---

## Main Modules & Responsibilities

### 1. **UI Components (`src/components/`)**
- **analysis/**: Main analysis workflow, input forms, results display, and graph visualization.
- **repository/**: Handles repository input and integration.
- **common/**: Shared UI elements (buttons, alerts, etc.).

### 2. **Services (`src/services/`)**
- **parser/**: Contains the MCP parser, which extracts and validates MCP blocks (tools, prompts, resources) from code.
- **github/**: Handles GitHub API integration, fetching repository metadata and file contents.
- **(Planned) analyzer/**: Intended as a coordination layer to combine parsing, validation, and relationship analysis into a single service for the UI.

### 3. **Types (`src/types/`)**
- Centralized TypeScript type definitions for MCP blocks, repository data, and service interfaces.

### 4. **Utils & Hooks (`src/utils/`, `src/hooks/`)**
- Utility functions and custom React hooks for code reuse and cleaner components.

### 5. **Testing (`__tests__` folders)**
- Unit and integration tests for services and core logic, colocated for clarity.

---

## Data Flow

1. **User Input**
    - User pastes code or enters a GitHub repo URL.
2. **Repository Fetch (if applicable)**
    - `GitHubService` fetches repo metadata and file contents.
3. **Parsing & Validation**
    - `MCPParser` extracts MCP blocks and validates their structure.
4. **Analysis**
    - Relationships between tools, prompts, and resources are detected.
    - Errors are collected for invalid blocks.
5. **Results Aggregation**
    - Parsed data, relationships, and errors are returned to the UI.
6. **Visualization**
    - Results are displayed in lists and as an interactive graph (React Flow).
    - Errors are shown in a detailed alert.
7. **Export/Share**
    - Users can export results as JSON.

---

## Key Design Decisions

- **Separation of Concerns:** Parsing, validation, data fetching, and UI are handled in distinct modules/services.
- **Extensibility:** New MCP block types or analysis features can be added with minimal changes to the core architecture.
- **Modern UI/UX:** Chakra UI and React Flow provide a clean, interactive user experience.
- **Testability:** Core logic is covered by unit tests, and the service layer is designed for easy mocking.
- **Error Feedback:** Validation errors are surfaced to users with detailed context for debugging.

---

## Technology Choices
- **React** for UI
- **Chakra UI** for styling and layout
- **React Flow** for graph visualization
- **Octokit** for GitHub API integration
- **TypeScript** for type safety
- **Jest** for testing

---

## Future Directions
- Implement a dedicated `analyzer` service to further abstract and coordinate parsing, validation, and relationship analysis.
- Add support for private repositories and authentication.
- Expand graph interactivity and validation feedback.
- Modularize error handling and reporting for more granular feedback. 