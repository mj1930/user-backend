const router = require('express').Router();
const productCtrl = require('../controllers/products');

router.get('/get-all-products', productCtrl.listAllProduct);

module.exports = router;