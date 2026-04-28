#!/bin/bash

# Start AI Assistant Integration - Both Backend and Frontend

echo "🚀 Starting Remote Interview Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to handle Ctrl+C
cleanup() {
    echo ""
    echo "${YELLOW}Shutting down services...${NC}"
    kill %1 %2 2>/dev/null
    exit 0
}

trap cleanup SIGINT

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install it first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# Start Flask API Server in background
echo "${GREEN}Starting AI API Server...${NC}"
cd ai-assistant
python3 api_server.py &
FLASK_PID=$!
sleep 2

# Check if Flask started successfully
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "❌ Failed to start Flask server"
    exit 1
fi

echo "${GREEN}✅ AI API Server running on http://localhost:5000${NC}"
echo ""

# Start Next.js frontend
echo "${GREEN}Starting Next.js Frontend...${NC}"
cd ..
npm run dev &
NEXT_PID=$!

echo "${GREEN}✅ Frontend starting on http://localhost:3000${NC}"
echo ""
echo "${YELLOW}Both services are running!${NC}"
echo ""
echo "📝 Services:"
echo "  - Flask AI Server: http://localhost:5000"
echo "  - Next.js Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for both processes
wait
