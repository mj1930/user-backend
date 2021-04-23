const router = require('express').Router();
const orderCtrl = require('../controllers/orders');
const { authorize } = require('../middleware/auth');

router.post('/add-order', authorize, orderCtrl.addOrder);
router.post('/list-orders', authorize, orderCtrl.listOrders);
router.post('/filter-orders', authorize, orderCtrl.filterProducts);
router.get('/get-orders', authorize, orderCtrl.orderStatus);

module.exports = router;