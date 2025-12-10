# Design Tokens Guide for Designers

This document explains how to provide design specifications that will be applied to all UI components.

---

## 🎨 Current Brand Theme

### Colors
- **Primary (Active Button):** rgb(0, 67, 154) - Bright Blue
- **Secondary (Dark Brand):** rgb(0, 26, 51) - Dark Navy
- **Body Text:** #363636 - Dark Gray
- **Border (Inactive):** rgb(209, 213, 219) - Light Gray
- **Background:** White

### Typography
- **Font Family:** Barlow
- **Font Weights:** 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- **Active Button Text:** Bold (700), White

### Spacing & Borders
- **Border Radius:** 10.5px
- **Button Border (Inactive):** 1px solid rgb(209, 213, 219)

---

## 🔄 How to Update Design Tokens

When brand colors, fonts, or styling need to change:

### Step 1: Provide Updated Specs
Share the following information:

**Colors (provide in RGB or HEX):**
- Primary color: `rgb(__, __, __)`
- Secondary color: `rgb(__, __, __)`
- Body text color: `#______`
- Border color: `rgb(__, __, __)`

**Typography:**
- Font family name: `______`
- Font weights needed: `400, 600, 700` (example)

**Borders & Spacing:**
- Border radius: `__px`
- Button border width: `__px`

### Step 2: Repository Admin Updates Theme
The admin will update `app/globals.css` with your new tokens.

### Step 3: All Components Update Automatically
Once updated, ALL 23+ components will reflect the new brand styling instantly.

---

## 🎨 For Custom Components (Unique Structures)

If you're creating a component with **unique structure** (not just styling):

### Examples of Custom Components:
- Bar charts with custom animations
- Data visualizations
- Dashboard widgets
- Unique interactive elements

### Workflow:
1. Design the component in Figma
2. Export as React/TypeScript code using Figma-to-Code plugin
3. Save file in `components/custom/[component-name].tsx`
4. Follow the pull request workflow:
   - Switch to `design` branch
   - Add your component file
   - Push to GitHub
   - Create Pull Request to `master`
   - Request review

---

## ⚠️ Important Notes

**DO use design tokens for:**
- ✅ Color changes (buttons, text, borders)
- ✅ Font family or weight changes
- ✅ Border radius adjustments
- ✅ Spacing modifications

**DON'T create custom components for:**
- ❌ Just changing button colors (use tokens)
- ❌ Just changing fonts (use tokens)
- ❌ Simple styling variations (use tokens)

**DO create custom components for:**
- ✅ Unique chart designs
- ✅ Custom data visualizations
- ✅ New interactive widgets
- ✅ Components that don't exist in shadcn/ui

---

## 📞 Questions?

Contact the repository admin for help with:
- Converting colors to OKLCH format
- Adding new font families
- Technical implementation questions