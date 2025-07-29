# Development Guide - Digital Market Place (Next.js)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- TypeScript knowledge
- React experience

### Initial Setup
```bash
cd Next/web
npm install
npm run dev
```

The application will run on `http://localhost:3000` (or the next available port).

## Project Architecture

### App Router Structure
This project uses Next.js 15's App Router with the following organization:

```typescript
// Route Groups for Organization
app/
├── (app)/          // Protected routes - requires authentication
│   ├── home/       // Dashboard home
│   ├── products/   // Product management  
│   ├── store/      // Store configuration
│   └── settings/   // User settings
└── (auth)/         // Public authentication routes
    ├── login/      // User login
    ├── register/   // User registration
    └── forgot-password/
```

### Component Hierarchy

```typescript
// 1. Layout Components (app/layout.tsx)
RootLayout
├── ThemeProvider
├── QueryProvider  
└── Toasters

// 2. App Layout (app/(app)/layout.tsx)  
AppLayout
├── AuthGuard (middleware)
├── SidebarProvider
├── AppSidebar
├── Header
└── Main Content

// 3. Auth Layout (app/(auth)/layout.tsx)
AuthLayout
└── Centered auth forms
```

## File Organization Best Practices

### 1. Component Creation
```typescript
// For reusable components: src/components/
export function Button({ children, variant = 'default', ...props }) {
  return (
    <button 
      className={cn(buttonVariants({ variant }))} 
      {...props}
    >
      {children}
    </button>
  )
}

// For page-specific components: app/(route)/_components/
export function ProductTable({ products }) {
  // Component specific to products page
}
```

### 2. Custom Hooks
```typescript
// src/lib/hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Auth logic here
  
  return { user, loading, login, logout }
}
```

### 3. API Layer
```typescript
// src/lib/api/auth.ts
export const authApi = {
  login: async (credentials) => {
    // API call logic
  },
  logout: async () => {
    // Logout logic  
  }
}
```

## Authentication Flow

### Route Protection
```typescript
// app/(app)/middleware.tsx
export function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) redirect('/login')
  
  return children
}
```

### Login Process
1. User submits credentials → `LoginForm`
2. API call → `authApi.login()`
3. Token stored → `localStorage` / `cookies`
4. Redirect → `/home`
5. Protected routes accessible

## Styling Guidelines

### Tailwind CSS Patterns
```typescript
// Use cn() utility for conditional classes
const buttonClass = cn(
  'px-4 py-2 rounded-md transition-colors',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-900',
  disabled && 'opacity-50 cursor-not-allowed'
)

// Component variants with CVA (Class Variance Authority)
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8'
      }
    }
  }
)
```

### CSS Variables for Themes
```css
/* globals.css */
:root {
  --primary: oklch(0.21 0.034 264.665);
  --secondary: oklch(0.967 0.003 264.542);
  --background: oklch(1 0 0);
}

.dark {
  --primary: oklch(0.8 0.034 264.665);
  --background: oklch(0.1 0 0);
}
```

## State Management

### React Query for Server State
```typescript
// lib/hooks/use-products.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Component usage
function ProductsList() {
  const { data: products, isLoading, error } = useProducts()
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />
  
  return <ProductTable products={products} />
}
```

### Local State with useState/useReducer
```typescript
// For component-specific state
function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: ''
  })
  
  // Form logic
}
```

## Testing Strategy

### Component Testing with Jest/RTL
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### API Testing
```typescript
// __tests__/api/auth.test.ts
import { authApi } from '@/lib/api/auth'

describe('Auth API', () => {
  it('logs in user successfully', async () => {
    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password'
    })
    
    expect(result.user).toBeDefined()
    expect(result.token).toBeDefined()
  })
})
```

## Deployment

### Build Process
```bash
npm run build    # Creates optimized production build
npm run start    # Starts production server
npm run lint     # Runs ESLint
npm run type-check # TypeScript checking
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.digitalmarketplace.com
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run dev:debug    # Start with debugging

# Building  
npm run build        # Production build
npm run analyze      # Bundle analysis

# Quality
npm run lint         # ESLint checking
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript checking
npm run format       # Prettier formatting

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Performance Optimization

### Next.js Features
- **Image Optimization**: Use `next/image`
- **Font Optimization**: Use `next/font`
- **Bundle Splitting**: Automatic code splitting
- **Server Components**: Default server rendering

### Best Practices
```typescript
// Lazy loading components
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
})

// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Callback memoization
const handleClick = useCallback(() => {
  onUpdate(id)
}, [id, onUpdate])
```

## Debugging

### Development Tools
- **React DevTools**: Component inspection
- **Next.js DevTools**: Route and performance analysis
- **Browser DevTools**: Network, console, performance
- **VS Code Extensions**: ES7+ React snippets, Auto Rename Tag

### Common Issues
1. **Hydration Errors**: Check server/client rendering differences
2. **Import Errors**: Verify path aliases in `tsconfig.json`
3. **CSS Issues**: Check Tailwind class conflicts
4. **API Errors**: Verify environment variables and endpoints

This guide covers the essential patterns and practices for developing with this Next.js architecture. 