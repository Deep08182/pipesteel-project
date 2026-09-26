const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    getProduct,
    adminGetAllProducts,
    createProduct, 
    updateProduct, 
    deleteProduct,
    toggleProductStatus
} = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin routes
router.get('/admin/all', adminAuth, adminGetAllProducts);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.patch('/:id/toggle', adminAuth, toggleProductStatus);

module.exports = router;
