const router = require('express').Router();
const cartCtrl = require('../controllers/cart');
const { authorize } = require('../middleware/auth');

router.post('/add-cart', authorize, cartCtrl.addToCart);
router.post('/list-cart', authorize, cartCtrl.listCart);
router.post('/update-cart', authorize, cartCtrl.updateNewProductToCart);
router.post('/remove-cart', authorize, cartCtrl.removeFromCart);
router.post('/update-quantity', authorize, cartCtrl.updateQuantity);

module.exports = router;