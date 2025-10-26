# 🚀 Local Development Setup Instructions

## 📋 Project Overview

**Product:** B2B Revenue Analytics Platform  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS 4.0  
**UI:** Radix UI (shadcn/ui components)  
**Design:** Royal Purple (#6E56CF), Dark/Light themes, Inter font  
**Features:** AI Chat, Live Metrics, Drag & Drop Dashboards

---

## 📦 Complete package.json

```json
{
  "name": "revenue-analytics-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.445.0",
    "recharts": "^2.12.7",
    "motion": "^10.18.0",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "sonner": "^2.0.3",
    "date-fns": "^3.6.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-tooltip": "^1.1.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.2.2",
    "vite": "^5.3.1"
  }
}
```

---

## ⚙️ Configuration Files

### **vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### **tsconfig.node.json**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 📁 Directory Structure

**Current structure** (all files are in root `/`):
```
/ (root)
├── App.tsx
├── components/
├── contexts/
├── services/
├── types/
├── styles/
└── examples/
```

**Required structure** (move everything to `src/`):
```
your-project/
├── src/                        # ← MOVE ALL FILES HERE
│   ├── App.tsx
│   ├── main.tsx               # ← CREATE NEW
│   ├── vite-env.d.ts         # ← CREATE NEW
│   ├── components/
│   ├── contexts/
│   ├── services/
│   ├── types/
│   ├── styles/
│   └── examples/
├── index.html                 # ← CREATE NEW
├── vite.config.ts            # ← CREATE NEW
├── tsconfig.json             # ← CREATE NEW
├── tsconfig.node.json        # ← CREATE NEW
├── package.json              # ← CREATE NEW
└── .gitignore                # ← CREATE NEW
```

---

## 🔧 Required New Files

### **1. src/main.tsx** (Vite Entry Point)
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### **2. index.html** (Root HTML)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Revenue Analytics Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### **3. src/vite-env.d.ts** (Vite Types)
```typescript
/// <reference types="vite/client" />
```

### **4. .env.local** (Environment Variables)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENV=development
```

### **5. .gitignore**
```
# Dependencies
node_modules
.pnp
.pnp.js

# Production
dist
build

# Environment
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

## 🚀 Installation Steps

### **Step 1: Initialize Project**

**Option A - Fresh project:**
```bash
npm create vite@latest your-project-name -- --template react-ts
cd your-project-name
```

**Option B - Existing backend folder:**
```bash
cd your-existing-backend
mkdir frontend
cd frontend
npm init -y
```

### **Step 2: Install Dependencies**

**Core dependencies:**
```bash
npm install react react-dom lucide-react recharts motion react-dnd react-dnd-html5-backend sonner date-fns class-variance-authority clsx tailwind-merge
```

**Radix UI components:**
```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip
```

**Dev dependencies:**
```bash
npm install -D @types/react @types/react-dom @vitejs/plugin-react tailwindcss @tailwindcss/vite typescript vite @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### **Step 3: Create Directory Structure**
```bash
mkdir -p src/components/{app,marketing,ui,figma,app/utils}
mkdir -p src/contexts src/services src/types src/styles src/examples
```

### **Step 4: Move Files to src/**
```bash
# Move all existing files into src/ directory
mv App.tsx src/
mv components src/
mv contexts src/
mv services src/
mv types src/
mv styles src/
mv examples src/

# Keep documentation in root
# (INTEGRATION_GUIDE.md, LIVE_METRICS_README.md, etc. stay in root)
```

### **Step 5: Create Configuration Files**
Create the files from the "Configuration Files" section above:
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `index.html`
- `src/main.tsx`
- `src/vite-env.d.ts`
- `.gitignore`
- `.env.local`

### **Step 6: Update package.json**
Copy the complete `package.json` from above.

### **Step 7: Run Development Server**
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🎨 Design System

All styling is configured in `src/styles/globals.css`:
- **Primary Color:** `#6E56CF` (Royal Purple)
- **Typography:** Inter font family
- **Themes:** Dark (default) + Light mode
- **Accessibility:** WCAG 2.2 AA compliant

**No Tailwind config file needed** - using Tailwind 4.0 with CSS variables.

---

## 🧪 Testing the Setup

### **1. Check Landing Page**
Visit `http://localhost:5173/` → Should see marketing landing page

### **2. Test Navigation**
Click "Get Started" → Should navigate to dashboard (mock auth)

### **3. Test Theme Toggle**
Click sun/moon icon → Should switch between dark/light themes

### **4. Test AI Search**
Type `/show revenue` in search bar → Should open OptiPanel AI

### **5. Test Live Metrics**
Navigate to "Live Metrics" → Should see animated charts with mock data

---

## 🐛 Troubleshooting

### **Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **TypeScript errors:**
- Verify `tsconfig.json` is in project root
- Restart TypeScript server in your IDE
- Check all imports use correct paths

### **Tailwind not working:**
- Ensure `@tailwindcss/vite` is in `vite.config.ts`
- Verify `src/styles/globals.css` is imported in `src/main.tsx`
- Clear cache: `rm -rf node_modules/.vite`

### **Build fails:**
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Try building
npm run build
```

### **Port already in use:**
```bash
# Change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3001,
  },
  // ...
});
```

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Created `package.json`
- [ ] Created `vite.config.ts`
- [ ] Created `tsconfig.json`
- [ ] Created `tsconfig.node.json`
- [ ] Created `index.html`
- [ ] Created `src/main.tsx`
- [ ] Created `src/vite-env.d.ts`
- [ ] Created `.gitignore`
- [ ] Created `.env.local`
- [ ] Moved all files to `src/` directory
- [ ] Installed dependencies (`npm install`)
- [ ] Started dev server (`npm run dev`)
- [ ] App loads at `http://localhost:5173`
- [ ] No console errors
- [ ] Theme toggle works
- [ ] Navigation works
- [ ] All pages render

---

## 📚 Next Steps

1. ✅ Complete this setup
2. ✅ Read `BACKEND_INTEGRATION.md` for API integration
3. ✅ Review `INTEGRATION_GUIDE.md` for features
4. ✅ Check `LIVE_METRICS_README.md` for metrics system
5. ✅ See `QUICK_REFERENCE.md` for quick reference

---

## 🔗 Related Documentation

- **Backend Integration:** See `BACKEND_INTEGRATION.md`
- **Feature Guide:** See `INTEGRATION_GUIDE.md`
- **Live Metrics:** See `LIVE_METRICS_README.md`
- **Quick Reference:** See `QUICK_REFERENCE.md`

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Build Tool:** Vite 5.x  
**Framework:** React 18 + TypeScript
