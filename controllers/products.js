const productSchema = require('../models/products/products');
const productValidator = require('../validators/products.validators');

module.exports = {

    listAllProduct: async (req, res, next) => {
        try {
            let { skip, limit } = await productValidator.listAllProduct().validateAsync(req.body);
            let allProducts = await productSchema.find({
                $and: [
                    {isDeleted: false},
                    { isApproved: true },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
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
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
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
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
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
                $and: [
                    {_id: productId},
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
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
                $and: [
                    {
                        isApproved: true
                    },
                    {
                        $or: [
                            { itemName: { $regex: new RegExp(term, 'i') }},
                            { barcode:  { $regex: new RegExp(term, 'i') }}
                        ]
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            }).sort({ updatedBy : -1}).lean();
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
    },

    filterProductsByPrice: async (req, res, next) => {
        try {
            let { skip, limit, lowerPrice, higherPrice, categoryId } = await productValidator.filterProductsByPrice().validateAsync(req.body);
            let productsData = await productSchema.find({
                $and : [
                    { isApproved: true },
                    { categoryId },
                    {
                        mrp: {
                        $gte: lowerPrice,
                        $lte: higherPrice
                        }
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: productsData,
                message: "filtered by price",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    filterProductsByColors : async (req, res, next) => {
        try {
            let { skip, limit, color, categoryId } = await productValidator.filterProductsByColor().validateAsync(req.body);
            let productsData = await productSchema.find({
                $and : [
                    { isApproved: true },
                    { categoryId },
                    {
                        color: { $in: color}
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: productsData,
                message: "filtered by color",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    filterProductsByRating : async (req, res, next) => {
        try {
            let { skip, limit, rating, categoryId } = await productValidator.filterProductsByRating().validateAsync(req.body);
            let productsData = await productSchema.find({
                $and : [
                    { 
                        isApproved: true 
                    },
                    { categoryId },
                    {
                        rating: {
                            $gte: rating
                        }
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: productsData,
                message: "filtered by rating",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    sortProduct: async (req, res, next) => {
        try {
            let { key, sortBy, skip, limit } = await productValidator.sortProducts().validateAsync(req.body);
            let query = {};
            query[key] = sortBy;
            let products = await productSchema.find({
                $and: [
                    { isApproved: true },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort(query)
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: products,
                message: "Sorted List",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    getRelatedProducts: async (req, res, next) => {
        try {
            let categoryId = req.body.categoryId;
            let itemName = req.body.itemName;
            let getrelatedProducts = await productSchema.find({
                $and: [
                    { isApproved: true},
                    { 
                        $or: [
                            { categoryId },
                            { itemName },
                        ]
                    },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            })
            .sort({ updatedBy : -1})
            .skip(0)
            .limit(10)
            .lean();
            return res.send({
                code: 200,
                data: getrelatedProducts,
                message: "",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    getProductsByVin: async (req, res, next) => {
        try {
            let { vin } = req.body;
            let vinProducts = []
            if (vin) {
                vinProducts = await productSchema.find({
                    $and: [
                        { isApproved: true },
                        { vin }
                    ]
                }).lean();
            } else {
                return res.json({
                    code: 400,
                    data: vinProducts,
                    message: "",
                    error: null
                });   
            }
            return res.json({
                code: 200,
                data: vinProducts,
                message: "",
                error: null
            });
        } catch (next) {
            next(err);
        }
    },

    getHomePageData: async (req, res, next) => {
        try {
            let products = await productSchema.find({
                $and: [
                    { isApproved: true },
                    {
                        availableUnits: {
                            $gte: 1
                        }
                    }
                ]
            }).sort({ updatedBy : -1})
            .limit(3)
            .lean();
            return res.json({
                code: 200,
                data: products,
                message: "",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    getProductCity: async(req, res, next) => {
        try {
            let productIds = JSON.parse(req.body.ids);
            let citiesData = await productSchema.find({
                _id: {
                    $in: [productIds]
                }
            }, { city :1}).lean();
            return res.json({
                code:200,
                data: citiesData,
                message: "",
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
}