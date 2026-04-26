-- Baptism RSVP Database Schema
-- Run this in Supabase SQL Editor

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN DEFAULT true,
  guest_count INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT
);

-- Enable Row Level Security
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for RSVP form)
CREATE POLICY "Allow public inserts" ON rsvps
  FOR INSERT TO PUBLIC WITH CHECK (true);

-- Create policy to allow public reads (for admin viewing)
CREATE POLICY "Allow public reads" ON rsvps
  FOR SELECT TO PUBLIC USING (true);

-- Create policy to allow public deletes (for admin management)
CREATE POLICY "Allow public deletes" ON rsvps
  FOR DELETE TO PUBLIC USING (true);

-- Create index for faster queries
CREATE INDEX idx_rsvps_attending ON rsvps(attending);
CREATE INDEX idx_rsvps_created_at ON rsvps(created_at DESC);
