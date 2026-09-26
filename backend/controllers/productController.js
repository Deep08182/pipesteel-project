const db = require('../database/db');

// Get all active products (public endpoint)
exports.getAllProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, name, category, tag, material, grades, short_desc, 
                   image_url, detail_url, spec_summary, highlights, created_at
            FROM products 
            WHERE is_active = true 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Get single product (public endpoint)
exports.getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Admin: Get all products (including inactive)
exports.adminGetAllProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all products:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
    const {
        name,
        category,
        tag,
        material,
        grades,
        short_desc,
        image_url,
        detail_url,
        spec_summary,
        highlights
    } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO products 
            (name, category, tag, material, grades, short_desc, image_url, detail_url, spec_summary, highlights) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [name, category, tag, material, grades, short_desc, image_url, detail_url, spec_summary, highlights]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        category,
        tag,
        material,
        grades,
        short_desc,
        image_url,
        detail_url,
        spec_summary,
        highlights,
        is_active
    } = req.body;

    try {
        const result = await db.query(
            `UPDATE products 
            SET name = COALESCE($1, name),
                category = COALESCE($2, category),
                tag = COALESCE($3, tag),
                material = COALESCE($4, material),
                grades = COALESCE($5, grades),
                short_desc = COALESCE($6, short_desc),
                image_url = COALESCE($7, image_url),
                detail_url = COALESCE($8, detail_url),
                spec_summary = COALESCE($9, spec_summary),
                highlights = COALESCE($10, highlights),
                is_active = COALESCE($11, is_active)
            WHERE id = $12
            RETURNING *`,
            [name, category, tag, material, grades, short_desc, image_url, detail_url, spec_summary, highlights, is_active, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.json({ msg: 'Product deleted successfully', product: result.rows[0] });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Admin: Toggle product active status
exports.toggleProductStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query(
            `UPDATE products 
            SET is_active = NOT is_active 
            WHERE id = $1 
            RETURNING *`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error toggling product status:', error.message);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};
