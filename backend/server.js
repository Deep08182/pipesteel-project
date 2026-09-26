const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));

// Fallback for frontend routing (if any)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
