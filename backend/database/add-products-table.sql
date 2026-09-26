-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    material VARCHAR(255),
    grades TEXT[], -- Array of grades
    short_desc TEXT,
    image_url VARCHAR(500),
    detail_url VARCHAR(500),
    spec_summary JSONB, -- JSON object for specifications
    highlights TEXT[], -- Array of highlights
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial products (from company-config.js)
INSERT INTO products (name, category, tag, material, grades, short_desc, image_url, spec_summary, highlights) VALUES
(
    'Ar Aluminium Top Self Adhesive Membrane 1.5 mm',
    'Self-Adhesive Bitumen Waterproofing / Flashing Membrane',
    'WATERPROOFING MEMBRANE',
    'Bituminous & Aluminium Film',
    ARRAY['1.5 mm Thickness', 'Bituminous Membrane'],
    'Ar Aluminium top self adhesive membrane is widely used & excellent product for waterproofing of rooftops & joints & shades.',
    'images/tape_top.webp',
    '{"Price": "Approx. ₹200 / Sq. Meter", "Roll Size / Coverage": "1x10 m (10 sqm)", "Brand": "Ar Aluminium Top"}'::jsonb,
    ARRAY['Self-adhesive for easy application', 'Aluminium film top layer for UV protection', 'Excellent waterproofing for rooftops and joints', 'Bituminous base for superior adhesion']
),
(
    'AR Oil/Solvent Based Bituminous Primer',
    'Bituminous Primers & Coatings',
    'BONDING PRIMER',
    'Solvent Based Bitumen',
    ARRAY['IS 3384-1986', 'Item Code: ARL2'],
    'Solvent based bituminous primer that seals concrete surface pores & improves membrane adhesion.',
    'images/bitumen_primer_can.webp',
    '{"Price": "Approx. ₹60 / Litre", "Min Order Qty": "20 Litre", "Application": "Cement / Concrete (Brush/Spray)"}'::jsonb,
    ARRAY['IS 3384-1986 compliant', 'Seals concrete surface pores', 'Improves membrane adhesion', 'Solvent based for quick drying', 'Brush or spray application']
),
(
    'SBS Water Proofing Membrane',
    'Self-Adhesive Bitumen Waterproofing / Flashing Membrane',
    'SBS MEMBRANE',
    'SBS Modified Bitumen & Polyester Mat',
    ARRAY['3 mm', 'Polyester Mat Core'],
    'Pre-fabricated elastomeric SBS modified bitumen membrane with spunbond polyester core.',
    'images/sbs_membrane.png',
    '{"Price": "Approx. ₹1,250 / Roll", "Roll Size": "1x10 m (3 mm)", "Method": "Torch Applied"}'::jsonb,
    ARRAY['SBS modified bitumen for flexibility', 'Polyester mat reinforcement', 'Torch applied for strong bond', 'Elastomeric properties', 'Excellent elongation and recovery']
);
