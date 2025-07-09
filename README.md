# Digital Market Place - Web

A modern web application for a digital marketplace built with SvelteKit.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 18 or higher)
- pnpm package manager

## Setup Instructions

### 1. Install pnpm

If you don't have pnpm installed globally, install it using one of the following methods:

```bash
# Using npm
npm install -g pnpm

# Using curl (recommended)
curl -fsSL https://get.pnpm.io/install.sh | sh

# Using Homebrew (macOS)
brew install pnpm
```

### 2. Install Dependencies

Once you have pnpm installed, install the project dependencies:

```bash
pnpm i
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the API endpoint:

```bash
touch .env
```

Add the following content to your `.env` file:

```properties
PUBLIC_API=https://api.digitalmartketplace.asia
```

### 4. Run the Development Server

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is already in use).

## Project Structure

### Root Directory

```
├── components.json      # Shadcn/ui component configuration
├── Dockerfile          # Docker container configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Project dependencies and scripts
├── pnpm-lock.yaml       # Lockfile for pnpm package manager
├── README.md            # Project documentation
├── svelte.config.js     # SvelteKit configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build tool configuration
└── .env                 # Environment variables (create this file)
```

### Build Directory

```
build/                   # Production build output
├── env.js              # Environment variables for production
├── handler.js          # Server request handler
├── index.js            # Production entry point
├── shims.js            # Polyfills and compatibility shims
├── client/             # Client-side assets
│   ├── favicon.svg     # App icon
│   ├── user.png        # Default user avatar
│   └── _app/           # SvelteKit app assets
│       ├── version.json # Build version information
│       └── immutable/  # Immutable cached assets
└── server/             # Server-side rendered components
    ├── index.js        # Server entry point
    ├── manifest.js     # Build manifest
    └── chunks/         # Code-split chunks
```

### Source Directory

```
src/
├── app.css              # Global styles and CSS variables
├── app.d.ts             # TypeScript ambient declarations
├── app.html             # Main HTML template
├── lib/                 # Shared library code
│   ├── index.ts         # Library exports
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   ├── api/             # API client and utilities
│   │   └── index.ts     # API configuration and methods
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components (buttons, inputs, etc.)
│   │   └── ...          # Feature-specific components
│   └── hooks/           # Custom Svelte hooks and utilities
├── modules/             # Feature-based modules
│   ├── app/             # Main application module
│   ├── auth/            # Authentication and authorization
│   ├── products/        # Product management features
│   └── profile/         # User profile management
└── routes/              # SvelteKit file-based routing
    ├── +layout.svelte   # Root layout component
    ├── +layout.ts       # Root layout data loading
    ├── (app)/           # App routes (grouped)
    ├── (auth)/          # Authentication routes (grouped)
    └── u/               # User-specific routes
```

### Static Assets

```
static/                  # Static files served directly
├── favicon.svg          # App favicon
├── user.png            # Default user avatar
└── img/                # Image assets
    └── dmp-bg.jpg      # Background images
```

### Configuration Files

- **`components.json`** - Configuration for shadcn/ui components
- **`eslint.config.js`** - ESLint linting rules and configuration
- **`svelte.config.js`** - SvelteKit framework configuration
- **`tsconfig.json`** - TypeScript compiler options
- **`vite.config.ts`** - Vite build tool and development server config
- **`Dockerfile`** - Container configuration for deployment

### Module Architecture

The project follows a modular architecture where each feature is organized into its own module:

- **`modules/app/`** - Core application functionality
- **`modules/auth/`** - User authentication and session management
- **`modules/products/`** - Product catalog and management
- **`modules/profile/`** - User profile and account settings

### Route Structure

SvelteKit uses file-based routing with special conventions:

- **`(app)/`** - Route group for authenticated app pages
- **`(auth)/`** - Route group for authentication pages
- **`u/`** - User-specific routes (profiles, settings, etc.)
- **`+layout.svelte`** - Layout components that wrap page content
- **`+layout.ts`** - Server-side data loading for layouts
- **`+page.svelte`** - Individual page components
- **`+page.ts`** - Server-side data loading for pages

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
