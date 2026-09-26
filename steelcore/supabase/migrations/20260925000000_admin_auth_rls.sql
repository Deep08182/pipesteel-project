-- 1. Add admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    phone_number TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add is_active to products for soft-delete
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Create view for daily RFQ volume (Analytics)
CREATE OR REPLACE VIEW rfq_daily_volume AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_rfqs,
    COUNT(CASE WHEN status = 'SUBMITTED' THEN 1 END) as pending_rfqs,
    COUNT(CASE WHEN status = 'IN_PRODUCTION' THEN 1 END) as in_production_rfqs
FROM rfqs
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 4. Set up Row Level Security (RLS)

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);
-- Admins can do everything
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- PRODUCTS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Public can view active products
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (is_active = true);
-- Admins have full access to products
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- RFQS
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
-- Customers can view their own RFQs
CREATE POLICY "Customers can view their own RFQs" ON rfqs
    FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = rfqs.customer_id)
    );
-- Customers can insert their own RFQs
CREATE POLICY "Customers can insert their own RFQs" ON rfqs
    FOR INSERT WITH CHECK (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = rfqs.customer_id)
    );
-- Admins have full access to RFQs
CREATE POLICY "Admins can manage RFQs" ON rfqs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- RFQ UPDATES
ALTER TABLE rfq_updates ENABLE ROW LEVEL SECURITY;
-- Customers can view updates for their own RFQs
CREATE POLICY "Customers view own RFQ updates" ON rfq_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM rfqs 
            JOIN profiles ON profiles.id = rfqs.customer_id 
            WHERE rfqs.id = rfq_updates.rfq_id AND profiles.user_id = auth.uid()
        )
    );
-- Admins have full access to RFQ updates
CREATE POLICY "Admins can manage RFQ updates" ON rfq_updates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- QUOTATIONS & QUOTATION ITEMS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
-- Customers can view their own quotations
CREATE POLICY "Customers can view own quotations" ON quotations
    FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = quotations.customer_id)
    );
CREATE POLICY "Customers can view own quotation items" ON quotation_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quotations 
            JOIN profiles ON profiles.id = quotations.customer_id 
            WHERE quotations.id = quotation_items.quotation_id AND profiles.user_id = auth.uid()
        )
    );
-- Admins have full access
CREATE POLICY "Admins can manage quotations" ON quotations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );
CREATE POLICY "Admins can manage quotation items" ON quotation_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- ATTACHMENTS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own attachments" ON attachments
    FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = attachments.uploaded_by)
    );
CREATE POLICY "Users insert own attachments" ON attachments
    FOR INSERT WITH CHECK (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = attachments.uploaded_by)
    );
CREATE POLICY "Admins can manage attachments" ON attachments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON notifications
    FOR ALL USING (
        auth.uid() = (SELECT user_id FROM profiles WHERE id = notifications.user_id)
    );
CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- ADMIN CREDENTIALS
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
-- No public policies! Only Service Role can access this table.
