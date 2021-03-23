const router = require('express').Router();
const productCtrl = require('../controllers/products');

router.post('/get-all-products', productCtrl.listAllProduct);
router.post('/get-products-by-category', productCtrl.findProductByCategory);
router.post('/get-products-by-city', productCtrl.findProductByLocation);
router.post('/get-products-by-price', productCtrl.filterProductsByPrice);
router.post('/get-products-by-color', productCtrl.filterProductsByColors);
router.get('/get-product-by-id', productCtrl.findProductById);
router.get('/search-products', productCtrl.searchFromProducts);
router.post('/sort-products', productCtrl.sortProduct);

module.exports = router;