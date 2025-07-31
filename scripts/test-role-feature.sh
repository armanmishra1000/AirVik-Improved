#!/bin/bash

# Role Assignment Feature Testing Script
# This script helps set up and test the role assignment feature

echo "🚀 Starting Role Assignment Feature Testing Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Check if MongoDB is running (optional check)
if command_exists mongosh; then
    if mongosh --eval "db.runCommand('ping')" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB might not be running. Please start MongoDB if needed.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  MongoDB client not found. Please ensure MongoDB is running.${NC}"
fi

echo -e "${BLUE}📦 Installing Dependencies...${NC}"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
if npm install; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
if npm install; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}🔧 Checking Port Availability...${NC}"

# Check if ports are available
if port_in_use 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is in use. Backend might already be running.${NC}"
else
    echo -e "${GREEN}✅ Port 5000 is available for backend${NC}"
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Frontend might already be running.${NC}"
else
    echo -e "${GREEN}✅ Port 3000 is available for frontend${NC}"
fi

echo -e "${BLUE}🚀 Starting Servers...${NC}"

# Function to start backend
start_backend() {
    echo "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    cd ..
}

# Start servers
start_backend
sleep 3
start_frontend

echo -e "${BLUE}⏳ Waiting for servers to start...${NC}"
sleep 5

echo -e "${BLUE}🔍 Testing Server Connectivity...${NC}"

# Test backend connectivity
if curl -s http://localhost:5000/api/v1/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend might still be starting up...${NC}"
fi

# Test frontend connectivity
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend might still be starting up...${NC}"
fi

echo -e "${BLUE}📋 Testing Environment Ready!${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Backend: http://localhost:5000${NC}"
echo -e "${GREEN}✅ Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}✅ Role Management: http://localhost:3000/admin/roles${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Login with admin credentials"
echo "3. Navigate to /admin/roles"
echo "4. Follow the testing scenarios in TESTING-GUIDE.md"
echo ""
echo -e "${YELLOW}🔧 To stop servers:${NC}"
echo "Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${BLUE}📚 For detailed testing instructions, see:${NC}"
echo "docs/features/role-assignment-permission-check/TESTING-GUIDE.md"

# Wait for user input to stop servers
echo ""
echo -e "${YELLOW}Press Enter to stop servers and exit...${NC}"
read

# Cleanup
echo -e "${BLUE}🛑 Stopping servers...${NC}"
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo -e "${GREEN}✅ Servers stopped${NC}"
echo -e "${GREEN}✅ Testing environment cleaned up${NC}" 