const router = require('express').Router();
const ratingCtrl = require('../controllers/rating');

router.get('/get-product-rating/:id', ratingCtrl.getProductRatings);

module.exports = router;