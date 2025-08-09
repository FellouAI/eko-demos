# Eko Demos

This repository contains multiple demo projects showcasing the capabilities of the Eko AI framework across different environments and use cases.

## Projects Overview

### 🌐 Browser Extension Demo (`browser-extension-quickstart`)
A complete browser extension implementation demonstrating how to integrate Eko AI capabilities into browser environments. Features include:
- Background scripts and content injection
- React-based UI components with Ant Design
- Options and sidebar interfaces
- Complete TypeScript setup with Webpack bundling

### 🖥️ Node.js Demo (`browser-nodejs-demo`)
A Node.js application showcasing Eko AI's automation capabilities with browser control and file operations. This demo includes:
- Browser automation using Playwright
- File system operations
- AI-powered chat and task execution
- Support for multiple LLM providers (OpenAI, Anthropic)

### 🤖 Computer Use Demo (`eko-share-meeting-demo`)
An advanced demonstration of computer control and automation featuring:
- Screen capture and computer vision capabilities
- Desktop automation with robotjs
- Meeting sharing and collaboration features
- Canvas-based image processing
- Integration with various AI models

### 🔐 Web Login Auto-test (`web-demo-login-autotest`)
A React web application designed for testing automated login flows:
- Simple login form with validation
- Auto-testing capabilities
- Integration with Eko web framework
- Perfect for demonstrating web automation testing

## Getting Started

Each demo project has its own `package.json` and can be run independently. Navigate to any project directory and follow these general steps:

1. Install dependencies: `npm install` and `npx playwright install`
2. Build the project: `npm run build`
3. Run the demo: `npm start` or `npm run dev`

## Prerequisites

- Node.js (version 18 or higher recommended)
- For browser extension: Chrome/Chromium browser
- For computer use demo: Desktop environment with screen access
- API keys for LLM providers (OpenAI, Anthropic, OpenRouter)
