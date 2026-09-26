// AR Group Product Catalog Configuration
// Note: This file previously contained static products but now products 
// are loaded dynamically from the database via API

// Initialize empty catalog - will be populated from database
const PRODUCT_CATALOG = [];

// Make it available globally (for backward compatibility)
window.PRODUCT_CATALOG = PRODUCT_CATALOG;
