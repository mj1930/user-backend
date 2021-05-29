const router = require('express').Router();
const orderCtrl = require('../controllers/orders');
const { authorize } = require('../middleware/auth');

router.post('/add-order', authorize, orderCtrl.addOrder);
router.post('/list-orders', authorize, orderCtrl.listOrders);
router.post('/filter-orders', authorize, orderCtrl.filterProducts);
router.get('/get-orders', authorize, orderCtrl.orderStatus);
router.get('/get-order/:id', authorize, orderCtrl.orderStatusFindOne);
router.get('/print-invoice/:id', authorize, orderCtrl.printInvoice);
router.post('/rate-product', authorize, orderCtrl.addRatingAndFeedback);

//order history line 6.
router.post('/vkreta/wp-json/wc/v2/orders', authorize, orderCtrl.listOrders);
module.exports = router;