-- Enable UUID extension if supported by the DB (Supabase supports this out of the box)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(50) PRIMARY KEY, -- We'll generate ENQ-XXXX format IDs in JS
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(255),
    quantity VARCHAR(100) NOT NULL,
    message TEXT,
    phone VARCHAR(50),
    whatsapp_number VARCHAR(50),
    status VARCHAR(50) CHECK (status IN ('New', 'In Review', 'Contacted', 'Quotation Sent', 'Completed', 'Closed')) DEFAULT 'New',
    admin_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON enquiries;
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
