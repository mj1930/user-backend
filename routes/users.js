const router = require('express').Router();
const userCtrl = require('../controllers/users');
const { authorize } = require('../middleware/auth');

router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.get('/get-user-details', authorize, userCtrl.getUserData);
router.put('/update-user-details', authorize, userCtrl.updateUserData);
router.put('/save-address', authorize, userCtrl.saveAddress);

module.exports = router;