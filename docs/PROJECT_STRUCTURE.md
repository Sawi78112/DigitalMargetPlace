# Digital Market Place - Next.js Project Structure

## Project Overview

This is a Next.js 15 project using the App Router architecture, TypeScript, and Tailwind CSS. The project follows modern Next.js conventions and best practices.

## Directory Structure

```
Next/web/
├── docs/                           # Documentation files
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── DEVELOPMENT_GUIDE.md        # Development guidelines
│   └── COMPARISON_WITH_SVELTE.md   # Svelte vs Next.js comparison
├── public/                         # Static assets
│   ├── favicon.svg                # Site icon
│   ├── img/                       # Images
│   └── user.png                   # User avatar placeholder
├── src/                           # Source code
│   ├── app/                       # Next.js App Router (main application)
│   │   ├── (app)/                 # Protected app routes group
│   │   │   ├── _components/       # App-specific components
│   │   │   │   └── app-sidebar.tsx
│   │   │   ├── home/             # Home page
│   │   │   ├── products/         # Products management
│   │   │   ├── store/            # Store management
│   │   │   ├── settings/         # User settings
│   │   │   ├── layout.tsx        # App layout with sidebar
│   │   │   └── middleware.tsx    # Authentication guard
│   │   ├── (auth)/               # Authentication routes group
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   ├── forgot-password/ # Password recovery
│   │   │   ├── layout.tsx       # Auth layout
│   │   │   └── u/               # User verification
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx            # Root page (redirects)
│   │   └── globals.css         # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── auth/               # Authentication forms
│   │   ├── header/             # Header components
│   │   └── icons/              # Icon components
│   └── lib/                    # Utilities and configuration
│       ├── api/               # API utilities
│       ├── auth/              # Authentication logic
│       ├── hooks/             # Custom React hooks
│       ├── providers/         # Context providers
│       ├── types.ts           # TypeScript types
│       └── utils.ts           # Utility functions
├── package.json               # Dependencies and scripts
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Directories Explained

### `/src/app/` - Next.js App Router
- **Purpose**: Contains all pages, layouts, and route-specific logic
- **Route Groups**: 
  - `(app)` - Protected application routes requiring authentication
  - `(auth)` - Public authentication routes
- **Special Files**:
  - `layout.tsx` - Defines UI shared across routes
  - `page.tsx` - Makes routes publicly accessible
  - `middleware.tsx` - Custom middleware for route protection

### `/src/components/` - Reusable Components
- **Purpose**: Shared UI components used across the application
- **Structure**:
  - `ui/` - Base UI components (buttons, inputs, etc.)
  - `auth/` - Authentication-specific components
  - `header/` - Navigation and header components
  - `icons/` - SVG icon components

### `/src/lib/` - Utilities & Configuration
- **Purpose**: Non-UI code, utilities, and configuration
- **Contents**:
  - API functions and HTTP clients
  - Authentication logic and token management
  - Custom React hooks
  - TypeScript type definitions
  - Utility functions and helpers
  - Context providers

### `/src/app/(app)/_components/` - App-Specific Components
- **Purpose**: Components specific to the main application
- **Why Here**: These components are tightly coupled to the app layout and not reusable elsewhere

## Architecture Principles

### 1. **Separation of Concerns**
- UI components in `/components/`
- Business logic in `/lib/`
- Page layouts in `/app/`

### 2. **Route Organization**
- Route groups for logical separation
- Co-located components with their routes
- Clear public vs. protected route distinction

### 3. **Type Safety**
- Comprehensive TypeScript types in `/lib/types.ts`
- Strict type checking enabled
- Props interfaces for all components

### 4. **Modern Next.js Patterns**
- App Router (not Pages Router)
- Server Components by default
- Client Components only when needed
- Proper metadata and SEO handling

## File Naming Conventions

- **Components**: PascalCase (e.g., `AppSidebar.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: PascalCase interfaces (e.g., `User`, `AuthState`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`)

## Import Patterns

```typescript
// External libraries
import React from 'react'
import { NextRouter } from 'next/router'

// Internal utilities and types
import { cn } from '@/lib/utils'
import type { User } from '@/lib/types'

// Components
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

// Relative imports for co-located files
import { AppSidebar } from './_components/app-sidebar'
```

## Styling Strategy

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: For theme customization
- **Component Variants**: Using `cn()` utility for conditional classes
- **Global Styles**: Minimal global CSS in `globals.css`

This structure supports maintainability and scalability while following Next.js best practices. 