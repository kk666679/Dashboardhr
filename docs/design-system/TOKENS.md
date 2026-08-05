# Design Tokens

The platform uses semantic CSS custom properties in `styles/theme.css` and the typed companion source in `styles/design-tokens.ts`.

| Token family | Contract |
| --- | --- |
| Typography | Inter and JetBrains Mono; 12–48px scale |
| Spacing | 4px grid from 4–96px |
| Color | Semantic background, foreground, brand, border, sidebar, and status tokens |
| Motion | 0–500ms durations and named easing curves |
| Elevation | Six shadow levels and a named z-index scale |

Use semantic values such as `var(--brand)`, `var(--background)`, and `var(--destructive)` instead of literal colors. TypeScript-driven visuals may import `designTokens`; tenant branding should use `tenantBrandCssVariables` rather than creating new token names.

Themes are `light`, `dark`, `system`, and `contrast`. Reduced-motion preferences are respected globally.
