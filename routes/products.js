const router = require('express').Router();
const productCtrl = require('../controllers/products');

router.post('/get-all-products', productCtrl.listAllProduct);
router.post('/get-products-by-category', productCtrl.findProductByCategory);
router.post('/get-products-by-city', productCtrl.findProductByLocation);
router.post('/get-products-by-price', productCtrl.filterProductsByPrice);
router.post('/get-products-by-color', productCtrl.filterProductsByColors);
router.post('/get-products-by-rating', productCtrl.filterProductsByRating);
router.get('/get-product-by-id', productCtrl.findProductById);
router.get('/search-products', productCtrl.searchFromProducts);
router.post('/sort-products', productCtrl.sortProduct);
router.post('/get-related-products', productCtrl.getRelatedProducts);
router.get('/get-home-products', productCtrl.getHomePageData);
router.post('/get-products', productCtrl.getProductCity);

module.exports = router;