# kaiburr-assessment-frontend

A modern React TypeScript frontend for managing and executing shell commands with a beautiful, responsive UI built with Ant Design.

# Features:
Task Management: Create, edit, delete, and view tasks

Command Execution: Execute shell commands and view real-time output

Search & Filter: Find tasks quickly with live search

Execution History: Track all command executions with timestamps

Responsive Design: Works seamlessly on desktop

Modern UI: Clean interface built with Ant Design components

# Technologies Used
React 18 with TypeScript
Ant Design for UI components
Axios for API communication
React Hooks for state management
CSS3 for custom styling

# Prerequisites

Node.js (v16 or higher)
npm or yarn
Backend API running on `http://localhost:8080`


# Backend Integration

This frontend connects to the Kaiburr Task Manager backend API. Make sure the backend is running on `http://localhost:8080`.

**Backend Repository**: https://github.com/kaushik-r03/kaiburr-assessment-backend

# Usage
1. Create Tasks: Click "Create Task" to add new shell commands
2. Search: Use the search bar to find specific tasks
3. Execute: Click the play button to run commands
4. View History: Click "View History" to see execution logs
5. Edit/Delete: Use action buttons to modify tasks

# Available Scripts
`npm start` - Runs the app in development mode
`npm test` - Launches the test runner
`npm run build` - Builds the app for production
`npm run eject` - Ejects from Create React App

# Customization
The UI theme and colors can be customized in:
`src/App.css` - Global styles
Component-level styling in individual `.tsx` files
