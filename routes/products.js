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
router.post('/get-vin-products', productCtrl.getProductsByVin);
router.get('/get-home-products', productCtrl.getHomePageData);
router.post('/get-products', productCtrl.getProductCity);


// categories,line no.5 ,
// Mobile Routes
//demo by mihir jain
router.post('/vkreta/wp-json/wc/v3/products', productCtrl.listAllProduct);
router.post('/vkreta/wp-json/wc/v2/products/categories', productCtrl.findProductByCategory);
module.exports = router;