---
description: How to safely add shadcn/ui components without causing crashes or white pages
---

1. **Research Peer Dependencies**
   - Check the component code for imports starting with `@radix-ui/`.
   - Verify these are present in `frontend/package.json`.
   - // turbo
     If missing, run `npm install @radix-ui/react-<primitive-name>` in the `frontend` folder.

2. **Verify Support Files**
   - Ensure `src/lib/utils.js` exists (contains `cn`).
   - If adding the Sidebar, ensure `src/hooks/use-mobile.js` exists.

3. **Install Component**
   - Create the component file in `src/components/ui/`.
   - Update paths to use `@/` or correct relative paths for local utilities.

4. **Verify Render**
   - Import the component into a test page or the intended layout.
   - Open the browser and check for "Import Analysis" errors.
   - If a "White Page" occurs, check the console immediately.

5. **Apply Theming**
   - Test in both Light and Dark modes.
   - Ensure you use theme variables like `text-muted-foreground` instead of `text-gray-500`.
