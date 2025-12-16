# Architecture Migration Plan: Next.js Frontend + NestJS Backend

## Overview
Migrate the current React/Vite application to a modern full-stack architecture:
- **Frontend**: Next.js 14+ with App Router
- **Backend**: NestJS 10+ with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **API Communication**: RESTful APIs with proper error handling

## Current State Analysis
- ✅ Comprehensive HRMS features implemented
- ✅ Rich UI components (shadcn/ui)
- ✅ Malaysian compliance features
- ✅ AI-powered modules
- ❌ Mixed Next.js/React scripts in package.json
- ❌ Dependency conflicts
- ❌ No backend API separation

## Migration Strategy

### Phase 1: Project Structure Setup
```
/workspaces/Dashboardhr/
├── frontend/          # Next.js application
│   ├── app/          # App Router pages
│   ├── components/   # Reusable components
│   ├── lib/          # Utilities and configurations
│   ├── types/        # TypeScript types
│   └── hooks/        # Custom React hooks
├── backend/          # NestJS application
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── common/   # Shared utilities
│   │   ├── config/   # Configuration
│   │   └── database/ # Database setup
│   └── test/         # Test files
├── shared/           # Shared types and utilities
├── docker-compose.yml
└── README.md
```

### Phase 2: Backend Development (NestJS)

#### Core Modules to Implement:
1. **Authentication Module**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Multi-tenant support

2. **Employee Management Module**
   - CRUD operations
   - Employee profiles
   - Department/team hierarchy

3. **Leave Management Module**
   - Leave requests
   - Approval workflows
   - Calendar integration

4. **Payroll Module**
   - Malaysian tax calculations (PCB)
   - EPF/SOCSO/EIS
   - Zakat calculations
   - Payslip generation

5. **Attendance Module**
   - Time tracking
   - Overtime calculations
   - Reports

6. **Compliance Module**
   - Malaysian employment law compliance
   - Audit trails
   - Report generation

7. **Foreign Workers Module**
   - Work permit tracking
   - Immigration compliance
   - FOMEMA integration

8. **Performance Management Module**
   - Goal setting (OKRs)
   - Reviews and feedback
   - Performance analytics

9. **Learning & Development Module**
   - Training management
   - Skill tracking
   - Certification management

10. **Analytics Module**
    - HR analytics
    - Predictive insights
    - Compliance reporting

### Phase 3: Frontend Migration (Next.js)

#### Key Migration Tasks:
1. **App Router Setup**
   - Migrate from Vite to Next.js
   - Implement app directory structure
   - Set up server components where appropriate

2. **API Integration**
   - Create API service layer
   - Implement data fetching hooks
   - Add error handling and loading states

3. **Authentication Flow**
   - NextAuth.js integration
   - Protected routes
   - Role-based UI rendering

4. **State Management**
   - Migrate context providers
   - Implement React Query/SWR for server state
   - Client-side state management

5. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Server-side rendering where beneficial

### Phase 4: Database Migration

#### Prisma Setup:
1. **Schema Design**
   - Multi-tenant architecture
   - Proper relationships
   - Indexes for performance

2. **Migration Scripts**
   - Seed data for Malaysian context
   - Initial admin user creation
   - Sample data for testing

### Phase 5: Integration & Testing

#### API Integration:
1. **Frontend-Backend Communication**
   - CORS configuration
   - API error handling
   - Request/response interceptors

2. **Testing Strategy**
   - Unit tests for backend modules
   - Integration tests
   - E2E tests for critical workflows

## Technical Specifications

### Backend Stack:
- **Framework**: NestJS 10+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Class-validator, Class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Security**: Helmet, CORS, Rate limiting

### Frontend Stack:
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts/Chart.js
- **Testing**: Jest + Testing Library

### Shared Stack:
- **Language**: TypeScript
- **Code Quality**: ESLint + Prettier
- **Pre-commit Hooks**: Husky + lint-staged

## Implementation Steps

### Step 1: Project Setup
1. Create new project structure
2. Set up Docker containers
3. Initialize Git repositories

### Step 2: Backend Foundation
1. Set up NestJS project
2. Configure database connection
3. Implement authentication module
4. Set up basic CRUD operations

### Step 3: Frontend Foundation
1. Set up Next.js project
2. Configure Tailwind and shadcn/ui
3. Create API service layer
4. Implement authentication flow

### Step 4: Feature Migration
1. Migrate HR modules one by one
2. Implement API endpoints
3. Update frontend components
4. Test functionality

### Step 5: Polish & Optimize
1. Performance optimization
2. Security hardening
3. Error handling
4. Documentation

## Malaysian Compliance Features

### Tax & Financial:
- PCB (Potongan Cukai Bulanan) calculations
- EPF (KWP) contribution calculations
- SOCSO and EIS calculations
- State-specific zakat calculations
- Tabung Haji integration points

### Employment Law:
- Employment Act 1955 compliance
- Industrial Relations Act 1967
- Personal Data Protection Act (PDPA)
- Foreign worker regulations
- Multi-language support (BM, English, Chinese, Tamil)

### Government Integrations:
- LHDN MyTax API preparation
- KWSP i-Akaun integration points
- PERKESO API preparation
- Immigration Department API preparation

## Benefits of This Architecture

1. **Scalability**: Separate frontend and backend for independent scaling
2. **Maintainability**: Clear separation of concerns
3. **Developer Experience**: Type-safe API communication
4. **Performance**: Server-side rendering, caching, optimization
5. **Security**: Centralized authentication and authorization
6. **Malaysian Compliance**: Built-in compliance features
7. **AI Integration**: Proper architecture for AI service integration
8. **Testing**: Comprehensive testing strategies

## Timeline Estimate

- **Phase 1**: Project setup (1 week)
- **Phase 2**: Backend foundation (2-3 weeks)
- **Phase 3**: Frontend migration (2-3 weeks)
- **Phase 4**: Feature migration (4-6 weeks)
- **Phase 5**: Testing & optimization (1-2 weeks)

**Total Estimated Time**: 10-15 weeks

## Next Steps

1. ✅ Review and approve this plan
2. ✅ Start with dependency fixes in current project
3. ✅ Begin backend setup
4. ✅ Migrate frontend components systematically
5. ✅ Implement Malaysian-specific features
6. ✅ Test and optimize

This migration will transform your current React application into a modern, scalable full-stack application with proper separation of concerns and Malaysian business compliance.
