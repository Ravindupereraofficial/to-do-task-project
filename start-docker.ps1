Write-Host "Starting Todo Application Docker Deployment..." -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Stopping any existing containers..." -ForegroundColor Yellow
Set-Location backend
docker-compose down

Write-Host ""
Write-Host "Step 2: Removing old images (optional)..." -ForegroundColor Yellow
docker image prune -f

Write-Host ""
Write-Host "Step 3: Building and starting all services..." -ForegroundColor Yellow
docker-compose up --build -d

Write-Host ""
Write-Host "Step 4: Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Step 5: Checking service status..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Todo Application is now running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "MySQL Database: localhost:3306" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the application, run:" -ForegroundColor Yellow
Write-Host "docker-compose -f backend/docker-compose.yml down" -ForegroundColor White
Write-Host ""
Write-Host "To view logs, run:" -ForegroundColor Yellow
Write-Host "docker-compose -f backend/docker-compose.yml logs -f [service-name]" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"
