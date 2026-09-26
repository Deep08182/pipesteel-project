-- Supabase Database Schema for Steelcore Industries

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('CUSTOMER', 'ADMIN', 'SUPER_ADMIN')) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    material TEXT,
    specifications JSONB,
    applications JSONB,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RFQs (Requests for Quotation) Table
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    quantity INTEGER,
    material TEXT,
    specifications JSONB,
    priority TEXT CHECK (priority IN ('LOW', 'NORMAL', 'HIGH')) DEFAULT 'NORMAL',
    status TEXT CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'NEED_INFORMATION', 'QUOTATION_PREPARED', 'QUOTATION_SENT', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED', 'CANCELLED')) DEFAULT 'SUBMITTED',
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RFQ Updates Table
CREATE TABLE rfq_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    old_status TEXT,
    new_status TEXT,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Quotations Table
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_number TEXT UNIQUE NOT NULL,
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subtotal NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) DEFAULT 0,
    valid_until DATE,
    payment_terms TEXT,
    delivery_terms TEXT,
    status TEXT CHECK (status IN ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED')) DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Quotation Items Table
CREATE TABLE quotation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL
);

-- 7. Attachments Table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    industry TEXT NOT NULL,
    location TEXT,
    description TEXT,
    materials TEXT,
    scope TEXT,
    year INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup Row Level Security (RLS)
-- (Simplified for demonstration; you'd add proper CREATE POLICY statements here)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Basic Customer Policies for RFQs (Customers can view their own, Admins can view all)
CREATE POLICY "Customers can view their own RFQs" ON rfqs
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = rfqs.customer_id));
    
-- Add remaining policies as needed based on roles.
