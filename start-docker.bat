@echo off
echo Starting Todo Application Docker Deployment...

echo.
echo Step 1: Stopping any existing containers...
docker-compose -f backend/docker-compose.yml down

echo.
echo Step 2: Removing old images (optional)...
docker image prune -f

echo.
echo Step 3: Building and starting all services...
cd backend
docker-compose up --build -d

echo.
echo Step 4: Waiting for services to be ready...
timeout /t 30

echo.
echo Step 5: Checking service status...
docker-compose ps

echo.
echo ========================================
echo Todo Application is now running!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080/api
echo MySQL Database: localhost:3306
echo ========================================
echo.
echo To stop the application, run:
echo docker-compose -f backend/docker-compose.yml down
echo.
echo To view logs, run:
echo docker-compose -f backend/docker-compose.yml logs -f [service-name]
echo.

pause
