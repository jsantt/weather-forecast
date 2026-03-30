## Project Context

This project uses Google Lit for building web components and no other frontend frameworks unless otherwise specified. It uses TypeScript with standard ESM imports.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- use parentheses
- use return early pattern
- Never use \_ prefix for private functions; always use the private keyword instead
- Prefer declarative code over imperative code where possible (e.g., use property bindings instead of manual DOM manipulation)

## Web Components Best Practices

- Use shadow dom in each component

## CSS Best Practices

- Group CSS properties by category: colors/backgrounds first, then positioning/layout, then other properties
- Sort properties alphabetically within each group
- Use blank lines to separate groups within a property block
- Limit property blocks to 3 lines per group; use more if it avoids leaving a single property orphaned
- Add an extra line break after each property block
