# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15+ dashboard application built following the [Next.js Learn Course](https://nextjs.org/learn). It's a full-stack web application with authentication, database integration, and a complete CRUD interface for managing invoices and customers.

## Tech Stack

- **Framework**: Next.js (App Router with Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL (using `postgres` package)
- **Authentication**: NextAuth 5.0 (beta)
- **Styling**: Tailwind CSS with `@tailwindcss/forms`
- **UI Components**: React with `@heroicons/react` icons
- **Utilities**: `clsx`, `use-debounce`, `zod` for validation

## Essential Commands

```bash
# Development
pnpm dev          # Start dev server with Turbopack (http://localhost:3000)

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Database
# Visit /seed route to seed database (GET request to http://localhost:3000/seed)
```

## Architecture

### Directory Structure

```
app/
├── lib/                    # Shared utilities and data access
│   ├── definitions.ts      # TypeScript type definitions for all data models
│   ├── data.ts             # Database query functions (fetch operations)
│   ├── utils.ts            # Helper functions (formatCurrency, etc.)
│   └── placeholder-data.ts # Seed data for database
├── ui/                     # Reusable UI components
│   ├── dashboard/          # Dashboard-specific components
│   ├── invoices/           # Invoice-related components (forms, tables, etc.)
│   ├── customers/          # Customer-related components
│   ├── fonts.ts            # Google Fonts configuration (Inter, Lusitana)
│   └── global.css          # Global styles and Tailwind directives
├── dashboard/              # Dashboard routes (nested under /dashboard)
├── seed/                   # Database seeding route (/seed)
├── query/                  # Query testing route (/query)
├── layout.tsx              # Root layout
└── page.tsx                # Home page
```

### Key Architectural Patterns

1. **App Router Structure**: Uses Next.js 15 App Router with file-based routing
   - `page.tsx` files define routes
   - `layout.tsx` files define shared layouts
   - Route handlers in `route.ts` files (e.g., `/seed/route.ts`)

2. **Data Layer** (`app/lib/data.ts`):
   - All database queries are centralized here
   - Uses `postgres` package with tagged template literals for SQL
   - Functions follow naming pattern: `fetchRevenue()`, `fetchLatestInvoices()`, etc.
   - Connection configured with SSL: `postgres(process.env.POSTGRES_URL!, { ssl: 'require' })`

3. **Type Definitions** (`app/lib/definitions.ts`):
   - Complete TypeScript types for all data models: `User`, `Customer`, `Invoice`, `Revenue`
   - Specialized types for different views: `InvoicesTable`, `LatestInvoice`, `FormattedCustomersTable`
   - Uses utility types like `Omit` for type transformations (e.g., `LatestInvoiceRaw`)

4. **Component Organization**:
   - UI components are organized by feature in `app/ui/`
   - Dashboard components: navigation, cards, revenue charts, latest invoices
   - Invoice components: create/edit forms, status badges, pagination, breadcrumbs
   - Customer components: tables and displays

5. **Styling**:
   - Tailwind CSS configured in `tailwind.config.ts`
   - Global styles in `app/ui/global.css`
   - Google Fonts (Inter, Lusitana) configured in `app/ui/fonts.ts`
   - Uses `clsx` for conditional class names

6. **Database Schema**:
   - Tables: `users`, `customers`, `invoices`, `revenue`
   - Uses UUID primary keys with `uuid-ossp` extension
   - Invoice status: string union type `'pending' | 'paid'`
   - Seed route available at `/seed` for initial database setup

## Environment Configuration

Required environment variables (see `.env.example`):
```
POSTGRES_URL=              # Primary database connection URL
POSTGRES_PRISMA_URL=       # Prisma-compatible connection URL
POSTGRES_URL_NON_POOLING=  # Non-pooled connection
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
AUTH_SECRET=               # Generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth
```

## Path Aliases

TypeScript is configured with `@/*` alias mapping to project root:
```typescript
import { inter } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
```

## Database Operations

- **Seeding**: Send GET request to `/seed` route or visit in browser
- **Queries**: All data fetching functions are in `app/lib/data.ts`
- **Connection**: Uses `postgres` package with SSL required
- **Placeholder Data**: Located in `app/lib/placeholder-data.ts` for seeding

## Authentication

- Uses NextAuth 5.0 (beta version)
- Configuration files may need to be created for full auth implementation
- Auth endpoint: `/api/auth` (configured in `AUTH_URL` env var)

## Common Tasks

### Adding a New Data Type
1. Define TypeScript type in `app/lib/definitions.ts`
2. Add fetch function in `app/lib/data.ts`
3. Create UI components in appropriate `app/ui/` subdirectory
4. Update database seed if needed in `app/seed/route.ts`

### Creating a New Page
1. Create `page.tsx` in appropriate directory under `app/`
2. Import and use components from `app/ui/`
3. Fetch data using functions from `app/lib/data.ts`
4. Apply types from `app/lib/definitions.ts`

### Styling Components
- Use Tailwind CSS utility classes
- Import fonts from `@/app/ui/fonts`
- Use `clsx` for conditional classes
- Global styles in `app/ui/global.css`

## Notes

- This is a learning project based on the official Next.js tutorial
- The codebase includes Chinese comments in some files (particularly in `app/lib/definitions.ts` and `app/lib/data.ts`)
- Uses pnpm as package manager with special build dependencies for `bcrypt` and `sharp`
- Development uses Turbopack (Next.js's faster bundler) via `--turbopack` flag
