# Branded Components - Designer Workflow

## Overview
This folder contains brand-customized UI components exported from Figma. These components layer on top of the base shadcn/ui components with your brand styling.

## For Designers: How to Update Components

### Step 1: Export from Figma
1. Design your component in Figma
2. Use the Figma-to-Code plugin to export as React/TypeScript
3. Save the exported `.tsx` file

### Step 2: Push to GitHub
1. Open terminal in the repository folder
2. Switch to design branch: `git checkout design`
3. Add your new component file to `components/branded/`
4. Commit: `git add . && git commit -m "Added [ComponentName] from Figma"`
5. Push: `git push origin design`

### Step 3: Create Pull Request
1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Set: `design` → `master`
4. Add description of what changed
5. Request review from team lead

### Step 4: After Approval
Once approved and merged, the component is available to all developers.

---

## For Developers: READ ONLY

**DO NOT modify files in this folder.**

Import components like this:
\`\`\`tsx
import { BrandedButton } from '@/components/branded/button'
\`\`\`

To request component changes, contact the design team.

---

## Current Components
(Designer: Update this list when adding components)

- *No branded components yet - waiting for first Figma export*