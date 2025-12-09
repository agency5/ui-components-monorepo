# UI Components Monorepo

Shared UI component library using shadcn/ui for consistent designs across all projects.

## Available Components

- Button
- Card
- Input
- Label

## How Teammates Can Use This

### 1. Clone this repository
```bash
git clone https://github.com/agency5/ui-components-monorepo.git
cd ui-components-monorepo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Copy components to your project
Copy the components you need from `components/ui/` folder to your own project's components folder.

### 4. Make sure your project has Tailwind CSS configured
These components require Tailwind CSS to work properly.

## Adding New Components

To add more shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

Then commit and push to share with the team.