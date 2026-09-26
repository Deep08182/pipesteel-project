const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

exports.register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    // Prevent normal users from selecting admin role
    const assignedRole = role === 'admin' ? 'user' : 'user';

    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, phone, passwordHash, assignedRole]
    );

    const payload = {
      user: {
        id: newUser.rows[0].id,
        role: newUser.rows[0].role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: newUser.rows[0] });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  const { email, password, requireAdmin } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const user = userResult.rows[0];

    // If requireAdmin is true, strictly check for admin role
    if (requireAdmin && user.role !== 'admin') {
         return res.status(403).json({ msg: 'Access Denied: Admin privileges required.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
            token, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMe = async (req, res) => {
    try {
        const userResult = await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [req.user.id]);
        if(userResult.rows.length === 0) {
             return res.status(404).json({ msg: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
