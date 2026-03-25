-- Run this in Supabase SQL Editor

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial admin (email: admin@lifewood.com, password: StrongPassword123!)
INSERT INTO admins (id, email, password_hash, name)
VALUES (
  gen_random_uuid(),
  'admin@lifewood.com',
  '$2b$10$FaNzDwee811D55XzJvD6yuCZgUKKeFjcO1iFVTnyTovI.NbEXh1RC',
  'Super Admin'
);
