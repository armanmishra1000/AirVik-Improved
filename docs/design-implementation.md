# Airvik Hotel System Design Implementation Guide

This guide establishes design tokens, styling patterns, and UI development rules for the Airvik Hotel System. It ensures consistent, maintainable, and accessible UI components across the application.

## Design Tokens

### CSS Variables

```css
:root {
  --color-primary: #E61E4D;
  --color-text: #222222;
  --color-muted: #6a6a6a;
  --color-neutral: #dddddd;
  --color-gray-bg: #f7f7f7;
  --radius: 0.5rem;   /* 8 px */
  --space: 1rem;     /* Tailwind 4-scale */
}
```

### Tailwind Extension

The Tailwind configuration extends the theme using CSS variables to ensure consistency:

```javascript
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      text: 'var(--color-text)',
      muted: 'var(--color-muted)',
      neutral: 'var(--color-neutral)',
      'gray-bg': 'var(--color-gray-bg)',
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    spacing: {
      DEFAULT: 'var(--space)',
    },
  },
},
```

## Allowed Actions

- Add or replace class names with token-based alternatives
- Wrap JSX in shared atomic components
- Edit CSS variables for theming
- Create new component variants using existing tokens
- Add new tokens following the established pattern

## Forbidden Actions

- Rename functions, methods, or components
- Alter API calls or data flow
- Change file paths or directory structure
- Delete tests or test coverage
- Use arbitrary values in Tailwind classes (e.g., `text-[#ff0000]`)
- Hardcode hex colors in CSS or inline styles

## Prompt Template for Developers

```yaml
### Windsurf UI-Update Request
1. Feature / Branch: <branch-name>
2. Target files: <glob>
3. Reference screenshot: <path>
4. Behaviour unchanged: YES
```

## Guard-Rails

### ESLint Configuration

- `tailwindcss/no-arbitrary-value`: Prevents arbitrary values in Tailwind classes
- Configuration in `.eslintrc.js`

### Stylelint Configuration

- `color-no-hex`: Prevents hardcoded hex colors
- `selector-class-pattern`: Enforces naming conventions
- Configuration in `stylelint.config.js`

### Storybook & Visual Testing

- Storybook with design-token addon for token visualization
- Chromatic visual diff testing to prevent UI regressions

### Accessibility

- WCAG contrast reminder (4.5:1 minimum contrast ratio)
- Use token-based colors that meet accessibility standards

## Dark Mode Support

Dark mode can be implemented by adding a `.dark` class variant to the `:root` selector:

```css
.dark:root {
  --color-primary: #FF385C;
  --color-text: #FFFFFF;
  --color-muted: #A0A0A0;
  --color-neutral: #555555;
  --color-gray-bg: #333333;
}
```

## Implementation Checklist

- [ ] CSS variables defined in tokens.css
- [ ] Tailwind config extended with CSS variables
- [ ] ESLint plugin for Tailwind with no-arbitrary-value rule
- [ ] Stylelint with color-no-hex rule
- [ ] Storybook with design-token addon
- [ ] GitHub Actions for Stylelint & visual tests
