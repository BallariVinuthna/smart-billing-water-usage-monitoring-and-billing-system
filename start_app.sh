#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

echo "Starting Smart Water Billing System..."

# --- Backend ---
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat <<EOT >> .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vinuthna_gaaru
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_secret_key
EOT
fi

echo "Starting Backend Server..."
npm start &
BACKEND_PID=$!

# --- Frontend ---
cd ../client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    echo "VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key" > .env
fi

echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "--------------------------------------------------"
echo "Application started!"
echo "Backend running at: http://localhost:5000"
echo "Frontend running at: http://localhost:5173"
echo "--------------------------------------------------"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID