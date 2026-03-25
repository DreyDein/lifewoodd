# Agent Guidelines for Lifewood Project

## Project Overview

This is a React + TypeScript + Vite frontend application with an Express/Node.js backend server. The project uses `@vercel/node` for serverless API functions and includes Supabase integration for database operations.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev           # Start Vite dev server (port 3000)
npm run dev:server    # Start Express server (port 5174)
```

### Build & Deploy
```bash
npm run build         # Production build with Vite
npm run preview       # Preview production build
```

### Testing
- **No test framework is currently configured.** Do not add tests unless explicitly requested.

### Linting
- **No ESLint or Prettier is configured.** Do not add linting unless explicitly requested.

### Environment Setup
Copy `.env.example` to `.env.local` and set required variables:
- `GEMINI_API_KEY` - Required for AI features
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` - Database
- `RESEND_API_KEY` - Email service (note: replaces GMAIL_*)
- `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET` - Admin auth

## Code Style Guidelines

### General
- Use ES modules (`import`/`export`) throughout
- Use TypeScript for all new code; `.ts` for utilities, `.tsx` for React components
- Server-side code in `server/index.js` uses JavaScript with ES modules
- Project has `"type": "module"` in package.json

### React & TypeScript
- Use explicit `React.FC` type for functional components
- Define component props with interfaces
- Use `Language` and `Theme` types from `types.ts` for i18n/theme
- Example component structure:
  ```tsx
  import React from 'react';
  
  interface MyComponentProps {
    title: string;
    onAction: () => void;
  }

  const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
    return <button onClick={onAction}>{title}</button</button>;
  };

  export default MyComponent;
  ```

### Imports
- Order: React imports → third-party → local components → types/utilities
- Include file extensions for local imports: `import Navbar from './components/Navbar.tsx'`
- Use path alias `@/*` for root-relative imports (configured in tsconfig.json)
- Example: `import { Language } from '@/types.ts'`

### Naming Conventions
- Components: PascalCase (e.g., `Navbar.tsx`, `ApplicationModal.tsx`)
- Files: camelCase for utilities (e.g., `contact.ts`, `admin-login.ts`)
- Interfaces: PascalCase with `Props` suffix for component props
- Constants: SCREAMING_SNAKE_CASE for configuration values

### React Patterns
- Use hooks (`useState`, `useEffect`) for state and side effects
- Clean up event listeners in useEffect return functions
- Use `useCallback` for passed callbacks to prevent unnecessary re-renders
- Prefer early returns for conditional rendering
- Handle loading and error states in UI

### Error Handling
- Use try/catch for async operations
- Log errors with `console.error()` for debugging
- Return appropriate HTTP status codes (200, 400, 405, 500)
- Example from API routes:
  ```ts
  if (req.method !== 'POST') return res.status(405).send('Method not allowed.');
  if (!fullName || !email) return res.status(400).send('Missing required fields.');
  ```

### API Routes
- Located in `/api` directory as `.ts` files
- Use `@vercel/node` types: `VercelRequest`, `VercelResponse`
- Default export async handler function

### Backend Server
- Express server in `server/index.js`
- Uses multer for file uploads (PDF, DOC, DOCX only)
- Supabase client for database operations
- Top-level await for initialization
- File uploads stored in `uploads/` directory
- JSON fallback stored in `data/` directory

### Styling
- Uses inline styles and CSS modules
- Tailwind CSS classes may be used (see components for patterns)
- Custom colors via Tailwind config (lifewood-green, lifewood-dark, etc.)
- Dark mode support with `dark:` prefix
- Responsive design with mobile-first approach

### Database
- Supabase for persistent storage
- Tables: `inquiries`, `applications`, etc.
- Use service key for admin operations

### Environment Variables
- Never commit secrets; use `.env.local` (gitignored)
- Access via `process.env.VARIABLE_NAME`
- Provide fallback defaults where appropriate
- Load with dotenv: `dotenv.config({ path: path.join(rootDir, '.env.local') })`

### Vercel Deployment
- API routes deploy as serverless functions
- `vercel.json` configures routing
- Build output goes to `/dist`

## Architecture Notes

- Frontend: React 19 + Vite + TypeScript
- Backend: Express (dev) / Vercel Serverless (prod)
- Database: Supabase
- Email: Resend (preferred) / Nodemailer (Gmail)
- AI: Google Gemini API
- 3D: Three.js + React Three Fiber

## Key Files

- `App.tsx` - Main app with translations and routing (large file, ~500+ lines)
- `components/` - React components (17+ components)
- `api/` - Serverless API routes
- `server/index.js` - Express server for local dev
- `types.ts` - Shared TypeScript types
- `vite.config.ts` - Vite and proxy configuration
- `types.ts` - Contains `Language` and `Theme` types

## Additional Best Practices

- Minimize component props; use context for global state
- Keep App.tsx organized with translation objects at top
- Use semantic HTML elements
- Ensure accessibility (aria labels, keyboard navigation)
- Test both light and dark themes
- Verify mobile responsiveness