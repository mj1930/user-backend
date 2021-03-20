const router = require('express').Router();
const productCtrl = require('../controllers/products');

router.post('/get-all-products', productCtrl.listAllProduct);
router.post('/get-products-by-category', productCtrl.findProductByCategory);
router.post('/get-products-by-city', productCtrl.findProductByLocation);
router.get('/get-product-by-id', productCtrl.findProductById);
router.get('/search-products', productCtrl.searchFromProducts);
module.exports = router;