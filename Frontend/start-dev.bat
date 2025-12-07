@echo off
echo Starting HotCinemas Development Environment...
echo.

echo Starting Backend (Spring Boot)...
cd backend
start "HotCinemas Backend" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo Starting Frontend (React)...
cd frontend
start "HotCinemas Frontend" cmd /k "npm run dev"
cd ..

echo.
echo Development servers are starting...
echo Backend will be available at: http://localhost:8080/api
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul 