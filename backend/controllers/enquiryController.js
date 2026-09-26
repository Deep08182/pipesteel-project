const db = require('../database/db');

// Helper to generate ENQ-YYYY-XXXXX format
const generateEnquiryId = async () => {
    const year = new Date().getFullYear();
    const prefix = `ENQ-${year}-`;
    // Find the latest ENQ for this year
    const result = await db.query(
        "SELECT id FROM enquiries WHERE id LIKE $1 ORDER BY id DESC LIMIT 1",
        [`${prefix}%`]
    );
    
    let nextNum = 1;
    if (result.rows.length > 0) {
        const lastId = result.rows[0].id;
        const lastNumStr = lastId.split('-')[2];
        if (lastNumStr) {
            nextNum = parseInt(lastNumStr, 10) + 1;
        }
    }
    
    // Pad with zeros to 5 digits
    const numStr = nextNum.toString().padStart(5, '0');
    return `${prefix}${numStr}`;
};

exports.createEnquiry = async (req, res) => {
    const { product_name, product_type, quantity, message, phone, whatsapp_number } = req.body;
    const user_id = req.user.id;

    try {
        const enquiryId = await generateEnquiryId();

        const insertQuery = `
            INSERT INTO enquiries 
            (id, user_id, product_name, product_type, quantity, message, phone, whatsapp_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [enquiryId, user_id, product_name, product_type, quantity, message, phone, whatsapp_number];
        
        const newEnquiry = await db.query(insertQuery, values);
        
        res.status(201).json(newEnquiry.rows[0]);

    } catch (error) {
        console.error("Error creating enquiry:", error);
        res.status(500).send('Server Error');
    }
};

exports.getMyEnquiries = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT * FROM enquiries WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).send('Server Error');
    }
};

exports.getEnquiry = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const result = await db.query('SELECT * FROM enquiries WHERE id = $1 AND user_id = $2', [id, user_id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Enquiry not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching enquiry:", error);
        res.status(500).send('Server Error');
    }
};
