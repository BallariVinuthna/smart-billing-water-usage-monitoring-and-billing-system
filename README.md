# Smart Water Billing & Management System

A comprehensive MERN stack application for managing water usage, billing, and alerts in residential buildings.

## Features

-   **Admin Dashboard**: Manage Users, Buildings, and view System Analytics.
-   **Manager Dashboard**: Record Meter Readings, Generate Bills, and Manage Alerts.
-   **Resident Dashboard**: View Usage History, Pay Bills (Stripe Integration), and Receive Alerts.
-   **Automated Billing**: Tiered pricing calculation based on water consumption.
-   **Alert System**: Automated detection of high usage and leakages.

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (Local or Atlas)

## Project Structure

-   `/client`: React Frontend (Vite + Tailwind CSS)
-   `/server`: Node.js/Express Backend

## Setup & Installation

### 1. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vinuthna_gaaru
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Frontend Setup

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Running the Application

### Quick Start

Run the automated script to install dependencies and start both servers:

```bash
chmod +x start_app.sh
./start_app.sh
```

### 1. Seeding Data (Important!)

Before running the app, populate the database with initial data (Users, Buildings, Readings).
**Run this command inside the `server` directory:**

```bash
cd server
node seed.js
```

This will create the following default users:
-   **Admin**: `admin@example.com` / `password123`
-   **Manager**: `manager@example.com` / `password123`
-   **Resident**: `resident1@example.com` / `password123`

### 2. Start the Backend Server

```bash
cd server
npm start
```
The server will run on `http://localhost:5000`.

### 3. Start the Frontend Client

```bash
cd client
npm run dev
```
The client will usually run on `http://localhost:5173`.

## Usage Guide

1.  **Login**: Use the credentials provided above.
2.  **Admin**: Go to `/admin/dashboard` to manage the system.
3.  **Manager**: Go to `/manager/meter-readings` to add daily readings.
4.  **Resident**: Go to `/resident/monthly-bill` to view and pay bills.

## Troubleshooting

-   **Missing Data in Dashboard?**
    -   Ensure you have run `node seed.js`.
    -   If you see "No bills found", verify that the resident is assigned to an apartment (the seed script does this automatically).
    -   Try logging out and logging back in to refresh user session data.

-   **Port Conflicts?**
    -   If port 5000 is busy, change `PORT` in `server/.env` and update the API calls in the frontend accordingly.
