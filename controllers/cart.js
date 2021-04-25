const cartSchema = require('../models/orders/cart');

const cartValidator = require('../validators/cart.validator');

module.exports = {
    
    addToCart: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { products, totalAmnt } = await cartValidator.addToCart().validateAsync(req.body);
            let cartData = await cartSchema.create({
                products,
                totalAmnt,
                userId
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
            let { product, totalAmnt } = await cartValidator.updateNewProductToCart().validateAsync(req.body);
            let cartData = await cartSchema.findOneAndUpdate({
                userId
            }, {
                $push: {
                    products: product
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
        } catch (err) {
            next(err);
        }
    },

    updateQuantity: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { productId, quantity, totalAmnt } = await cartValidator.updateQuantity().validateAsync(req.body);
            let cartData = await cartSchema.findOneAndUpdate({
                userId,
                "products.productId": productId
            }, {
                $inc: {
                    "products.$.quantity":  1
                },
                $set: {
                    totalAmnt
                }
            }, {new: true}).lean();
            return res.json({
                code: 200,
                data: cartData,
                message: "item removed from cart",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    listCart: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit } = await cartValidator.listCart().validateAsync(req.body);
            let cartData = await cartSchema.find({
                userId
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
            let { productId, quantity, totalAmnt } = await cartValidator.removeFromCart().validateAsync(req.body);
            // if (quantity) {
                let cartData = await cartSchema.findOneAndUpdate({
                    userId,
                    "products.productId": productId
                },
                {
                    $inc: {
                        "products.$.quantity": -1
                    },
                    $set: {
                        totalAmnt
                    }
                }, {new: true}).lean();
                for (let i = 0 ; i < cartData.products.length;i++) {
                    let product = cartData.products[i];
                    if (!product.quantity) {
                        cartData = await cartSchema.findOneAndUpdate({
                            userId,
                            "products.productId": productId
                        }, {
                            $pull: {
                                "products": { productId }
                            }
                        }, {new: true}).lean()
                    }
                }
                if (cartData.products.length == 0) {
                    await cartSchema.remove({
                        userId
                    });
                }
                return res.json({
                    code: 200,
                    data: cartData,
                    message: "item removed from cart",
                    error: null
                });
            // }
        } catch (err) {
            next(err);
        }
    },

    removeProductAfterOrder: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            await cartSchema.remove({
                userId
            });
            return res.json({
                code: 200,
                data: {},
                message: "item removed from cart",
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
};