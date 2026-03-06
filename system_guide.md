# Smart Water Usage Monitoring System - User Guide

## Overview
This platform is designed to help residential and commercial building managers track water consumption, generate bills, and detect leakages effectively.

## 👥 User Roles
1. **Admin**: Superuser who sets up the system, creates Buildings, and manages Users (Managers).
2. **Manager**: Controls daily operations of a Building. Inputs meter readings, generates bills, and handles alerts.
3. **Resident**: End-user. Views their own consumption history, bills, and payment status.

## 🏗 Database Data Flow
- **Building Hierarchy**: A `Building` contains multiple `Floors`. Each `Floor` has multiple `Apartments`.
- **Meter Readings**: Readings (in Liters) are linked to an `Apartment` and `Building`. They are timestamped.
- **Billing**: The system calculates consumption (`Current - Previous Reading`) and applies tariff slabs to generate a `Bill`.
- **Alerts**: Triggered when consumption exceeds thresholds or abnormal patterns (e.g., continuous flow at 3 AM).

## 📄 Page Guide

### 1. Authentication
- **/login**: Universal login for all roles. Redirects to appropriate dashboard.
- **/register**: Public registration (defaults to 'Resident' role).

### 2. Admin Portal
- **Dashboard**: System health, total users, total buildings.
- **Manage Buildings**: Create new buildings, add floors/apartments.
- **Manage Users**: View all users, delete spammers, assign Managers to Buildings.

### 3. Manager Portal
- **Dashboard**: Quick stats (Total Water Used, Revenue Pending).
- **Readings**:
  - *Manual Entry*: Input reading for a specific apartment.
  - *IoT Simulation*: Simulate readings for demo purposes.
- **Billing**:
  - *Generate*: Create bills for a specific month.
  - *View Pending*: See who hasn't paid.
- **Alerts**: View high-severity alerts (e.g., "Leakage in Apt 302").

### 4. Resident Portal
- **Dashboard**: Current month's usage vs average. Pending Bill warning.
- **Usage History**: Chart showing last 6 months consumption.
- **Payments**: Pay bills (Demo only).

## 🛠 API Reference (Key Endpoints)
- `POST /api/readings`: Add new reading.
- `POST /api/billing/generate`: Trigger bill calculation.
- `GET /api/reports/dashboard`: Fetch aggregate stats.
