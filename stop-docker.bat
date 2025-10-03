@echo off
echo Stopping Todo Application Docker containers...

cd backend
docker-compose down

echo.
echo Containers stopped successfully!
echo.
echo To remove all data (including database), run:
echo docker-compose down -v
echo.

pause
