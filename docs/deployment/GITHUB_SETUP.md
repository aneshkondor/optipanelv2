# 🚀 GitHub Repository Setup Guide

## Method 1: Using GitHub Website (Easiest)

### Step 1: Create Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon in top-right corner
3. Click **"New repository"**
4. Fill in details:
   - **Repository name**: `calhacks-revenue-optimizer` (or whatever you want)
   - **Description**: "AI-powered revenue optimization platform with voice calling"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** check "Add a README file" (you already have one)
   - **DO NOT** add .gitignore or license (you might have these already)
5. Click **"Create repository"**

### Step 2: Push Your Code

GitHub will show you commands. Run these in your terminal:

```bash
# Make sure you're in the project directory
cd /Users/aryankhandelwal/Desktop/calhacks

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: CalHacks revenue optimization platform"

# Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example with actual username:**
```bash
git remote add origin https://github.com/aryankhandelwal/calhacks-revenue-optimizer.git
git push -u origin main
```

---

## Method 2: Using GitHub CLI (Faster)

If you have GitHub CLI installed:

```bash
# Make sure you're in the project directory
cd /Users/aryankhandelwal/Desktop/calhacks

# Login to GitHub (first time only)
gh auth login

# Create repo and push in one command
gh repo create calhacks-revenue-optimizer --public --source=. --push

# Or for private repo:
gh repo create calhacks-revenue-optimizer --private --source=. --push
```

---

## Important: .gitignore Setup

Before pushing, make sure you have a `.gitignore` file to avoid committing sensitive data:

```bash
# Create/update .gitignore
cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production
.env.*.local

# Dependencies
node_modules/
*/node_modules/

# Build outputs
build/
dist/
*/build/
*/dist/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# Misc
.cache/
.temp/
EOF
```

---

## Verify .env is NOT Committed

**VERY IMPORTANT**: Make sure your `.env` file with API keys is NOT pushed to GitHub!

```bash
# Check if .env is ignored
git status

# If you see .env in the list, it's NOT ignored - STOP!
# Make sure .gitignore contains .env, then run:
git rm --cached .env
git add .gitignore
git commit -m "Remove .env from tracking"
```

---

## After Creating GitHub Repo

### Update README.md

Add your GitHub repo URL to the README:

```markdown
# CalHacks Revenue Optimization Platform

🔗 **Repository**: https://github.com/YOUR_USERNAME/YOUR_REPO

## Quick Links
- Dashboard (Vercel): Coming soon
- Backend (Railway): Coming soon
- Demo Site: Coming soon
```

### Commit and Push

```bash
git add README.md
git commit -m "Update README with repo link"
git push
```

---

## Deploy from GitHub

Once your code is on GitHub, you can deploy:

### Railway (Backend)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy!

### Vercel (Frontend)
1. Go to https://vercel.com
2. Click "New Project" → Import Git Repository
3. Select your repository
4. Set root directory to `frontend02`
5. Add environment variables
6. Deploy!

---

## Troubleshooting

### "Permission denied (publickey)"
You need to set up SSH keys or use HTTPS with a personal access token.

**Use HTTPS (easier):**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push
# GitHub will ask for username and password/token
```

### "Repository already exists"
The repo name is taken. Choose a different name or:
```bash
# Use existing repo
git remote add origin https://github.com/YOUR_USERNAME/EXISTING_REPO.git
git push -u origin main
```

### "Branch diverged"
```bash
# Force push (CAREFUL - overwrites remote)
git push -f origin main
```

---

## Quick Commands Reference

```bash
# Check git status
git status

# Add specific files
git add frontend02/src/

# Add all files
git add .

# Commit with message
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin NEW_URL
```

---

## Next Steps

After pushing to GitHub:
1. ✅ Create GitHub repository
2. ✅ Push your code
3. 📝 Follow [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) to deploy to Railway + Vercel
4. 🎉 Your app is live!