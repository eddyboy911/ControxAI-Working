-- Migration: Add missing columns to bookings table for dental clinic appointment tracking
ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS preferred_date TEXT,
    ADD COLUMN IF NOT EXISTS preferred_time TEXT,
    ADD COLUMN IF NOT EXISTS reason TEXT,
    ADD COLUMN IF NOT EXISTS service_type TEXT;
