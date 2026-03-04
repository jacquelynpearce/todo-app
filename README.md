# Todo App

A to-do list web app built with React and TypeScript, with end-to-end tests written in Playwright. Built using a TDD (test-driven development) approach — tests were written before the implementation.

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) — dev server and bundler
- [Playwright](https://playwright.dev) — end-to-end testing

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher

## Getting started

```bash
git clone https://github.com/jacquelynpearce/todo-app.git
cd todo-app
npm install
```

## Running the app

```bash
npm run dev
```

Opens at http://localhost:5173

## Running tests

```bash
# Headless
npm test

# Interactive UI mode
npm run test:ui
```

## Features

- Add, complete, and delete tasks
- Filter by All / Active / Completed
- See active and total task counts
- Multiple named lists with independent tasks
