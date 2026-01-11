# shadcn/ui Implementation Guidelines for SciCon

This document outlines critical steps and common pitfalls to avoid when adding or refactoring `shadcn/ui` components in the SciCon project. Follow these to prevent "white page" crashes and build errors.

## 1. Dependency Management
Many `shadcn/ui` components are thin wrappers around **Radix UI** primitives. If these primitives are missing, Vite will throw an import analysis error, causing the app to fail to load.

**Always check and install these peers if they aren't in `package.json`:**
- `@radix-ui/react-slot` (Commonly used by `Button`)
- `@radix-ui/react-separator`
- `@radix-ui/react-avatar`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-dialog` (Required by `Sheet` and `Sidebar`)
- `@radix-ui/react-tooltip` (Required by `Sidebar`)
- `@radix-ui/react-icons` (Used for internal component icons)

## 2. Component Dependencies (Hooks & Utils)
Components like the **Sidebar** require more than just the component file.
- **Hook**: `src/hooks/use-mobile.js` must exist. It is used by `sidebar.jsx` to handle responsive states.
- **Utility**: `src/lib/utils.js` (containing the `cn` function) is essential.

## 3. Avoiding "White Page" Crashes
"White pages" in this project are usually caused by:
- **Missing Peer Dependencies**: Check the browser console; if it says "Failed to resolve import...", you are missing an `npm install`.
- **Incompatible React versions**: Ensure you are using `v19` compatible primitives.
- **Invalid Imports**: Ensure icons are imported from `lucide-react` (standard for this project) and not mixed with other libraries unless necessary.

## 4. Theming (Light & Dark Mode)
The project uses a global Dark Mode toggle. Components must use CSS variables rather than hardcoded Tailwind colors to look good in both themes.
- **Preferred Classes**: Use `text-muted-foreground`, `bg-sidebar`, `border-border`, `bg-background`.
- **Sidebar Background**: The `Sidebar` uses `--sidebar-background`. If the sidebar looks transparent or white in dark mode, check `index.css` for the variable definition.

## 5. Verification Workflow
When adding a new `shadcn` component:
1.  **Dependencies**: Check `package.json` for the required Radix primitive.
2.  **Implementation**: Copy the component code to `src/components/ui/`.
3.  **Imports**: Verify all internal imports in the component (e.g., path to `@/lib/utils`).
4.  **Browser Test**: Immediately navigate to a page using the component and check the console for "Module not found" errors.
5.  **Theme Toggle**: Check both Light and Dark modes.

---
*Note for future models: If the app crashes after a shadcn addition, revert the import in the layout file first to restore the app, then install the missing dependency.*
