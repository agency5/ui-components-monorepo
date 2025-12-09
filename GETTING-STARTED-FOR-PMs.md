# Getting Started Guide for Product Managers

## Setup (One Time Only)

### 1. Clone this repository in Cursor
1. Open Cursor
2. Click: File → Clone Repository
3. Paste: `https://github.com/agency5/ui-components-monorepo.git`
4. Choose where to save it
5. Click "Open" when it finishes

---

## Daily Use: How to Use Components

### Finding Components
Look in Cursor's sidebar:
- **Base Components** → `components/base/` folder
  - button.tsx
  - card.tsx
  - input.tsx
  - label.tsx

- **Branded Components** → `components/branded/` folder
  - (Your designer will add custom-styled components here)

### Using a Component in Your Prototype

**Step 1:** Import the component at the top of your file
```tsx
import { Button } from '@/components/base/button'
```

**Step 2:** Use it in your code
```tsx
<Button>Click Me</Button>
```

### Example: Creating a Simple Page
```tsx
import { Button } from '@/components/base/button'
import { Card } from '@/components/base/card'

export default function MyPage() {
  return (
    <Card>
      <h1>My Prototype</h1>
      <Button>Submit</Button>
    </Card>
  )
}
```

---

## Getting Updates (When Designer Adds New Components)

### In Cursor:
1. Look at the bottom-left corner
2. Click the **branch icon** (shows "master")
3. Click the **↻ sync icon** next to it
4. New components will appear!

### OR in Terminal:
1. Open Terminal in Cursor (View → Terminal)
2. Type: `git pull`
3. Press Enter

---

## Important Rules ⚠️

**DO:**
- ✅ Use components from `base/` and `branded/` folders
- ✅ Import and use them in your prototypes
- ✅ Pull updates regularly

**DON'T:**
- ❌ Edit files in `components/base/` or `components/branded/`
- ❌ Delete or rename component files
- ❌ Push changes to GitHub (you won't have permission anyway)

---

## Need Help?

**Can't find a component you need?**
→ Ask the design team to add it

**Component looks wrong?**
→ Make sure you pulled the latest updates (see "Getting Updates" above)

**Something broken?**
→ Ask a developer for help