#!/bin/bash
set -e

echo "🔨 Building frontend-rev-opt..."
cd frontend-rev-opt
npm install
npm run build
cd ..

echo "🔨 Building website-demo..."
cd website-demo
npm install
npm run build
cd ..

echo "📦 Installing backend dependencies..."
npm install

echo "✅ All builds complete!"
