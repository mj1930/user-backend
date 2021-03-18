const cartSchema = require('../models/orders/cart');

const cartValidator = require('../validators/cart.validator');

module.exports = {
    
    addToCart: async (req, res, next) => {
        try {
            let { products, totalAmnt } = await cartValidator.addToCart().validateAsync(req.body);
            let cartData = await cartSchema.save({
                products,
                totalAmnt
            });
            return res.json({
                code: 200,
                data: cartData,
                message: "Added to cart",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    updateNewProductToCart: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { products, totalAmnt } = await cartValidator.updateNewProductToCart().validateAsync(req.body);
            if (quantity) {
                let cartData = await cartSchema.findOneAndUpdate({
                    _id: userId,
                    "products.productId": productId
                }, {
                    $push: {
                        "products": products
                    },
                    $set: {
                        totalAmnt
                    }
                }, {new: true}).lean();
                return res.json({
                    code: 200,
                    data: cartData,
                    message: "item updated from cart",
                    error: null
                });
            }
        } catch (err) {
            next(err);
        }
    },

    listCart: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit } = await cartValidator.listCart().validateAsync(req.body);
            let cartData = await cartSchema.find({
                _id: userId
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: cartData,
                message: "cart data listed",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    removeFromCart: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { productId, quantity } = await cartValidator.removeFromCart().validateAsync(req.body);
            if (quantity) {
                let cartData = await cartSchema.findOneAndUpdate({
                    _id: userId,
                    "products.productId": productId
                }, {
                    $set: {
                        "products.quantity": quantity
                    }
                }, {new: true}).lean();
                return res.json({
                    code: 200,
                    data: cartData,
                    message: "item removed from cart",
                    error: null
                });
            } else {
                let cartData = await cartSchema.findOneAndUpdate({
                    _id: userId,
                    "products.productId": productId
                }, {
                    $pull: {
                        "products.productId": productId
                    }
                }, {new: true}).lean();
                return res.json({
                    code: 200,
                    data: cartData,
                    message: "item removed from cart",
                    error: null
                });
            }
        } catch (err) {
            next(err);
        }
    }
};