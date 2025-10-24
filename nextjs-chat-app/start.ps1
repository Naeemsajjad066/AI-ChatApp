# Quick Start Script for PowerShell
# Run this after setting up Supabase and adding your .env.local

Write-Host "🚀 Starting Next.js AI Chat App..." -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host ""
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host "🔧 Please edit .env.local and add your Supabase credentials" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again!" -ForegroundColor Cyan
    exit
}

Write-Host "✅ Environment variables found" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    Write-Host ""
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Checklist:" -ForegroundColor Cyan
Write-Host "   [ ] Created Supabase project" -ForegroundColor White
Write-Host "   [ ] Ran SQL migration in Supabase SQL Editor" -ForegroundColor White
Write-Host "   [ ] Added credentials to .env.local" -ForegroundColor White
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "App will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
