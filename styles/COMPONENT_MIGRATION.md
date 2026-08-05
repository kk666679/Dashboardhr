# COMPONENT_MIGRATION.md

This file documents global CSS classes previously defined in `app/globals.css` that are **component-specific** and should be migrated to **Next.js CSS Modules** to avoid polluting the global namespace.

> Note: Regex scanning across the repo was not possible in this environment (missing `ripgrep`). The purge list below is derived from the component-like selectors present in your old `app/globals.css`.

## 1) Purged component classes (moved out of global CSS)
- `.glass-navbar`
- `.glass-modal`
- `.btn-glass`

(Kept as global Tailwind utilities instead: `.glass`, `.glass-sm`, `.glass-lg`, `.glass-card`, `.glass-interactive`, plus layout helpers.)

## 2) CSS Modules template (TypeScript/Next.js)
### Example: GlassNavbar
**`components/layout/GlassNavbar.module.css`**
```css
@layer components {
  .glassNavbar {
    /* values taken from old .glass-navbar */
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border-bottom: 1px solid var(--glass-border);
    padding: 0.75rem 1rem;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  @media (min-width: 768px) {
    .glassNavbar {
      padding: 1rem 2rem;
    }
  }
}
```

**`components/layout/GlassNavbar.tsx`**
```tsx
import styles from './GlassNavbar.module.css';

export function GlassNavbar({ children }: { children: React.ReactNode }) {
  return <header className={styles.glassNavbar}>{children}</header>;
}
```

## 3) Full `.module.css` for the largest 3 components

### A) `GlassNavbar.module.css`
```css
@layer components {
  .glassNavbar {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border-bottom: 1px solid var(--glass-border);
    padding: 0.75rem 1rem;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  @media (min-width: 768px) {
    .glassNavbar {
      padding: 1rem 2rem;
    }
  }
}
```

### B) `GlassModal.module.css`
```css
@layer components {
  .glassModal {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur-lg));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    box-shadow: var(--glass-shadow-lg);
    width: 90%;
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem;
  }

  @media (min-width: 768px) {
    .glassModal {
      width: 80%;
      max-width: 600px;
      padding: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .glassModal {
      max-width: 700px;
      padding: 2.5rem;
    }
  }
}
```

### C) `BtnGlass.module.css`
```css
@layer components {
  .btnGlass {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur-sm));
    border: 1px solid var(--glass-border);
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition:
      transform var(--duration-200) var(--ease-everyday),
      background-color var(--duration-200) var(--ease-everyday),
      border-color var(--duration-200) var(--ease-everyday);
    white-space: nowrap;
  }

  @media (min-width: 640px) {
    .btnGlass {
      padding: 0.625rem 1.25rem;
      font-size: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .btnGlass {
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }
  }

  .btnGlass:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.45);
    transform: translateY(-1px);
  }
}
```

## 4) Framer Motion sync reminder (durations/eases)
If your components use Framer Motion transitions, prefer wiring:
- easing: `var(--ease-smooth)` (or the equivalent cubic-bezier)
- durations: `0.2s`, `0.25s`, `0.3s` mapped to `--duration-200/250/300`

This prevents drift caused by your old global `* { transition-duration: 0.2s; ... }` rule.

