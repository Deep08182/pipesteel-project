const express = require('express');
const router = express.Router();
const { getAllEnquiries, getEnquiry, updateEnquiry, getAllUsers, getDashboardStats } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.use(adminAuth);

router.get('/enquiries', getAllEnquiries);
router.get('/enquiries/:id', getEnquiry);
router.patch('/enquiries/:id', updateEnquiry);
router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);

module.exports = router;
