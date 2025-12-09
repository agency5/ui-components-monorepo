# UI Components Monorepo

**Shared design system for consistent UI/UX across prototypes and production apps.**

This repository contains a 3-layer component system:
1. **UI Layer** - Original shadcn/ui components (`components/ui/`)
2. **Custom Layer** - Custom-styled components from Figma (`components/custom/`)
3. **Consumption Layer** - Product managers and developers import read-only components

---

## 📚 Documentation by Role

### For Product Managers (Prototyping)
→ Read: [GETTING-STARTED-FOR-PMs.md](./GETTING-STARTED-FOR-PMs.md)

### For Designers
→ Read: [components/custom/README.md](./components/custom/README.md)

### For Developers
→ Continue reading below

---

## 🚀 Quick Start for Developers

### 1. Clone the Repository
```bash
git clone https://github.com/agency5/ui-components-monorepo.git
cd ui-components-monorepo
npm install
```

### 2. Import Components in Your Project

**Option A: Work directly in this repo**
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/custom/card' // when available
```

**Option B: Copy to your own project**
```bash
# Copy the component you need
cp components/ui/button.tsx your-project/components/
```

### 3. Pull Latest Updates
```bash
git pull origin master
```

---

## 📦 Available Components

### UI Components (shadcn/ui)
Located in `components/ui/`:
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label

### Custom Components (Figma Exports)
Located in `components/custom/`:
- *Coming soon - designers will add custom-styled components here*

---

## 🔧 Adding New UI Components

**For repository maintainers only:**
```bash
npx shadcn@latest add [component-name]
```

Components will automatically be added to `components/ui/`

---

## 🎨 Design System Workflow
```
Designer (Figma)
    ↓
Export React/TypeScript code
    ↓
Push to 'design' branch
    ↓
Create Pull Request
    ↓
Review & Approve
    ↓
Merge to 'master'
    ↓
Product Managers & Developers pull updates
```

---

## ⚠️ Important Rules

### ✅ DO:
- Import and use components in your projects
- Pull updates regularly
- Report issues or request new components

### ❌ DON'T:
- Modify files in `components/ui/` or `components/custom/`
- Push directly to master (use pull requests)
- Create custom versions of existing components

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (customizable, accessible)
- **Design Tool:** Figma → Code export

---

## 📞 Support

**Need a new component?** → Contact the design team  
**Found a bug?** → Create a GitHub issue  
**Questions?** → Ask in team Slack/communication channel

---

## 🔐 Repository Access

- **Product Managers:** Read-only (clone and pull)
- **Developers:** Read-only (clone and pull)
- **Designers:** Write access to 'design' branch only
- **Admins:** Full access with branch protection bypass