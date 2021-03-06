const { all } = require('underscore');
const productSchema = require('../models/products/products');

module.exports = {

    listAllProduct: async (req, res, next) => {
        try {
            let allProducts = await productSchema.find({
                isDeleted: false,
                isApproved: true
            }).lean();
            return res.json({
                code: 200,
                data: allProducts,
                message: "all product fetched successfully!!",
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
}