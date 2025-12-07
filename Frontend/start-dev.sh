#!/bin/bash

echo "Starting HotCinemas Development Environment..."
echo

echo "Starting Backend (Spring Boot)..."
cd backend
gnome-terminal --title="HotCinemas Backend" -- bash -c "mvn spring-boot:run; exec bash" &
cd ..

echo
echo "Starting Frontend (React)..."
cd frontend
gnome-terminal --title="HotCinemas Frontend" -- bash -c "npm run dev; exec bash" &
cd ..

echo
echo "Development servers are starting..."
echo "Backend will be available at: http://localhost:8080/api"
echo "Frontend will be available at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers"
wait 