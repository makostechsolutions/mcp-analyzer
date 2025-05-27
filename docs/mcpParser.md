# MCPParser Breakdown

This document explains, in simple terms, what each function in the `MCPParser` class does.

---

## 1. `parseRepository(files)`
**What it does:**
- Looks through a bunch of files to find special code blocks (called MCP blocks) that start with `@tool`, `@prompt`, or `@resource`.
- Checks if these blocks are written correctly.
- Collects all the good ones and remembers any mistakes.
- Figures out how the different blocks are connected (like which tool uses which prompt or resource).
- Gives you a big summary of everything it found and any problems it saw.

---

## 2. `parseBlocks(files, annotation, validate, type, collector)`
**What it does:**
- Helps `parseRepository` by doing the hard work of finding and checking blocks of a certain type (like all the `@tool` blocks).
- For each file, it looks for blocks that start with the given annotation (like `@tool`).
- Tries to turn each block into a real object (using JSON).
- Checks if the object is valid using a special checker.
- If it's good, it saves it; if not, it writes down what went wrong.

---

## 3. `extractJsonBlocks(content, annotation)`
**What it does:**
- Searches through a piece of code to find all the parts that start with something like `@tool{ ... }`.
- Makes sure it grabs the whole block, even if there are lots of curly braces inside.
- Returns a list of all the blocks it found.

---

## 4. `parseJSON(jsonStr)`
**What it does:**
- Takes a chunk of text that looks like code and tries to turn it into a real object the computer can use.
- Cleans up the text first (removes comments, fixes quotes, etc.) so it's easier to understand.
- If it can't figure it out, it says what went wrong.

---

## 5. `validateTool(tool)`
**What it does:**
- Checks if a tool block has all the right pieces (like a name, description, and parameters).
- Makes sure everything is the right type (like name is a string, parameters is an object, etc.).

---

## 6. `validatePrompt(prompt)`
**What it does:**
- Checks if a prompt block has all the right pieces (like a name, description, template, and variables).
- Makes sure everything is the right type.

---

## 7. `validateResource(resource)`
**What it does:**
- Checks if a resource block has all the right pieces (like a name, type, and path).
- Makes sure everything is the right type.

---

## 8. `analyzeRelationships(content, tools, prompts, resources, toolToPrompt, promptToResource, toolToResource)`
**What it does:**
- Looks at the code to see how tools, prompts, and resources are connected.
- Fills in maps that show which tool uses which prompt or resource, and which prompt uses which resource.

---

## 9. `findReferences(content, sourceName, targets, pattern)`
**What it does:**
- Helps `analyzeRelationships` by searching for places in the code where one block (like a tool) mentions another (like a prompt or resource).
- Returns a list of all the blocks that are referenced.

---

**In short:**
- The parser looks for special blocks in code, checks if they're written right, figures out how they're connected, and tells you what it found and what went wrong! 