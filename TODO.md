# Next.js Migration TODO

## Phase 1: Cleanup Vite Configuration
- [ ] Remove vite.config.ts
- [ ] Remove index.html
- [ ] Remove frontend/ directory structure

## Phase 2: Component Migration
- [ ] Move components from frontend/src/components/ to /components/
- [ ] Move contexts from frontend/src/contexts/ to /contexts/
- [ ] Update import paths in all migrated components
- [ ] Migrate the main App component structure to Next.js layout

## Phase 3: Next.js Structure Setup
- [ ] Update app/layout.tsx to include all providers
- [ ] Update app/page.tsx to use the migrated Dashboard component
- [ ] Ensure proper CSS imports and global styles
- [ ] Configure Next.js specific optimizations

## Phase 4: Dependency Cleanup
- [ ] Update package.json to remove any Vite-related dependencies
- [ ] Update Next.js to latest stable version if needed
- [ ] Clean up any remaining Vite-specific configurations

## Phase 5: Testing and Validation
- [ ] Test Next.js development server
- [ ] Verify all components render correctly
- [ ] Ensure proper routing and navigation
- [ ] Validate TypeScript compilation

## Progress
- Created migration plan ✓
- Ready to start implementation
