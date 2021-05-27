const orderSchema = require('../models/orders/orders');
const userSchema = require('../models/customers/users');
const sellerSchema = require('../models/users/users');
const productSchema = require('../models/products/products');
const ratingSchema = require('../models/products/rating');
const orderValidator = require('../validators/orders.validators');
const _ = require('underscore');
const crypto = require('../utils/crypto/Crypto');

module.exports = {

    addOrder: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { products, totalAmnt, address,
                  userGstin, businessName, paymentMode } = await orderValidator.addOrder().validateAsync(req.body);
            let orderData = await orderSchema.create({
                mode: "website",
                products,
                userId,
                totalAmnt,
                address,
                userGstin,
                businessName,
                paymentMode
            });
            for (let i = 0; i < products.length;i++) {
                let productData = products[i];
                await productSchema.findOneAndUpdate({
                    _id: productData.productId
                }, {
                    $inc: {
                        availableUnits : -parseInt(productData.quantity)
                    },
                    $inc: {
                        soldUnit: parseInt(productData.quantity)
                    }
                });
            }
            return res.json({
                code: 200,
                data: orderData,
                message: 'Order placed successfully',
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    listOrders: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit } = await orderValidator.listOrders().validateAsync(req.body);
            let orders = await orderSchema.find({userId})
            .sort({ createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean();
            let userName = await userSchema.findOne({
                _id: userId
            }).lean();
            return res.json({
                code: 200,
                data: {
                    orders,
                    name: userName.fname + " " + userName.lname
                },
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    filterProducts: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let { skip, limit, status } = await orderValidator.filterOrders().validateAsync(req.body);
            let orders = await orderSchema.find({
                $and: [
                    {
                        userId
                    },
                    {
                        orderStatus: status
                    }
                ]
            })
            .skip(skip)
            .limit(limit)
            .lean();
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    orderStatus: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let orders = await orderSchema.findById(userId);
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    orderStatusFindOne: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let id = req.params.id;
            let orders = await orderSchema.findOne({
                $and: [
                    {
                        userId
                    },
                    {
                        _id: id
                    }
                ]
            });
            return res.json({
                code: 200,
                data: orders,
                message: "Orders list fetched",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    addRatingAndFeedback: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let userName = req.decoded.name;
            let { rating, feedback, productId, orderId } = await orderValidator.rateOrder().validateAsync(req.body);
            await ratingSchema.create({
                feedback,
                productId,
                customerId: userId,
                name: userName,
                rating
            });
            let orderData = await orderSchema.findOneAndUpdate({
                _id: orderId
            }, {
                $set: {
                    isFeedBackGiven: true
                }
            }, { new: true}).lean();
            let totalRating = await ratingSchema.find({ productId }).lean();
            let prevRating = 0;
            prevRating += parseInt(rating)
            totalRating.forEach(item => {
                prevRating += item.rating;
            });
            prevRating = parseInt(rating / totalRating.length);
            await productSchema.updateOne({
                _id: productId,
            }, {
                $set: {
                    rating: prevRating
                }
            });
            return res.send({
                code: 200,
                data: orderData,
                message: "Feedback added successfully",
                error: null
            });
        } catch (err) {
            next(err);
        }
    },

    printInvoice: async (req, res, next) => {
        try {
            let userId = req.decoded._id;
            let id = req.params.id;
            let orders = await orderSchema.findOne({
                $and: [
                    {
                        userId
                    },
                    {
                        _id: id
                    }
                ]
            }).lean();
            let sellerIds = orders?.products?.length ? _.map(orders.products, 'sellerId') : [];
            let sellerData = await sellerSchema.find({
                _id : { $in : sellerIds }
            }, { address: 1, name: 1, gstin: 1, pan: 1}).lean();
            for (let i = 0; i < sellerData.length;i++) {
                let pan = sellerData[i].pan ? await crypto.staticDecrypter(sellerData[i].pan) : '';
                let gstin = sellerData[i].gstin ? await crypto.staticDecrypter(sellerData[i].gstin) : '';
                sellerData[i]['pan'] = pan;
                sellerData[i]['gstin'] = gstin;
            }
            orders['sellerDetails'] = sellerData;
            let userData = await userSchema.findOne({
                _id: userId
            }, { address : 1}).lean();
            orders['userDetails'] = userData;
            return res.json({
                code: 200,
                data: orders,
                message: "",
                error: null
            });
        } catch (err) {
            next(err);
        }
    }
}