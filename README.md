
# Accounting and Inventory Management ✅

A lightweight React + Vite frontend for managing accounting and inventory workflows. The UI components are built from Radix primitives and common open-source libraries and follow the designs available in Figma.


## Features ✨

- Sales and purchase modules (orders, invoices, printing)
- Inventory management (GRN, stock ledger, stock inquiry)
- Accounting modules (chart of accounts, ledger, trial balance, vouchers)
- Responsive, component-driven UI with Recharts for visualisations

---

## Tech stack 🔧

- Framework: React + Vite
- UI primitives: Radix UI
- Charts: Recharts
- Form handling: react-hook-form
- Build tool: Vite

---

## Getting started 🚀

Prerequisites: Node.js (>= 18) and npm (or yarn/pnpm).

1. Install dependencies:

   npm install

2. Run the development server:

   npm run dev

3. Build for production:

   npm run build

4. Preview the production build (optional):

   npx vite preview

---

## Project structure 📁

- `index.html` — app entry HTML
- `src/` — main source files
  - `main.tsx`, `App.tsx` — app bootstrap
  - `components/` — grouped feature UI components (sales, inventory, accounts, ui primitives)
  - `styles/` — global styles
- `public/` — static assets