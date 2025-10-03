#!/bin/bash

# Todo Application Setup Script
echo "🚀 Setting up Todo Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080/api"
    echo "   MySQL: localhost:3306"
    echo ""
    echo "📝 Test the API:"
    echo "   curl -X GET http://localhost:8080/api/tasks/recent"
    echo ""
    echo "🛑 To stop the application:"
    echo "   docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with:"
    echo "   docker-compose logs"
fi
