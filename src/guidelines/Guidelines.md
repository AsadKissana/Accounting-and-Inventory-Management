# Project Guidelines 📘

This document contains concise rules and conventions for developing the Accounting & Inventory Management frontend.
Follow these guidelines to keep the codebase consistent, accessible, and maintainable.

---

## Quick links
- Project README: ../../README.md
- Dev: `npm install && npm run dev`

---

## 1. Git, branches & PRs ✅
- Branch naming: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`.
- Commits: follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`).
- PR description must include: what changed, why, screenshots (if UI), linked issue, and testing steps.
- Run: linting, type-check, and any available tests before requesting review.

---

## 2. Code style & TypeScript ✨
- Use TypeScript for all new files. Avoid `any`; prefer well-typed interfaces and utility types.
- Prefer named exports for components and utilities (e.g., `export function Foo(){}` or `export { Foo }`).
- Use clear, descriptive names for props and interfaces (e.g., `InvoiceListProps`).
- Keep components small and focused; split complicated logic into hooks or helpers.

---

## 3. Components & file structure 🔧
- Location: `src/components/<feature>/...` or `src/components/ui/...` for shared UI primitives.
- File name: Prefer `PascalCase` for component files (e.g., `SaleInvoice.tsx`). Utility modules may use `kebab` or `camelCase`.
- Exports: export components as named exports. If an index/barrel file exists, add new exports there.
- Variants & CSS: use `cva` for reusable variant styles and `cn` for conditional classNames.

Short checklist when adding a component:
1. Create `src/components/<area>/MyComponent.tsx`.
2. Add types in the same file or `types.ts` if large.
3. Add a short README or example usage in comments.
4. Add to export barrel if appropriate.

---

## 4. Styling & Tailwind ⚡
- Use Tailwind utility classes for styles.
- Keep class lists readable: extract long variant sets into `cva` or small helper functions.
- Keep CSS in `src/styles` for global styles only; avoid large inline styles where Tailwind utilities or classes suffice.

---

## 5. Accessibility ♿
- Use semantic HTML (buttons, forms, labels) and add ARIA attributes for custom widgets.
- Ensure keyboard focus is visible and interactive elements are reachable by keyboard.
- When adding visual changes, include accessibility checks (screen reader labels, color contrast).

---

## 6. Dates & Currency (Accounting rules) 💱
- Store dates in ISO 8601 (`YYYY-MM-DD` / full ISO) in APIs and internal models.
- Display dates using localized formats via Intl APIs. Example:

```ts
const formatted = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
```

- Use `Intl.NumberFormat` for currency display; prefer to receive a currency code and format accordingly:

```ts
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
```

---

## 7. Testing & validation ✅
- Add unit tests for business logic and key components.
- Validate forms with `react-hook-form` and Zod (or similar) for schema validation when possible.

---

## 8. Performance & best practices 🚀
- Lazy load large modules (React.lazy / dynamic import).
- For long lists, use virtualization or pagination.
- Avoid heavy synchronous computations in render.

---

## 9. Linting & formatting 🧹
- Use Prettier and ESLint with recommended TypeScript/React rules (add configs if not present).
- Ensure `npm run build` completes without type errors.

---

## 10. PR checklist (summary) ✅
- [ ] Branch name and commit messages follow conventions
- [ ] Types pass and no `any` introduced
- [ ] Linting/formatting OK
- [ ] Accessibility checks applied for UI changes
- [ ] Tests added/updated
- [ ] PR description + screenshots and testing steps included

---

If you'd like, I can: add ESLint/Prettier config, add a `CONTRIBUTING.md` file, or create a small PR template for this repository. 👋
