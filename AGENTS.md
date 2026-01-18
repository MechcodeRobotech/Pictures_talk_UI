# AGENTS.md

This file provides guidelines for AI coding agents working in this repository.

## Build & Run Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

**Note:** No testing framework is currently configured. To add tests, set up Vitest or Jest.

## Project Overview

This is a bilingual (English/Thai) React application built with:
- **Build Tool:** Vite 6.2.0
- **Framework:** React 19.2.3 with TypeScript 5.8.2
- **Styling:** styled-components
- **Routing:** React Router 7.11.0
- **Auth:** Clerk
- **Canvas:** Fabric.js 6.7.1
- **Icons:** Heroicons

## Code Style Guidelines

### File & Naming Conventions

**Components & Directories:**
- Component files: `PascalCase.tsx` (e.g., `Header.tsx`, `Sidebar.tsx`)
- Directory names: `PascalCase` (e.g., `Canvas/`, `Common/`, `Sidebar/`)
- Component names: PascalCase (e.g., `Header`, `SidebarMenu`)

**Constants & Variables:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `COLORS`, `HEADER_HEIGHT_PX`)
- Variables/functions: `camelCase` (e.g., `toggleTheme`, `isDarkMode`)
- CSS constants: `UPPER_SNAKE_CASE` with type suffix (e.g., `HEADER_HEIGHT_PX`, `COLOR_PRIMARY`)

**Types:**
- Interfaces: `PascalCase` (e.g., `SidebarProps`, `CanvasStageHandle`)
- Type aliases: `PascalCase` (e.g., `Theme`, `Lang`, `DragPayload`)
- Enums: `PascalCase` (e.g., `Tool`)

**Component Props:**
- Define prop interfaces immediately before component
- Name props descriptively: `isDarkMode`, `toggleTheme`, `onToggleProperties`

### Import Order

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import styled from 'styled-components';
import { useClerk } from '@clerk/clerk-react';
import * as fabric from 'fabric';

// 3. Local imports (relative paths)
import { useLanguage } from '../../LanguageContext';
import SidebarMenu from '../Sidebar/SidebarMenu';
```

### Component Structure

```typescript
// 1. Import statements
import React from 'react';
import styled from 'styled-components';

// 2. Type definitions
interface Props {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// 3. Constants (dimensions, colors, etc.)
const HEADER_HEIGHT_PX = 88;
const COLOR_PRIMARY = '#F8AF24';

// 4. Styled components
const StyledContainer = styled.div`
  display: flex;
  height: ${HEADER_HEIGHT_PX}px;
`;

// 5. Component implementation
const Component: React.FC<Props> = ({ isDarkMode, toggleTheme }) => {
  // hooks, state, effects
  const [value, setValue] = useState<string>('');

  return <StyledContainer>{/* JSX */}</StyledContainer>;
};

export default Component;
```

### TypeScript Guidelines

- Always use `React.FC<T>` for function components with typed props
- Use `React.forwardRef` when exposing imperative handles
- Define types for complex data structures (unions, records, etc.)
- Use enums for fixed sets of options
- Use type guards for runtime type checking when needed

### Styled Components

- Define constants for all dimensions (with `_PX` suffix)
- Define constants for colors with descriptive names
- Use responsive breakpoints in styled components
- Support both light and dark themes via className prop
- Example:
  ```typescript
  const Container = styled.div`
    background: ${COLOR_PRIMARY};

    @media (min-width: ${BREAKPOINT_MD_PX}px) {
      padding: 0 32px;
    }

    &.dark {
      background: #242526;
    }
  `;
  ```

### State Management

- Use React Context for global state (see `LanguageContext.tsx`)
- Use useState for local component state
- Use useEffect for side effects
- Create custom hooks for reusable logic
- Use `useMemo` for expensive computations
- Use `useCallback` for memoized callbacks

### Error Handling

- Check for null/undefined before accessing properties
- Throw descriptive errors for missing critical dependencies
- Example:
  ```typescript
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }
  ```

### Internationalization

- Use the `useLanguage()` hook from `LanguageContext`
- Add new translations to `TRANSLATIONS` object in `src/pages/constants.ts`
- Translation keys: `snake_case`
- Always use the `t()` function for user-facing text

### Path Aliases

- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Prefer relative imports for closely related files
- Example: `import { Theme } from '../types'` not `import { Theme } from '@/types'`

### Component Organization

- **Pages:** `src/pages/` (e.g., `Canvas.tsx`, `Home.tsx`)
- **Components:** Organized by feature in `src/components/`
- **Types:** Centralized in `src/types.ts`
- **Constants:** Page-specific in `src/pages/constants.ts`
- **Context:** `src/LanguageContext.tsx`

### Additional Guidelines

- Use `className` for conditional styling (light/dark mode)
- Always clean up effects (subscriptions, timers, etc.)
- Use refs for imperative DOM manipulation
- Keep components focused and reusable
- Add prop destructuring in component signature
- Export default for main component exports
- Use JSX elements for icons (Heroicons)

### Environment Variables

- Store in `.env.local` (gitignored)
- Access via `import.meta.env.VITE_...`
- Required: `VITE_CLERK_PUBLISHABLE_KEY`, `GEMINI_API_KEY`
- Never commit `.env`, `.env.local` files
