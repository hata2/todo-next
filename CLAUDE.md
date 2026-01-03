# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A simple TODO list application built with Next.js 15, React 19, and TypeScript. The app allows users to manage tasks with due dates and tracks overdue items.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

**Framework**: Next.js 15 App Router architecture
- Uses the `app/` directory structure (not `pages/`)
- Client-side components only (no server components currently used)

**State Management**:
- All state is managed with React's `useState` hook in `app/page.tsx`
- No external state management library
- State is ephemeral (resets on page reload - no persistence)

**Data Model** (app/page.tsx:5-10):
```typescript
interface Todo {
  id: number;        // Generated from Date.now()
  text: string;
  completed: boolean;
  dueDate?: string;  // Optional ISO date string
}
```

**Key Components**:
- `app/page.tsx`: Main TODO component with all UI and logic (client component)
- `app/layout.tsx`: Root layout with metadata and Japanese locale
- `app/globals.css`: Tailwind CSS directives only

**Styling**:
- Tailwind CSS for all styling
- No custom CSS classes beyond Tailwind utilities
- Color scheme: indigo accent colors with gradient background
- Overdue tasks get red background (`bg-red-50`) and red text

**Overdue Logic** (app/page.tsx:96):
- Tasks are overdue if: `dueDate exists AND not completed AND dueDate < today`
- Date comparison uses `new Date(new Date().toDateString())` to compare dates only (ignoring time)

## Tech Stack

- Next.js 15.1.0
- React 19.0.0
- TypeScript 5
- Tailwind CSS 3.4.1
- ESLint with next config
