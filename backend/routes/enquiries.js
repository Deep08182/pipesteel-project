const express = require('express');
const router = express.Router();
const { createEnquiry, getMyEnquiries, getEnquiry } = require('../controllers/enquiryController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createEnquiry);
router.get('/my', auth, getMyEnquiries);
router.get('/:id', auth, getEnquiry);

module.exports = router;
