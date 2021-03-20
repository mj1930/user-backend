const router = require('express').Router();
const categoryCtrl = require('../controllers/categories');

router.post('/add-category', categoryCtrl.addCategorySubCategory);
router.post('/add-subcategory', categoryCtrl.addSubCategory);
router.post('/get-all-categories', categoryCtrl.listAllCategories);
router.post('/get-all-subcategories', categoryCtrl.listAllSubCategories);
router.post('/get-all', categoryCtrl.listAllCategoriesSubCategories);
router.get('/get-one-category', categoryCtrl.getOneCategory);

module.exports = router;