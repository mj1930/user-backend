const productSchema = require('../models/products/products');
const productValidator = require('../validators/products.validators');

module.exports = {

    listAllProduct: async (req, res, next) => {
        try {
            let { skip, limit } = await productValidator.listAllProduct().validateAsync(req.body);
            let allProducts = await productSchema.find({
                isDeleted: false,
                isApproved: true
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: allProducts,
                message: "all product fetched successfully!!",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    findProductByCategory: async (req, res, next) => {
        try {
            let { categoryId, skip, limit } = await productValidator.findProductByCategory().validateAsync(req.body);
            let allProducts = await productSchema.find({
                $and: [
                    {
                        categoryId
                    },
                    {
                        isDeleted: false,
                        isApproved: true
                    }
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: allProducts,
                message: "all product fetched successfully!!",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    findProductByLocation: async (req, res, next) => {
        try {
            let { city, skip, limit } = await productValidator.findProductByLocation().validateAsync(req.body);
            let allProducts = await productSchema.find({
                $and: [
                    {
                        city: new RegExp(city, 'i')
                    },
                    {
                        isDeleted: false,
                        isApproved: true
                    }
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: allProducts,
                message: "all product fetched successfully!!",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    findProductById: async (req, res, next) => {
        try {
            let { productId } = await productValidator.findProductById().validateAsync(req.query);
            let productData = await productSchema.findOne({
                _id: productId
            }).lean();
            return res.json({
                code: 200,
                data: productData,
                message: "Product found",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    searchFromProducts: async (req, res, next) => {
        try {
            let { term } = await productValidator.searchProduct().validateAsync(req.query);
            let searchedProducts = await productSchema.find({
                $or: [
                    {itemName: { $regex: new RegExp(term, 'i') }},
                    { barcode:  { $regex: new RegExp(term, 'i') }}
                ]
            }).lean();
            if (searchedProducts && searchedProducts.length > 0) {
                return res.json({
                    code: 200,
                    data: searchedProducts,
                    message: "all product fetched successfully!!",
                    error: null
                });
            } else {
                return res.json({
                    code: 400,
                    data: {},
                    message: "No products found !!",
                    error: null
                });
            }
        } catch (err) {
            next(err);
        }
    }
}