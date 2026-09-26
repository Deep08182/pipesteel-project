const db = require('../database/db');

exports.getAllEnquiries = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT e.*, u.name as customer_name, u.email as customer_email 
            FROM enquiries e
            JOIN users u ON e.user_id = u.id
            ORDER BY e.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching all enquiries:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.getEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
            SELECT e.*, u.name as customer_name, u.email as customer_email 
            FROM enquiries e
            JOIN users u ON e.user_id = u.id
            WHERE e.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Enquiry not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching enquiry:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.updateEnquiry = async (req, res) => {
    const { id } = req.params;
    const { status, admin_reply } = req.body;
    
    try {
        const result = await db.query(
            `UPDATE enquiries 
             SET status = COALESCE($1, status), 
                 admin_reply = COALESCE($2, admin_reply)
             WHERE id = $3
             RETURNING *`,
            [status, admin_reply, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Enquiry not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating enquiry:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, name, email, role, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const usersCount = await db.query("SELECT COUNT(*) FROM users WHERE role='user'");
        const totalEnq = await db.query("SELECT COUNT(*) FROM enquiries");
        const newEnq = await db.query("SELECT COUNT(*) FROM enquiries WHERE status='New'");
        const inReviewEnq = await db.query("SELECT COUNT(*) FROM enquiries WHERE status='In Review'");
        const completedEnq = await db.query("SELECT COUNT(*) FROM enquiries WHERE status='Completed'");

        res.json({
            total_users: parseInt(usersCount.rows[0].count),
            total_enquiries: parseInt(totalEnq.rows[0].count),
            new_enquiries: parseInt(newEnq.rows[0].count),
            in_review_enquiries: parseInt(inReviewEnq.rows[0].count),
            completed_enquiries: parseInt(completedEnq.rows[0].count)
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};
