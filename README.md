# Savora

A modern restaurant reservation platform built with Next.js, providing a public booking experience for guests and a role-based dashboard for restaurant staff and administrators.

## Overview

Savora is a full-featured restaurant reservation frontend that allows guests to book tables based on date, party size, and available time slots, while staff can manage reservations and administrators can manage the restaurant's configuration.

The application supports English and Arabic with full RTL support and is designed with a responsive, modern restaurant-focused UI.

## Features

### Guest Experience

- Browse available tables by date and guest count
- Interactive table selection
- Select consecutive time slots
- Reservation form with validation
- Reservation confirmation with reservation code
- Reservation cancellation UI
- Responsive design for mobile, tablet, and desktop

### Staff Dashboard

- Reservation management
- Search and filtering
- Reservation status updates
- Reservation details
- Table availability overview
- Dashboard statistics

### Admin

- Table management
- Staff account management
- Working hours management
- Time slot duration configuration
- Role-based access control

### General

- English / Arabic localization
- Full RTL support
- Loading, error, and empty states
- Form validation with Zod
- Toast notifications
- Responsive UI
- Protected dashboard routes

## Reservation Flow

```text
Date & Guests
      ↓
Table Selection
      ↓
Time Slots
      ↓
Personal Information
      ↓
Confirmation
      ↓
Reservation Code