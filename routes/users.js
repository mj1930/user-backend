const router = require('express').Router();
const userCtrl = require('../controllers/users');
const { authorize } = require('../middleware/auth');

router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.get('/get-user-details', authorize, userCtrl.getUserData);
router.put('/update-user-details', authorize, userCtrl.updateUserData);
router.put('/save-address', authorize, userCtrl.saveAddress);

// Mobiles app
router.post('/vkreta/wp-json/api/flutter_user/generate_auth_cookie', userCtrl.login);
router.post('/vkreta/wp-json/api/flutter_user/sign_up', userCtrl.signup);
router.get('/vkreta/wp-json/api/flutter_user/get_currentuserinfo', authorize, userCtrl.getUserData);
module.exports = router;